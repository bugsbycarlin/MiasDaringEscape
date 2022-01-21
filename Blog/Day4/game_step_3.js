
// Welcome! This is where you'll write your game code.
// Anything with two // slashes in front is a comment.
// The computer ignores comments. They're for humans
// to explain things to other humans.

let mia = null;
let bricks = [];
let stacks = {};
let colors = [
  color(1,0,0), // Red
  color(0,1,0), // Green
  color(0,0,1), // Blue
]

let tracker = 0;

let last_brick = Date.now();


music_volume = 0.4;
sound_volume = 0.6;
setMusic("music_6");


function initializeGame() {

  for (num = -1; num < 8; num += 1) {
    let blue_sky = makeSprite("Art/blue_sky.png");
    blue_sky.position.set(game_width * num, 0);
    stage.addChild(blue_sky);
  }

  for (num = -8; num < 70; num += 1) {

    if (num % 16 < 14) {
      let brick = makeSprite("Art/brick.png");
      brick.anchor.set(0.5,1);
      brick.position.set(120 * num, game_height);
      brick.tint = pick(colors);
      stage.addChild(brick);
      bricks.push(brick);

      brick.column = num;
      brick.y_velocity = 0;
      stacks[brick.column] = 1;
    }
    else {
      stacks[num] = -100;
    }
  }

  mia = makeAnimatedSprite("Art/mia_animations.json", "run");
  mia.anchor.set(0.5, 0.9);
  mia.position.set(200, game_height - 40);
  stage.addChild(mia);
  mia.animationSpeed = 0.3;
  mia.play();
  mia.state = "running";
  mia.y_velocity = 0;
}


// Keep Mia roughly in the center of the screen by using a tracker
// which stays within 100 pixels of Mia, and then moving the whole stage
// so that the tracker stays in the center of the screen.
function followMia() {

  if (mia.x - tracker > 100) {
    tracker = mia.x - 100;
  }

  if (tracker - mia.x > 100) {
    tracker = mia.x + 100;
  }

  stage.x = (game_width / 2 - tracker);
}


// Every 250 milliseconds, drop a brick.
function dropBricks() {

  if (Date.now() - last_brick > 250) {

    // Make a new brick
    let brick = makeSprite("Art/brick.png");
    brick.anchor.set(0.5,1);
    brick.tint = pick(colors);

    // Set it in the right place and give it some drop speed.
    brick.column = dice(70);
    brick.position.set(120 * brick.column, -50);
    brick.y_velocity = 1;
    
    // Add it to the stage, and add it to the list of bricks.
    stage.addChild(brick);
    bricks.push(brick);

    last_brick = Date.now();
  }

  // For every brick, if it has y_velocity, drop it.
  for (i = 0; i < bricks.length; i += 1) {
    let brick = bricks[i];

    if (brick.y_velocity > 0) {
      brick.y = brick.y + brick.y_velocity;
      brick.y_velocity = brick.y_velocity + 0.25;

      // If it goes past the brick stack, stop it,
      // and increase the stack value.
      if (brick.y >= game_height - 36 * stacks[brick.column]) {
        brick.y = game_height - 36 * stacks[brick.column];
        brick.y_velocity = 0;
        stacks[brick.column] = stacks[brick.column] + 1;
      }
    }
  }
}


function testBricks() {

  // Don't test anything if Mia is already kaput
  if (mia.state == "kaput") return;

  mia.column = Math.floor((mia.x + 60) / 120);

  // Don't test bricks if Mia is too far to the left or right.
  if (mia.column < -8 || mia.column >= 70) return;

  // Figure out the floor for Mia's current column.
  let floor_height = game_height - 36 * stacks[mia.column] - 4;

  // First, check if Mia has run into thin air,
  // like Wile E Coyote, and make her fall.
  if (mia.y < floor_height) {
    mia.state = "falling"
  }

  // Check if Mia has fallen on top of the current stack.
  if (mia.state == "falling" && mia.y >= floor_height && mia.y_velocity > 0) {
    mia.y = floor_height;
    mia.y_velocity = 0;
    mia.state = "running";
    soundEffect("hyah_3")
  }

  // Then, loop through the whole brick list
  for (i = 0; i < bricks.length; i += 1) {
    let brick = bricks[i];

    // If a brick is not falling, make sure Mia can't run through it.
    if (brick.y_velocity == 0) {

      // Calculate the floor height of this particular brick
      this_brick_floor_height = game_height - 36 * stacks[brick.column] - 4;
      // If Mia is below this brick's floor height, and she's too close
      // to the brick, push her back out.
      if (Math.abs(mia.x - brick.x) < 90 && mia.y > this_brick_floor_height) {
        if (mia.x < brick.x) mia.x = mia.x - 7;
        if (mia.x > brick.x) mia.x = mia.x + 7;
      }
    }
    else if (brick.y_velocity > 0 && mia.state != "kaput") {
      // If Mia is too close to a falling brick, she goes kaput.
      if (Math.abs(mia.x - brick.x) < 80
        && brick.y < mia.y - 10
        && brick.y > mia.y - 175) {
        mia.state = "kaput";
        mia.scale.y = -1;
        mia.y_velocity = -5;
        mia.y = mia.y - 175;
      }
    }
  }
}


function updateGame(diff) {

  // Don't try to update the game until we've created Mia,
  // or the game will crash.
  if (mia == null) return;

  dropBricks();

  // If the right key got pushed, move Mia to the right
  if (key_down["ArrowRight"]) {
    mia.last_x = mia.x;
    mia.x = mia.x + 7;
    if (mia.state != "kaput") mia.scale.set(1,1);
    if (mia.state == "running" && mia.last_arrow == "left") makeSmoke(stage, mia.x - 20, mia.y - 40, 1.4, 1.4);
    mia.last_arrow = "right";
  }

  // If the left key got pushed, move Mia to the left
  if (key_down["ArrowLeft"]) {
    
    mia.last_x = mia.x;
    mia.x = mia.x - 7;
    if (mia.state != "kaput") mia.scale.set(-1,1);
    if (mia.state == "running" && mia.last_arrow == "right") makeSmoke(stage, mia.x + 20, mia.y - 40, 1.4, 1.4);
    mia.last_arrow = "left";
  }

  // If the space bar got pushed, make Mia jump
  if (key_down[" "] && mia.state == "running") {
    mia.state = "jumping";
    mia.y_velocity = -20;
    soundEffect("jump_3");
    if (mia.last_arrow == "left") makeSmoke(stage, mia.x + 20, mia.y - 40, 1.4, 1.4);
    if (mia.last_arrow == "right") makeSmoke(stage, mia.x - 20, mia.y - 40, 1.4, 1.4);
  }

  // If Mia is jumping, move her upwards, use gravity to pull her downwards,
  // and if she reaches the ground, stop the jump.
  if (mia.state == "jumping" || mia.state == "falling" || mia.state == "kaput") {
    mia.y = mia.y + mia.y_velocity;
    mia.y_velocity = mia.y_velocity + 0.8;

    if (mia.y_velocity > 0 && mia.state == "jumping") {
      // switch to falling
      mia.state = "falling";
    }
  }

  testBricks();

  if (mia.y > 1200) {
    stage.removeChildren();
    bricks = [];
    stacks = {};
    initializeGame();
  }

  followMia();
}


