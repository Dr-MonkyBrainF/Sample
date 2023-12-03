const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById('score');

class Block {
  constructor() {
    this.width = 200;
    this.x_ = 150;
    this.y = 550;
  }
  get x() {
    return this.x_;
  }
  set x(value) {
    this.x_ = value;
  }
  get start() {
    return this.x_ - this.width / 2;
  }
  get end() {
    return this.x_ + this.width / 2;
  }
  draw = () => {
    ctx.beginPath();
    ctx.moveTo(this.start, this.y)
    ctx.lineTo(this.end, this.y);
    ctx.lineWidth = 10
    ctx.stroke();
  };
  衝突したか = (次の座標, 前の座標) => {
    const x = (this.y - 前の座標.y) * (次の座標.x - 前の座標.x) / (次の座標.y - 前の座標.y) + 前の座標.x;
    return this.start < x && x < this.end && 前の座標.y <= this.y && this.y <= 次の座標.y;
  };
  幅の更新 = () => {
    const newWidth = this.width - 4;
    this.width = Math.max(newWidth, 20);
  }
}

class Ball {
  constructor() {
    this.x = 150;
    this.y = 500;
    //速度
    this.vx = 10;
    this.vy = 5;
    this.radius = 10;
    this.color = "green";
  }
  draw = () => {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  };
  次の位置を計算する = () => [this.x + this.vx, this.y + this.vy];
  壁に衝突するなら向きを変える = () => {
    const [次のx座標, 次のy座標] = this.次の位置を計算する();
    if (次のx座標 < 0 || canvas.width < 次のx座標) {
      this.vx *= -1;
    }
    if (次のy座標 < 0) {
      this.vy *= -1;
    }
  };
  次の位置に移動する = () => {
    this.壁に衝突するなら向きを変える();
    this.x += this.vx;
    this.y += this.vy;
  };
  衝突時は跳ね返る = () => {
    this.vx = -1 * this.vx + Math.trunc(Math.random() * 5) - 2;
    this.vy = -1 * this.vy;
  };
}
let score = 0;
let block = new Block();
let ball = new Ball();
let raf;
let isStart = false;
function drawGame() {
  ctx.fillStyle ="white";
  ctx.fillRect(0,0,canvas.clientWidth,canvas.height);
  ball.draw();
  block.draw();
}
function draw(){
  drawGame();
  const 以前のボール位置 = {
    x: ball.x,
    y: ball.y,
  };
  ball.次の位置に移動する();
  if (block.衝突したか(ball, 以前のボール位置)) {
    scoreElement.textContent = `score: ${++score * 10}`;
    ball.衝突時は跳ね返る();
    block.幅の更新();
    raf = window.requestAnimationFrame(draw);
    return;
  }
  if (ball.y > canvas.height) {
    alert(`${score >= 25 ? 'Congratulation!!!' : 'Game Over!!'}\nYour score is ${score * 10}`);
    isStart = false;
    score = 0;
    scoreElement.textContent = 'score: 0';
    block = new Block();
    ball = new Ball();
    drawGame();
    cancelAnimationFrame(raf);
  }
  else {
    raf = window.requestAnimationFrame(draw);
  }
}

canvas.addEventListener("click", (e) => {
  if (isStart) return;
  isStart = true;
  raf = window.requestAnimationFrame(draw);
});
canvas.addEventListener("mousemove", (イベント) => {
  block.x = イベント.offsetX;
});

drawGame();
