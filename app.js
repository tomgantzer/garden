// SERVER VARIABLES
var http = require('http');
var express = require('express');
var app = express();
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var server = http.createServer(app).listen(8080);
var io = require('socket.io')(server);
var fs = require('fs');
var os = require('os');
var shell = require('shelljs');
var pixel = require("node-pixel");
var five = require("johnny-five");
var board = new five.Board();
var penner = require("penner");

//////////// PROGRAM VARIABLES ////////////////
var networks = os.networkInterfaces();
var preExit = [];

var fps = 10;
var colours = [red, green, blue];
var animation = "rainbow dynamic";

var isOn = true;
var lastInterval;

var red = 0;
var green = 128;
var blue = 128;

//////////// NODE SETUP ////////////////

app.use(express.static(__dirname + '/'));
app.get('/', function(req, res) {
  	res.sendFile(__dirname + '/index.html');
});
// console.log('Server available at http://localhost:8080');

//////  SERIALPORT + SOCKET INIT /////
io.on('connection', function (socket) {
	// console.log("Socket IO initalised");

  socket.on("change red", function(newRed) {
    // console.log("red changed to", newRed);
    red = newRed;
  });
  socket.on("change green", function(newGreen) {
    // console.log("green changed to", newGreen);
    green = newGreen;
  });
  socket.on("change blue", function(newBlue) {
    // console.log("blue changed to", newBlue);
    blue = newBlue;
  });

  socket.on("animation change", function(newAnimation) {
    clearInterval(lastInterval);
    // console.log("animation changed to " + newAnimation);
    animation = newAnimation;
    switchAnimation();
  });

  socket.on("on off", function() {
    if (isOn) {
      isOn = false;
      clearInterval(lastInterval);
      // console.log("lights switched off");
      strip.off();
      strip.show();
    }
    else {
      isOn = true;
      // console.log("lights switched on");
      clearInterval(lastInterval);
      switchAnimation();
    }
  });
});

board.on("ready", function() {
  strip = new pixel.Strip({
      board: this,
      controller: "FIRMATA",
      strips: [
        {
          pin: 3,
          length: 50,
          color_order: pixel.COLOR_ORDER.RGB,
        }
      ]
  });

  strip.on("ready", function() {
    // console.log("Strip ready, let's go");
    switchAnimation();
  });
});

function switchAnimation(){
  switch (animation) {
    case "rainbow dynamic":
      dynamicRainbow(fps);
      break;
    case "rainbow twinkle":
      dynamicTwinkle(fps);
      break;
    case "custom static":
      customStatic(fps);
      break;
    case "custom twinkle":
      customTwinkle(fps);
      break;
  }
}

function dynamicRainbow(delay){
  // console.log('rainbow dynamic');
  var showColor;
  var cwi = 0;
  var foo = setInterval(function(){
    if (++cwi > 255) {
      cwi = 0;
    }

    for(var i = 0; i < strip.stripLength(); i++) {
      showColor = colorWheel( ( cwi+i ) & 255 );
      strip.pixel( i ).color( showColor );
    }
    strip.show();
  }, 1000/delay);
  lastInterval = foo;
}

function dynamicTwinkle(delay){
  // console.log('rainbow twinkle');
  var showColor;
  var cwi = 0;
  var foo = setInterval(function(){
    if (++cwi > 255) {
      cwi = 0;
    }

    for(i = 0; i < strip.stripLength(); i++) {
      showColor = colorWheel( ( cwi+i ) & 255 );
      strip.pixel( i ).color( showColor );
    }
    for (x = 0; x < 2; x++) {
      var twinkle = getRandomPixel(strip.stripLength());
      strip.pixel(twinkle).color([255,255,255]);
      strip.show();
    }
    strip.show();
  }, 1000/delay);
  lastInterval = foo;
}

function customStatic(delay){
  // console.log('custom static');
  var foo = setInterval(function() {
      for(i = 0; i < strip.stripLength(); i++) {
        strip.pixel(i).color([red,green,blue]);
      }
      strip.show();
  }, 1000/delay);
  lastInterval = foo;
}

function customTwinkle(delay){
  // console.log('custom twinkle');
  var foo = setInterval(function() {
    strip.color([red,green,blue]);
    strip.show();

    for (x = 0; x < 2; x++) {
      var twinkle = getRandomPixel(strip.stripLength());
      strip.pixel(twinkle).color([255,255,255]);
      strip.show();
    }
  }, 1000/delay);
  lastInterval = foo;
}

function colorWheel( WheelPos ){
  var r,g,b;
  WheelPos = 255 - WheelPos;

  if ( WheelPos < 85 ) {
      r = 255 - WheelPos * 3;
      g = 0;
      b = WheelPos * 3;
  } else if (WheelPos < 170) {
      WheelPos -= 85;
      r = 0;
      g = WheelPos * 3;
      b = 255 - WheelPos * 3;
  } else {
      WheelPos -= 170;
      r = WheelPos * 3;
      g = 255 - WheelPos * 3;
      b = 0;
  }
  return "rgb(" + r +"," + g + "," + b + ")";
}

function getRandomPixel(max) {
  return Math.floor(Math.random() * max);
}
