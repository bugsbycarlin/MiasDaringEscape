


var brick_layer = null;
var character_layer = null;
var front_layer = null;

// let brick_colors = [
//   0xCC99C9, // purple,
//   0x9EC1CF, // blue,
//   0x9EE09E, // green,
//   0xFDFD97, // yellow,
//   0xFEB144, // orange,
//   0xFF6663, // red,
//   0xFEDCFF, // pink,
// ]

// let brick_colors = [

//   // 0xb0de61, // green,
//   0xf1d158, // yellow,
//   0xdc7b43, // orange,
//   0xd33c2e, // red,
//   0x75d79f, // teal,
//   0x60b8e1, // light blue,
//   0x4754d3, // dark blue
//   0xc247df, // pink,
// ]

let brick_colors = [


  0x61AFFF, // blue,
  0xF2CD37, // yellow,
  0xFF800D, // orange,
  0xDA1F08, // red,
  0xff83b7, // pink,
  0xa83ea8, // purple,
  0x34b361, // green,
]

let mia = null;
let last_brick_fall = Date.now();
let bricks = [];

let camera = {};
camera.x = 0;
camera.y = 0;

let level_start = 600;
let level_end = 5400;

let brick_heights = {};

function initializeGame() {


  brick_layer = new PIXI.Container();
  stage.addChild(brick_layer);

  character_layer = new PIXI.Container();
  stage.addChild(character_layer);

  effect_layer = new PIXI.Container();
  stage.addChild(effect_layer);

  resetBricks();

  // let sheet = PIXI.Loader.shared.resources["Art/mia_animations.json"].spritesheet;
  // mia = new PIXI.AnimatedSprite(sheet.animations["run"]);
  mia = new PIXI.Container();
  mia.idle = makeAnimatedSprite("Art/mia_animations.json", "idle")
  mia.addChild(mia.idle);
  mia.idle.anchor.set(0.5, 0.9);
  mia.idle.animationSpeed = 0.3;
  
  mia.run = makeAnimatedSprite("Art/mia_animations.json", "run")
  mia.addChild(mia.run);
  mia.run.anchor.set(0.5, 0.9);
  mia.run.animationSpeed = 0.3;
  mia.run.visible = false;

  mia.rise = makeAnimatedSprite("Art/mia_animations.json", "rise")
  mia.addChild(mia.rise);
  mia.rise.anchor.set(0.5, 0.9);
  mia.rise.animationSpeed = 0.3;
  mia.rise.visible = false;

  mia.fall = makeAnimatedSprite("Art/mia_animations.json", "fall")
  mia.addChild(mia.fall);
  mia.fall.anchor.set(0.5, 0.9);
  mia.fall.animationSpeed = 0.3;
  mia.fall.visible = false;

  character_layer.addChild(mia);
  resetMia();
}


function resetGame() {
  resetBricks();
  resetMia();
}


function resetMia() {
  mia.position.set(1024, game_height - 40);
  mia.x_velocity = 0;
  mia.y_velocity = 0;
  mia.old_x = mia.x;
  mia.old_y = mia.y;
  mia.state = "running";
  mia.scale.set(1,1);
  camera.x = mia.x;
  camera.y = mia.y;
  updateCamera();
}


function resetBricks() {
  brick_layer.removeChildren();
  brick_heights = {};

  for (let i = 0; i < 6; i++) {
    let blue_sky = new PIXI.Sprite(PIXI.Texture.from("Art/blue_sky.png"));
    blue_sky.anchor.set(0, 0);
    blue_sky.position.set(1024 * i, 0);
    brick_layer.addChild(blue_sky);
  }

  for (let i = 0; i < 60; i++) {
    if (i % 13 >= 2) {
      let brick = new PIXI.Sprite(PIXI.Texture.from("Art/brick.png"));
      brick.anchor.set(0, 1);
      brick.position.set(120 * i, game_height);
      brick.tint = pick(brick_colors);
      brick.y_velocity = 0;
      brick.stack_number = i;
      brick.state = "stopped";
      brick_layer.addChild(brick);
      bricks.push(brick);
      brick_heights[i] = 1;
    } else {
      brick_heights[i] = 0;
    }
  }
}


function updateCamera() {
  if (camera.x < mia.x - game_width / 10) camera.x = mia.x - game_width / 10;
  if (camera.x > mia.x + game_width / 10) camera.x = mia.x + game_width / 10;
  brick_layer.x = -camera.x + game_width / 2;
  character_layer.x = -camera.x + game_width / 2;
  effect_layer.x = -camera.x + game_width / 2;
}


