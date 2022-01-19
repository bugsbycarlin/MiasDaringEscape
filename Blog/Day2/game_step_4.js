
// Welcome! This is where you'll write your game code.
// Anything with two // slashes in front is a comment.
// The computer ignores comments. They're for humans
// to explain things to other humans.

let mia = null;
let bricks = [];
let colors = [
  color(1,0,0), // Red
  color(0,1,0), // Green
  color(0,0,1), // Blue
]


function initializeGame() {

  let blue_sky = makeSprite("Art/blue_sky.png");
  blue_sky.position.set(0, 0);
  stage.addChild(blue_sky);

  for (num = 0; num < 10; num += 1) {
    let brick = makeSprite("Art/brick.png");
    brick.anchor.set(0.5,1);
    brick.position.set(120 * num, game_height);
    brick.tint = pick(colors);
    stage.addChild(brick);
    bricks.push(brick);
  }

  mia = makeAnimatedSprite("Art/mia_animations.json", "run");
  mia.anchor.set(0.5, 0.9);
  mia.position.set(200, game_height - 40);
  stage.addChild(mia);
  mia.animationSpeed = 0.3;
  mia.play();
}


function updateGame(diff) {

  // If the right key got pushed, move Mia to the right
  if (key_down["ArrowRight"]) {
    mia.x = mia.x + 7;
    mia.scale.set(1,1);
  }

  // If the left key got pushed, move Mia to the left
  if (key_down["ArrowLeft"]) {
    mia.x = mia.x - 7;
    mia.scale.set(-1,1);
  }
}

