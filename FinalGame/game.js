
// Welcome! This is where you'll write your game code.
// Anything with two // slashes in front is a comment.
// The computer ignores comments. They're for humans
// to explain things to other humans.

let mia = null;
let rocket = null;
let rocket_door = null;
let bricks = [];
let shakos = [];
let stacks = {};
let blasts = [];
let colors = [
  // Red brick color scheme
  color(0.97, 0.97, 0.97),
  color(0.97, 0.72, 0.72),
  color(0.97, 0.48, 0.48),
  color(0.97, 0.23, 0.23),
  color(0.97, 0.00, 0.00),
]

let tracker = 0;

let last_brick = Date.now();


music_volume = 0.4;
sound_volume = 0.6;
setMusic("music_3");


function initializeGame() {

  for (num = -1; num < 11; num += 1) {
    let blue_sky = makeSprite("Art/blue_sky.png");
    blue_sky.position.set(game_width * num, 0);
    stage.addChild(blue_sky);
  }

  for (num = -8; num < 90; num += 1) {

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

  for (num = 1; num <= 8; num += 1) {
    
    // pick a random column,
    let column = 5 + dice(65);

    // and only make the shako if that column isn't a pit.
    if (stacks[column] > 0) {

      let shako = makeContainer();
      shako.spear_forward = makeSprite("Art/shako_spear_forward.png");
      shako.spear_forward.anchor.set(0.5, 1);
      shako.addChild(shako.spear_forward);

      shako.spear_up = makeSprite("Art/shako_spear_up.png");
      shako.spear_up.anchor.set(0.5, 1);
      shako.addChild(shako.spear_up);

      shako.position.set(120 * column, game_height - 36);
      shako.y_velocity = 0;
      shako.x_velocity = 0;
      shako.state = "ground";
      shako.ground_time = 0;
      shako.jumps = 0;

      stage.addChild(shako);
      shakos.push(shako);

      shako.setStance = function(stance) {
        if (stance == "up") {
          shako.stance = "up";
          shako.spear_up.visible = true;
          shako.spear_forward.visible = false;
        } else if (stance == "forward") {
          shako.stance = "forward";
          shako.spear_up.visible = false;
          shako.spear_forward.visible = true;
        }
      }

      shako.setStance("up");
    }
  }

  rocket = makeSprite("Art/rocket.png");
  rocket.anchor.set(0.5, 1);
  rocket.position.set(9960, game_height - 34);
  rocket.y_velocity = 0;
  rocket.state = "ground";
  stage.addChild(rocket);

  rocket_door = makeSprite("Art/rocket_door.png");
  rocket_door.anchor.set(0.5, 1);
  rocket_door.position.set(9960, game_height - 34);
  stage.addChild(rocket_door);

  mia = makeContainer();

  mia.run = makeAnimatedSprite("Art/mia_animations.json", "run");
  mia.run.anchor.set(0.5, 0.9);
  mia.run.animationSpeed = 0.3;
  mia.run.play();
  mia.addChild(mia.run);

  mia.fall = makeAnimatedSprite("Art/mia_animations.json", "fall");
  mia.fall.anchor.set(0.5, 0.9);
  mia.fall.animationSpeed = 0.3;
  mia.fall.play();
  mia.addChild(mia.fall);

  mia.rise = makeAnimatedSprite("Art/mia_animations.json", "rise");
  mia.rise.anchor.set(0.5, 0.9);
  mia.addChild(mia.rise);

  mia.idle = makeAnimatedSprite("Art/mia_animations.json", "idle");
  mia.idle.anchor.set(0.5, 0.9);
  mia.addChild(mia.idle);

  mia.blasting = makeAnimatedSprite("Art/mia_animations.json", "blasting");
  mia.blasting.anchor.set(0.5, 0.9);
  mia.addChild(mia.blasting);

  // Change mia's state
  mia.setState = function(state) {
    mia.state = state;

    // Set all sprites invisible
    mia.run.visible = false;
    mia.fall.visible = false;
    mia.rise.visible = false;
    mia.idle.visible = false;
    mia.blasting.visible = false;

    // Then set the right state back to visible
    if (mia.state == "running") mia.run.visible = true;
    if (mia.state == "falling") mia.fall.visible = true;
    if (mia.state == "jumping") mia.rise.visible = true;
    if (mia.state == "blasting") mia.blasting.visible = true;
    if (mia.state == "idle" || mia.state == "kaput") mia.idle.visible = true;
  }
  
  mia.position.set(200, game_height - 40);
  mia.setState("idle");
  mia.y_velocity = 0;
  mia.x_velocity = 0;
  mia.max_x_velocity = 8;
  mia.last_blast = Date.now();
  stage.addChild(mia);
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

  // Delete every brick that's hit a shako.
  // Note that we run the loop BACKWARDS.
  for (brick_num = bricks.length - 1; brick_num >= 0; brick_num += -1) {
    let brick = bricks[brick_num];

    if (brick.y_velocity > 0) {
      // By default, assume the brick hasn't hit a shako
      let hit_a_shako = false;

      // Loop through all the shakos
      for (shako_num = 0; shako_num < shakos.length; shako_num += 1) {
        let shako = shakos[shako_num];
        
        // If the shako and the brick are close together,
        if (Math.abs(shako.x - brick.x) <= 60 && brick.y > game_height - 36 - 160) {
          hit_a_shako = true;
        }
      }

      // If the brick has touched any shako, hit_a_shako will be true.
      if (hit_a_shako) {

        // This line is like "delete item number such and such from the list"
        bricks.splice(brick_num, 1);

        // Remove the brick from the stage
        stage.removeChild(brick);

        // Make a bunch of little brick debris!
        makeBrickBit(stage, brick.x - 45, brick.y, brick.tint);
        makeBrickBit(stage, brick.x - 15, brick.y, brick.tint);
        makeBrickBit(stage, brick.x + 15, brick.y, brick.tint);
        makeBrickBit(stage, brick.x + 45, brick.y, brick.tint);

        // If mia is close enough, make some popping sounds.
        if (Math.abs(brick.x - mia.x) < 700) {
          soundEffect("pop_1");
          soundEffect("pop_2");
        }
      }
    }
  }
}


function updateBlasts() {

  for (blast_num = 0; blast_num < blasts.length; blast_num += 1) {
    let blast = blasts[blast_num];

    blast.x = blast.x + blast.x_velocity;

    for (shako_num = 0; shako_num < shakos.length; shako_num += 1) {
      let shako = shakos[shako_num];

      if (Math.abs(blast.x - shako.x) < 60
        && blast.y > shako.y - 170
        && blast.y < shako.y
        && shako.state != "kaput") {

        shako.state = "kaput";
        shako.scale.y = -1;
        shako.y_velocity = -5;
        shako.y = shako.y - 175;
        if (Math.abs(mia.x - shako.x) < 700) soundEffect("hurt");

        blast.state = "done";
        blast.visible = false;
        makeBlastEnergy(stage, color(0,0,1), blast.x, blast.y, 0.75, 0.75);
      }
    }
  }


  for (blast_num = blasts.length - 1; blast_num >= 0; blast_num += -1) {
    let blast = blasts[blast_num];

    if (blast.state == "done" || blast.x > blast.original_x + 900 || blast.x < -1000) {
      blasts.splice(blast_num, 1);
      stage.removeChild(blast);
    }
  }
}


function updateShakos() {
  for (num = 0; num < shakos.length; num += 1) {
    let shako = shakos[num];

    if (shako.state == "ground" && Date.now() - shako.ground_time > 150) {
      shako.state = "jumping";
      shako.y_velocity = -5;
      shako.x_velocity = -1 * shako.scale.x * 30/22;
      if (Math.abs(mia.x - shako.x) < 700) soundEffect("jump_2")
    }

    if (shako.state == "jumping") {
      shako.y += shako.y_velocity;
      shako.x += shako.x_velocity;

      shako.y_velocity += 0.5;

      if (shako.y > game_height - 36) {
        shako.y = game_height - 36;
        shako.y_velocity = 0;
        shako.state = "ground";
        shako.ground_time = Date.now();
        shako.jumps += 1;

        if (shako.jumps % 3 == 1) {
          if (shako.stance == "forward") {
            shako.setStance("up");
          } else {
            shako.setStance("forward");
          }
        }

        if (dice(100) < 10) {
          shako.scale.x = -1 * shako.scale.x;
          shako.x -= 30 * shako.scale.x;
        }

        if (shako.scale.x == 1) shako.next_col = Math.floor((shako.x + 61 - 30) / 120);
        if (shako.scale.x == -1) shako.next_col = Math.floor((shako.x + 61) / 120);
        
        if (shako.next_col < 0 || shako.next_col > 70 || stacks[shako.next_col] != 1) {
          shako.scale.x = -1 * shako.scale.x;
          shako.x -= 30 * shako.scale.x;
        }
      }
    }

    if (shako.state == "kaput") {
      shako.y += shako.y_velocity;
      shako.y_velocity += 0.8;
    }
  }
}


function miaVsShakos() {
  for (shako_num = 0; shako_num < shakos.length; shako_num += 1) {
    let shako = shakos[shako_num];

    if (shako.state != "kaput" && ["running","jumping","blasting"].includes(mia.state)) {

      if (mia.x < shako.x && mia.scale.x == 1 && shako.scale.x == 1 && mia.x > shako.x - 80
        && shako.stance == "forward" && Math.abs(mia.y - shako.y) < 100) {
        mia.setState("kaput");
        mia.scale.y = -1;
        mia.y_velocity = -5;
        mia.y = mia.y - 175;
        soundEffect("negative_2");
      }

      if (mia.x > shako.x && mia.scale.x == -1 && shako.scale.x == -1 && mia.x < shako.x + 80
        && shako.stance == "forward" && Math.abs(mia.y - shako.y) < 100) {
        mia.setState("kaput");
        mia.scale.y = -1;
        mia.y_velocity = -5;
        mia.y = mia.y - 175;
        soundEffect("negative_2");
      }

      if (mia.x < shako.x && mia.scale.x == 1 && shako.scale.x == 1 && mia.x > shako.x - 80
        && shako.stance == "up" && Math.abs(mia.y - shako.y) < 70) {
        shako.state = "kaput";
        shako.scale.y = -1;
        shako.y_velocity = -5;
        shako.y = shako.y - 175;
        soundEffect("hurt");
      }

      if (mia.x > shako.x && mia.scale.x == -1 && shako.scale.x == -1 && mia.x < shako.x + 80
        && shako.stance == "up" && Math.abs(mia.y - shako.y) < 70) {
        shako.state = "kaput";
        shako.scale.y = -1;
        shako.y_velocity = -5;
        shako.y = shako.y - 175;
        soundEffect("hurt");
      }

      if (mia.x < shako.x && mia.scale.x == 1 && shako.scale.x == -1 && mia.x > shako.x - 80
        && Math.abs(mia.y - shako.y) < 70) {
        shako.state = "kaput";
        shako.scale.y = -1;
        shako.y_velocity = -5;
        shako.y = shako.y - 175;
        soundEffect("hurt");
      }

      if (mia.x > shako.x && mia.scale.x == -1 && shako.scale.x == 1 && mia.x < shako.x + 80
        && Math.abs(mia.y - shako.y) < 70) {
        shako.state = "kaput";
        shako.scale.y = -1;
        shako.y_velocity = -5;
        shako.y = shako.y - 175;
        soundEffect("hurt");
      }
    }

    if (shako.state != "kaput" && mia.state == "falling") {
      if (Math.abs(mia.x - shako.x) < 80 && mia.y < shako.y - 30 && mia.y > shako.y - 160) {
        if (shako.stance == "up") {
          mia.setState("kaput");
          mia.scale.y = -1;
          mia.y_velocity = -5;
          mia.y = mia.y - 175;
          soundEffect("negative_2");
        } else if (shako.stance == "forward") {
          shako.state = "kaput";
          shako.scale.y = -1;
          shako.y_velocity = -5;
          shako.y = shako.y - 175;
          soundEffect("hurt");

          mia.setState("jumping");
          mia.y_velocity = -10;
          soundEffect("jump_3");
        }
      }
    }
  }
}


function updateRocket() {
  if (mia.state == "kaput") return;

  if (mia.state != "rocket") {
    if (mia.x > rocket.x) {
      mia.state = "rocket";
      mia.visible = false;
      soundEffect("rocket_2");
      soundEffect("victory_3");
      rocket_door.visible = false;
    }
  }

  if (mia.state == "rocket") {
    // Shake between -2 and 2 pixels both x and y axes.
    rocket.x += -2 + dice(100) / 25;
    rocket.y += -2 + dice(100) / 25;

    // Go up
    rocket.y += rocket.y_velocity;

    // Start slow, then get faster
    if (rocket.y_velocity > -0.1) {
      rocket.y_velocity -= 0.001;
    } else {
      rocket.y_velocity -= 0.05;
    }

    // Make a ton of explosions and smoke near the bottom of the rocket
    for (num = 0; num < 3; num += 1) {
      makeExplosion(stage, rocket.x - 30 + dice(60), rocket.y - 30 - dice(25), 1.4, 1.4);
    }
    for (num = 0; num < 5; num += 1) {
      makeSmoke(stage, rocket.x - 60 + dice(120), rocket.y - 30 - dice(25), 1.4, 1.4);
    }
  }
}


function testBricks() {

  // Don't test anything if Mia is already kaput
  if (mia.state == "kaput") return;

  mia.column = Math.floor((mia.x + 60) / 120);

  // Don't test bricks if Mia is too far to the left or right.
  if (mia.column < -8 || mia.column >= 90) return;

  // Figure out the floor for Mia's current column.
  let floor_height = game_height - 36 * stacks[mia.column] - 4;

  // First, check if Mia has run into thin air,
  // like Wile E Coyote, and make her fall.
  if (mia.y < floor_height && mia.y_velocity >= 0) {
    mia.setState("falling")
  }

  // Check if Mia has fallen on top of the current stack.
  if (mia.state == "falling" && mia.y >= floor_height && mia.y_velocity > 0) {
    mia.y = floor_height;
    mia.y_velocity = 0;
    mia.setState("running");
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
        mia.setState("kaput");
        mia.scale.y = -1;
        mia.y_velocity = -5;
        mia.y = mia.y - 175;
        soundEffect("negative_2");
      }
    }
  }
}


