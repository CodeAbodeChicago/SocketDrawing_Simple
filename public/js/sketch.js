var socket = io();
var playerColor;
var eraserColor = { h: 0, s: 0, b: 0 };
var registered = false;

socket.on("player registration", function (registrationData) {
	console.log("Client registered with the server!");
	registered = true;
	playerColor = registrationData.color;
});

socket.on("player drawing", function (drawData) {
	console.log("Server told me to draw another player");
	console.log(drawData);
	var p1 = drawData.p1;
	var p2 = drawData.p2;
	var c = drawData.color;
	var weight = drawData.strokeWeight;
	markerDraw(p1.x, p1.y, p2.x, p2.y, c, weight);
});

// Disable right click popup
document.body.oncontextmenu = function (event) { 
	event.preventDefault();
	return false; 
}

function setup() {
	colorMode(HSB, 360, 100, 100, 1);
	createCanvas(windowWidth, windowHeight);	
	background(0);
	strokeCap(ROUND);
}

function draw() {
	if (!registered) return;

	if (mouseIsPressed) {
		// Draw with marker
		if (mouseButton === LEFT) {
			markerDraw(pmouseX, pmouseY, mouseX, mouseY, playerColor, 10);
			sendMarkerMessage(pmouseX, pmouseY, mouseX, mouseY, playerColor, 10);
		}
		// Eraser (e.g. draw with black)
		else if (mouseButton === RIGHT) {
			markerDraw(pmouseX, pmouseY, mouseX, mouseY, eraserColor, 50);
			sendMarkerMessage(pmouseX, pmouseY, mouseX, mouseY, eraserColor, 50);
		}
	}
}

function markerDraw(x1, y1, x2, y2, color, weight) {
	strokeWeight(weight);
	stroke(color.h, color.s, color.b);
	line(x1, y1, x2, y2);
}
function sendMarkerMessage(x1, y1, x2, y2, color, weight) {
	socket.emit("player drawing", {
		p1: { x: x1, y: y1 },
		p2: { x: x2, y: y2 },
		color: color,
		strokeWeight: weight
	});	
}