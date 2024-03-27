var canvas;
var ctx;
const W = 400;
const H = 600;

const marginX = 10;
const paletteW = (0.3 * W) % W;
var paletteX = (W - paletteW) / 2;
var paletteOffset = 20;
const moveBy = 30;
// TODO: speed units - px/s?
const maxVelocity = 100; // TODO: px/s
const ballR = 10;
var ballX = W / 2;
var ballY = H / 2;
var ballVelocityX = 2;
var ballVelocityY = 5;
var paused = false;

window.onload = (e) => {
	console.log("Window load");
	canvas = document.getElementById("game");
	canvas.width = W;
	canvas.height = H;
	canvas.style.width = W + "px";
	canvas.style.height = H + "px";

	ctx = canvas.getContext("2d");

	document.body.addEventListener("keydown", canvasKeydown)

	window.setInterval(() => {
		if (paused) {
			return;
		}
		render();
		moveBall();
	}, 16);
};

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "black";
	ctx.fillRect(paletteX, paletteOffset - 10, paletteW, paletteOffset);
	// ball
	ctx.beginPath();
	ctx.arc(ballX, ballY, ballR, 0, 2 * Math.PI);
	ctx.fillStyle = "green";
	ctx.fill();
}

function moveBall() {
	// TODO: split move to
	// - before collision
	// - after collision
	if (ballX + ballVelocityX >= W) {
		// vertical reflection
		ballVelocityX = -ballVelocityX;
	} else if (ballX + ballVelocityX < 0) {
		ballVelocityX = -ballVelocityX;
	}
	bounced = false;

	if (ballY + ballVelocityY < paletteOffset) {
		if (ballX >= paletteX && ballX <= paletteX + paletteW) {
			// TODO: adjust rebound angle to relative palette-ball velocity
			console.log("BOUNCE");
			bounced = true;
			ballVelocityY = -ballVelocityY;
		}
	}

	if (!bounced) {
		if (ballY + ballVelocityY >= H) {
			// horizontal rebound - todo palette plane
			ballVelocityY = -ballVelocityY;
			console.log("GAME OVER BOTTOM");
		} else if (ballY + ballVelocityY < 0) {
			ballVelocityY = -ballVelocityY;
			console.log("GAME OVER TOP");
		}

		// assuming move per tick not greater than game board
		ballX += ballVelocityX;
		ballY += ballVelocityY;
	}
}

function canvasKeydown(e) {
	console.log("canvasKeydown:", e.key);
	if (paused && e.key != ' ') {
		return;
	}
	switch (e.key) {
		case 'ArrowLeft':
			paletteX = Math.max(marginX, paletteX - moveBy);
			break;
		case 'ArrowRight':
			paletteX = Math.min(W - paletteW - marginX, paletteX + moveBy);
			break;
		case ' ':
			paused = !paused;
			break;
	}
}
