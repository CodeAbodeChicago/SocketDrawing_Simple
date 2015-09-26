// 
// Global Variables
//

// Connect to server using socket.io 
var socket = io();

// Global variables for our markers
var marker;
var eraser;


// 
// p5 Events
//

function setup() {
	colorMode(HSB, 360, 100, 100, 1);
	createCanvas(windowWidth, windowHeight);	
	background(0);
	strokeCap(ROUND);

	var randHue = random(0, 360);
	marker = new Marker({ h: randHue, s: 100, b: 100 }, 10);
	eraser = new Marker({ h: 0, s: 0, b: 0 }, 50); // Thick black marker
}

function draw() {
	if (mouseIsPressed) {
		// Draw with marker
		if (mouseButton === LEFT) {
			var p1 = { x: pmouseX, y: pmouseY };
			var p2 = { x: mouseX, y: mouseY };
			markerDraw(p1, p2, marker);
			sendMarkerMessage(p1, p2, marker);
		}
		// Eraser (e.g. draw with black)
		else if (mouseButton === RIGHT) {
			var p1 = { x: pmouseX, y: pmouseY };
			var p2 = { x: mouseX, y: mouseY };
			markerDraw(p1, p2, eraser);
			sendMarkerMessage(p1, p2, eraser);
		}
	}
}

function markerDraw(p1, p2, currentMarker) {
	strokeWeight(currentMarker.thickness);
	stroke(currentMarker.color.h, currentMarker.color.s, currentMarker.color.b);
	line(p1.x, p1.y, p2.x, p2.y);
}


// 
// Socket Logic
//

function sendMarkerMessage(p1, p2, currentMarker) {
	socket.emit("player drawing", {
		p1: p1,
		p2: p2,
		marker: currentMarker
	});	
}

socket.on("player drawing", function (drawData) {
	console.log("Server told me to draw another player");
	markerDraw(drawData.p1, drawData.p2, drawData.marker);
});
