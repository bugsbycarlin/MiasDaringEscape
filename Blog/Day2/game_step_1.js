
// Welcome! This is where you'll write your game code.
// Anything with two // slashes in front is a comment.
// The computer ignores comments. They're for humans
// to explain things to other humans.

let mia = null;
let brick_1 = null;
let brick_2 = null;


function initializeGame() {

  let blue_sky = makeSprite("Art/blue_sky.png");
  blue_sky.position.set(0, 0);
  stage.addChild(blue_sky);

  mia = makeAnimatedSprite("Art/mia_animations.json", "run");
  mia.position.set(200, 200);
  stage.addChild(mia);
  mia.animationSpeed = 0.3;
  mia.play();

  brick_1 = makeSprite("Art/brick.png");
  brick_1.position.set(500, 200);
  brick_1.tint = color(1,0,0);
  stage.addChild(brick_1);

  brick_2 = makeSprite("Art/brick.png");
  brick_2.position.set(200, 400);
  brick_2.tint = color(0,0,1);
  stage.addChild(brick_2);
}


function updateGame(diff) {

  // If the right key got pushed, move Mia to the right
  if (key_down["ArrowRight"]) {
    mia.x = mia.x + 5;
  }

  // If the left key got pushed, move Mia to the left
  if (key_down["ArrowLeft"]) {
    mia.x = mia.x - 5;
  }

  // If the down key got pushed, move Mia down
  if (key_down["ArrowDown"]) {
    mia.y = mia.y + 5;
  }

  // If the up key got pushed, move Mia up
  if (key_down["ArrowUp"]) {
    mia.y = mia.y - 5;
  }
}

