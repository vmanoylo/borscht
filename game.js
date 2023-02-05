const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const canvasSize = [1400, 800];
const playerSize = [150, 150];
const rabbitSize = [100, 100];
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
  rabbit: new Image(),
  pot: new Image(),
  stump: new Image(),
  beet: new Image(),
  carrot: new Image(),
  potato: new Image(),
  onion: new Image(),
  step: new Audio("sound/step.mp3"),
};
assets.background.src = "img/bg.png";
assets.player.src = "img/voi_sheet.png";
assets.rabbit.src = "img/Rabbit.png";
assets.pot.src = "img/Pot.png";
assets.stump.src = "img/Stump.png";
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

let player = new gameThing(
  new animatedSprite(assets.player, [2360, 2254], 4, 15),
  playerSize,
  [300, floor - playerSize[1]]
);
let rabbit = new gameThing(
  new animatedSprite(assets.rabbit, [500, 500], 2, 15),
  playerSize,
  [1200, floor - rabbitSize[1]]
);
let pot = new gameThing(
  new animatedSprite(assets.pot, [500, 500], 2, 15),
  potSize,
  [100, floor - 100]
);
let stump = new gameThing(
  new animatedSprite(assets.stump, [500, 500], 2, 15),
  potSize,
  [200, floor - 100]
);
let beet = new gameThing(
  new animatedSprite(assets.beet, [300, 1000], 2, 15),
  beetSize,
  [600, floor - 50]
);
let carrot = new gameThing(
  new animatedSprite(assets.carrot, [300, 1000], 2, 15),
  carrotSize,
  [700, floor - 50]
);
let potato = new gameThing(
  new animatedSprite(assets.potato, [325, 1000], 2, 15),
  potatoSize,
  [800, floor - 50]
);
let onion = new gameThing(
  new animatedSprite(assets.onion, [325, 1000], 2, 15),
  onionSize,
  [900, floor - 80]
);
const veg = [beet, carrot, potato, onion];

let gameState = {
  holding: null,
  pot: new Set(),
  gameOver: false,
  playerDest: player.pos[0],
};
const playerSpeed = 5;

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
  let dist = gameState.playerDest - player.pos[0];
  if (dist < playerSpeed && dist > -playerSpeed) {
    player.pos[0] = gameState.playerDest;
  } else {
    assets.step.play();
    player.pos[0] +=
      player.pos[0] < gameState.playerDest ? playerSpeed : -playerSpeed;
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
  gameState.playerDest = x;
};

function game() {
  if (gameState.gameOver) {
    drawEnd();
  } else {
    drawBg();
    updatePlayer();
    updateVeg();
    player.draw();
    rabbit.draw();
    pot.draw();
    stump.draw();
    drawVeg();
    window.requestAnimationFrame(game);
  }
}
game();
