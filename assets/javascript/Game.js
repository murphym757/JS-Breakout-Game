const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 5;
let dy = -5;
let ballRadius = 10; // Size of Ball
let paddleHeight = 10; // Paddle's Thickness
let paddleWidth = 75; // Paddle's Length
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 6;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let score = 0;
let lives = 3;
let color = "#FEFEFE"

let bricks = [];
for (c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (r = 0; r < brickRowCount; r++) {
    bricks[c][r] = {
      x: 0,
      y: 0,
      status: 1
    };
  }
}

//Control Calls
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("touchstart", touchHandler, false);
document.addEventListener("touchmove", touchHandler);

//Bricks
function drawBricks() {
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}


function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

//mouse support
function mouseMoveHandler(e) {
  movePaddleByClientX(e.clientX);
}

//touch support
function touchHandler(e) {
  if (e.touches) {
    e.preventDefault();

    let touches = e.changedTouches;

    for (let i = 0; i < touches.length; i++) {
      let touch = touches[i];
      movePaddleByClientX(touch.clientX);
    }
  }
}

//Connects both mouse and touch support
function movePaddleByClientX(clientX) {
  let relativeX = clientX - canvas.offsetLeft;
  if (relativeX > 0 && (relativeX + (paddleWidth / 2)) < canvas.width) {
    let newX = relativeX - paddleWidth / 2;

    if (newX <= 0) {
      paddleX = 0;
    } else if (newX >= canvas.width) {
      paddleX = canvas.width;
    } else {
      paddleX = newX;
    }
  }
}

//Breaking Bricks
function collisionDetection() {
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status == 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score == brickRowCount * brickColumnCount) {
            alert("Congratulations, You've Won!!!");
            document.location.reload();
          }
        }
      }
    }
  }
}

//Score (or Broken Bricks)
function drawScore() {
  ctx.font = "12px orbitron";
  ctx.fillStyle = "#FEFEFE";
  ctx.fillText("Broken Bricks: " + score, 8, 20);
}

//Lives
function drawLives() {
  ctx.font = "12px orbitron";
  ctx.fillStyle = "#FEFEFE";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

//Ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#FEFEFE";
  ctx.fill();
  ctx.closePath();
}

//Paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#FEFEFE";
  ctx.fill();
  ctx.closePath();
}

//The Entire Game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
    color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        alert("You've broken " + score + " bricks!");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 5;
        dy = -5;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

//Prints everything to the screen
draw();
