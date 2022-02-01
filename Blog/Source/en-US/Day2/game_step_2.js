
// Welcome! This is where you'll write your game code.
// Anything with two // slashes in front is a comment.
// The computer ignores comments. They're for humans
// to explain things to other humans.

let mia = null;


function initializeGame() {

  let blue_sky = makeSprite("Art/blue_sky.png");
  blue_sky.position.set(0, 0);
  stage.addChild(blue_sky);

  mia = makeAnimatedSprite("Art/mia_animations.json", "run");
  mia.position.set(200, 200);
  stage.addChild(mia);
  mia.animationSpeed = 0.3;
  mia.play();
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
}

