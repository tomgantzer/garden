var socket = io.connect('http://localhost:8080');

$(document).ready(function() {
	$("#sliderRed").rangeslider({
	    polyfill: false,
	    rangeClass: 'rangeslider',
	    disabledClass: 'rangeslider--disabled',
	    horizontalClass: 'rangeslider--horizontal',
	    verticalClass: 'rangeslider--vertical',
	    fillClass: 'rangeslider__fill',
	    handleClass: 'rangeslider__handle',
	    // Callback function
	    onInit: function() {
				console.log("red init");
			},

	    // Callback function
	    onSlide: function(position, value) {
				console.log("red sliding");
			},

	    // Callback function
	    onSlideEnd: function(position, value) {
				console.log("red slide ended");
				socket.emit("change red", value);
			}
	});
	$("#sliderGreen").rangeslider({
	    polyfill: false,
	    rangeClass: 'rangeslider',
	    disabledClass: 'rangeslider--disabled',
	    horizontalClass: 'rangeslider--horizontal',
	    verticalClass: 'rangeslider--vertical',
	    fillClass: 'rangeslider__fill',
	    handleClass: 'rangeslider__handle',
	    // Callback function
	    onInit: function() {
				console.log("green init");
			},

	    // Callback function
	    onSlide: function(position, value) {
				console.log("green sliding");
			},

	    // Callback function
	    onSlideEnd: function(position, value) {
				console.log("green slide ended");
				socket.emit("change green", value);
			}
	});
	$("#sliderBlue").rangeslider({
	    polyfill: false,
	    rangeClass: 'rangeslider',
	    disabledClass: 'rangeslider--disabled',
	    horizontalClass: 'rangeslider--horizontal',
	    verticalClass: 'rangeslider--vertical',
	    fillClass: 'rangeslider__fill',
	    handleClass: 'rangeslider__handle',
	    // Callback function
	    onInit: function() {
				console.log("blue init");
			},

	    // Callback function
	    onSlide: function(position, value) {
				console.log("blue sliding");
			},

	    // Callback function
	    onSlideEnd: function(position, value) {
				console.log("blue slide ended");
				socket.emit("change blue", value);
			}
	});
});