function updateGame(diff) {

  // Don't try to update the game until we've created Mia,
  // or the game will crash.
  if (mia == null) return;

  if (mia.state == "victory") {
    stage.x = 0;

    if (key_down["Enter"]) {
      stage.removeChildren();
      bricks = [];
      shakos = [];
      stacks = {};
      blasts = [];
      initializeGame();
    }

    return;
  }

  dropBricks();

  // If the right key got pushed, move Mia to the right
  if (mia.state != "rocket" && key_down["ArrowRight"]) {
    if (mia.state == "idle" || mia.state == "blasting") mia.setState("running");
    if (mia.x_velocity < 0) {
      mia.x_velocity = 0;
      makeSmoke(stage, mia.x - 20, mia.y - 40, 1.4, 1.4);
    }
    mia.x_velocity += 1;
    if (mia.x_velocity > mia.max_x_velocity) mia.x_velocity = mia.max_x_velocity;
    if (mia.state != "kaput") mia.scale.set(1,1);
  }

  // If the left key got pushed, move Mia to the left
  if (mia.state != "rocket" && key_down["ArrowLeft"]) {
    if (mia.state == "idle" || mia.state == "blasting") mia.setState("running");
    if (mia.x_velocity > 0) {
      mia.x_velocity = 0;
      makeSmoke(stage, mia.x + 20, mia.y - 40, 1.4, 1.4);
    }
    mia.x_velocity -= 1;
    if (mia.x_velocity < -1 * mia.max_x_velocity) mia.x_velocity = -1 * mia.max_x_velocity;
    if (mia.state != "kaput") mia.scale.set(-1,1);
  }

  mia.last_x = mia.x;
  mia.x += mia.x_velocity;
  mia.x_velocity *= 0.93;
  if (mia.state == "running" && Math.abs(mia.x_velocity) < 0.5) mia.setState("idle");

  if (mia.x < 0) mia.x = 0;
  if (mia.x > 84 * 120) mia.x = 84 * 120;

  // If the space bar got pushed, make Mia jump
  if (key_down[" "]) {
    if (mia.state == "running" || mia.state == "idle" || mia.state == "blasting") {
      mia.setState("jumping");
      mia.y_velocity = -20;
      soundEffect("jump_3");
      makeSmoke(stage, mia.x - 3 * mia.x_velocity, mia.y - 40, 1.4, 1.4);
    }
  }

  if (key_down["Enter"] || key_down["v"] || key_down["b"]) {
    if (["running", "idle"].includes(mia.state) && Date.now() - mia.last_blast > 300) {
      mia.setState("blasting");
      mia.last_blast = Date.now();
      mia.x += -5 * mia.scale.x;
      soundEffect("jump_4");
      makeBlastEnergy(stage, color(0,0,1), mia.x + 124 * mia.scale.x, mia.y - 138, 0.75, 0.75);

      let blast = makeAnimatedSprite("Art/blast.json", "blast");
      blast.scale.set(2,2);
      blast.tint = color(0,0,1);
      blast.position.set(mia.x + 124 * mia.scale.x, mia.y - 134);
      blast.animationSpeed = 0.3;
      blast.state = "active";
      blast.direction = mia.scale.x;
      blast.x_velocity = 20 * blast.direction;
      blast.original_x = blast.x;
      blast.play();
      stage.addChild(blast);
      blasts.push(blast);
    }
  }

  if (mia.state == "blasting" && Date.now() - mia.last_blast > 300) {
    mia.setState("idle");
  }

  // If Mia is jumping, move her upwards, use gravity to pull her downwards,
  // and if she reaches the ground, stop the jump.
  if (mia.state == "jumping" || mia.state == "falling" || mia.state == "kaput") {
    mia.y = mia.y + mia.y_velocity;
    mia.y_velocity = mia.y_velocity + 0.8;

    if (mia.y_velocity > 0 && mia.state == "jumping") {
      // switch to falling
      mia.setState("falling");
    }
  }

  updateBlasts();
  updateShakos();
  miaVsShakos();
  updateRocket();

  testBricks();

  if (mia.y > 1200) {
    stage.removeChildren();
    bricks = [];
    shakos = [];
    stacks = {};
    blasts = [];
    initializeGame();
  }

  if (rocket.y < -4500) {
    if (mia.state == "rocket") {
      mia.state = "victory";

      let victory_screen = makeSprite("Art/victory_screen.png");
      victory_screen.position.set(0, 0);
      stage.addChild(victory_screen);
    }
  }

  followMia();
}


