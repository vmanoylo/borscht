const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const canvasSize = [1400, 800];
const playerSize = [150, 150];
const potSize = [100, 100];
const beetSize = [50, 100];
const carrotSize = [20, 80];
const potatoSize = [50, 80];
const onionSize = [50, 100];
const floor = 720;

// assets
const assets = {
  background: new Image(),
  end: new Image(),
  player: new Image(),
  pot: new Image(),
  beet: new Image(),
  carrot: new Image(),
  potato: new Image(),
  onion: new Image(),
};
assets.background.src = "img/bg.png";
assets.player.src = "img/voi_sheet.png";
assets.pot.src = "img/Pot.png";
assets.beet.src = "img/Beet.png";
assets.carrot.src = "img/Carrot.png";
assets.potato.src = "img/Potato.png";
assets.onion.src = "img/Onion.png";
assets.end.src = "img/Soup.png";

function gameThing(sprite, size, pos) {
  this.sprite = sprite;
  this.size = size;
  this.pos = pos;
  this.draw = function () {
    this.sprite.draw(pos, size);
  };
}

function animatedSprite(img, size, frames, nextFrame) {
  this.img = img;
  this.size = size;
  this.frames = frames;
  this.nextFrame = nextFrame;
  this.timer = 0;
  this.index = 0;
  this.draw = function (pos, size) {
    this.timer++;
    if (this.timer > this.nextFrame) {
      this.timer = 0;
      this.index++;
      this.index %= this.frames;
    }
    ctx.drawImage(
      this.img,
      this.index * this.size[0],
      0,
      this.size[0],
      this.size[1],
      pos[0],
      pos[1],
      size[0],
      size[1]
    );
  };
}

let playerDest = 200;
const playerSpeed = 5;
let player = new gameThing(
  new animatedSprite(assets.player, [2360, 2254], 4, 15),
  playerSize,
  [200, floor - playerSize[1]]
);
let pot = new gameThing(
  new animatedSprite(assets.pot, [500, 500], 2, 15),
  potSize,
  [100, floor - 100]
);
let beet = new gameThing(
  new animatedSprite(assets.beet, [300, 1000], 2, 15),
  beetSize,
  [400, floor - 50]
);
let carrot = new gameThing(
  new animatedSprite(assets.carrot, [300, 1000], 2, 15),
  carrotSize,
  [600, floor - 50]
);
let potato = new gameThing(
  new animatedSprite(assets.potato, [325, 1000], 2, 15),
  potatoSize,
  [800, floor - 50]
);
let onion = new gameThing(
  new animatedSprite(assets.onion, [325, 1000], 2, 15),
  onionSize,
  [1000, floor - 80]
);
const veg = [beet, carrot, potato, onion];

let gameState = {
  holding: null,
  // beetHeld: false,
  pot: new Set(),
  // beetInPot: false,
  gameOver: false,
};

function near(a, b, d) {
  return Math.abs(a - b) < d;
}

function drawBg() {
  ctx.drawImage(assets.background, 0, 0, canvasSize[0], canvasSize[1]);
}
function drawEnd() {
  ctx.drawImage(assets.end, 0, 0, canvasSize[0], canvasSize[1]);
}

function updatePlayer() {
  let dist = playerDest - player.pos[0];
  if (dist < playerSpeed && dist > -playerSpeed) {
    player.pos[0] = playerDest;
  } else if (player.pos[0] < playerDest) {
    player.pos[0] += playerSpeed;
  } else {
    player.pos[0] -= playerSpeed;
  }
}

function updateVeg() {
  for (let it of veg) {
    if (!gameState.pot.has(it)) {
      if (gameState.holding == it) {
        if (near(player.pos[0], pot.pos[0], 40)) {
          gameState.holding = null;
          gameState.pot.add(it);
        }
        it.pos[0] = player.pos[0] + 80;
        it.pos[1] = player.pos[1];
      } else if (
        gameState.holding == null &&
        near(player.pos[0], it.pos[0], 40)
      ) {
        gameState.holding = it;
      }
    }
  }
  if (gameState.pot.size == veg.length) {
    gameState.gameOver = true;
  }
}

function drawVeg() {
  for (let v of veg) {
    if (!gameState.pot.has(v)) v.draw();
  }
}

canvas.onclick = function (event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left - player.size[0] / 2;
  // const y = event.clientY - rect.top;
  playerDest = x;
};

function game() {
  if (gameState.gameOver) {
    drawEnd();
  } else {
    drawBg();
    updatePlayer();
    updateVeg();
    player.draw();
    pot.draw();
    drawVeg();
    window.requestAnimationFrame(game);
  }
}
game();