function updateGame(diff) {
  if (mia == null) return;

  if (key_down["ArrowRight"] == true) {
    if (mia.x_velocity < 0) {
      makeSmoke(effect_layer, mia.x - 20, mia.y - 40, 1.4, 1.4)
      mia.x_velocity = 0;
    }
    mia.x_velocity += 0.6;
    if (mia.x_velocity > 10) mia.x_velocity = 10;
  }

  if (key_down["ArrowLeft"] == true) {
    if (mia.x_velocity > 0) {
      makeSmoke(effect_layer, mia.x + 20, mia.y - 40, 1.4, 1.4)
      mia.x_velocity = 0;
    }
    mia.x_velocity -= 0.6;
    if (mia.x_velocity < -10) mia.x_velocity = -10;
  }

  if (key_down[" "] == true && mia.state != "falling" && mia.state != "dead") {
    mia.y_velocity = -20;
    mia.state = "falling";
    soundEffect("coin");
  }

  mia.old_x = mia.x;
  mia.old_y = mia.y;

  if (mia.x_velocity > 0) mia.scale.set(1,1);
  if (mia.x_velocity < 0) mia.scale.set(-1,1);

  if (mia.state != "falling" && mia.state != "dead"
    && Math.abs(mia.x_velocity) > 0.05) {
    mia.idle.visible = false;
    mia.rise.visible = false;
    mia.fall.visible = false;
    mia.run.visible = true;
    mia.run.play();
  }

  if (mia.state != "falling" && mia.state != "dead"
    && Math.abs(mia.x_velocity) <= 0.5) {
    mia.idle.visible = true;
    mia.run.visible = false;
    mia.rise.visible = false;
    mia.fall.visible = false;
  }

  if (mia.state == "falling") {
    if (mia.y_velocity < -1) {
      mia.rise.visible = true;
      mia.fall.visible = false;
      mia.idle.visible = false;
      mia.run.visible = false;
    } else if (mia.y_velocity > 1) {
      mia.rise.visible = false;
      mia.fall.visible = true;
      mia.idle.visible = false;
      mia.run.visible = false;
      mia.fall.play();
    }
    
  }
   
  mia.x_velocity *= 0.93;

  if (mia.state == "falling" || mia.state == "dead") mia.y_velocity += 0.8;

  if (mia.state == "dead") mia.scale.y = -1;

  mia.y += mia.y_velocity;

  let front = mia.x + mia.x_velocity;
  if (mia.x_velocity > 0) front += 30;
  if (mia.x_velocity < 0) front -= 30;
  let line_number = Math.floor(front / 120);
  let floor = game_height - 36 * brick_heights[line_number];
  if (mia.y <= floor) {
    mia.x += mia.x_velocity;
    if (mia.x > level_end) mia.x = level_end;
    if (mia.x < level_start) mia.x = level_start;
  } else {
    mia.x_velocity = 0;
  }

  updateCamera();

  if (mia.state != "dead") mia.state = "falling";
  for (let i = 0; i < bricks.length; i++) {
    let brick = bricks[i];
    if (brick.state == "falling") {
        brick.y += brick.y_velocity;
        brick.y_velocity += 0.25;

      if (brick.y < mia.y - 10 
        && brick.y > mia.y - 175 
        && mia.x >= brick.x - 30
        && mia.x <= brick.x + 120 + 30
        && mia.state != "dead") {
        console.log("hit one");
        mia.state = "dead";
        mia.y_velocity = -4;
        mia.y -= 175;
        mia.scale.y = -1;
      }

      if (brick_heights[brick.stack_number] > 0
        && brick.y >= game_height - brick_heights[brick.stack_number] * 36) {
        console.log("here");
        brick.y = game_height - brick_heights[brick.stack_number] * 36;
        brick.state = "stopped";
        brick_heights[brick.stack_number] += 1;
      }
    } else if (brick.state == "stopped") {
      let floor = game_height - 36 * brick_heights[brick.stack_number];
      if (mia.state != "dead" && mia.x >= brick.x && mia.x <= brick.x + 120
        && ((mia.y > floor - 4 && mia.y < floor)
          || (mia.old_y < floor && mia.y > floor))) {
        mia.y = floor - 4;
        mia.state = "running";
        mia.y_velocity = 0;
      }
    }
  }

  if (Date.now() - last_brick_fall > 500) {
    last_brick_fall = Date.now();

    let stack_number = dice(60);

    let brick = new PIXI.Sprite(PIXI.Texture.from("Art/brick.png"));
    brick.anchor.set(0, 1.0);
    brick.position.set(120 * stack_number, -50);
    brick.tint = pick(brick_colors);
    brick.y_velocity = 0;
    brick.state = "falling";
    brick.stack_number = stack_number;
    brick_layer.addChild(brick);
    bricks.push(brick);
  }

  if (mia.y > 1200) {
    resetGame();
  }
}

