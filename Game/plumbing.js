//
// plumbing.js contains all the game code necessary to make and run
// a game on the PixiJS framework, as well as a bunch of functions
// which make first time game programming more convenient.
//
// If you're new, the best way to read this code is to read the function
// names, so you get an idea of what they do, and the comments
// above the functions, which describe in more detail. Then, skim the
// function code, but just to get a general sense of what's going on.
// Weird things are being done here which are not in the scope of this course.
//
// That being said, I hope you find this a useful reference for making
// your own functions, and I hope you get so into game programming that
// you end up understanding and modifying these functions too!
//
// Copyright 2022 Alpha Zoo LLC.
// Written by Matthew Carlin
//



// nice colors for bricks
// blue: 0.38, 0.68, 1
// yellow: 0.94, 0.80, 0.21
// orange: 1, 0.50, 0.05
// red: 0.85, 0.12, 0.03
// pink: 1, 0.51, 0.71
// purple: 0.65, 0.24, 0.65
// green: 0.2, 0.7, 0.38


// Here are the width and height of the game in pixels.
// It's 1024 pixels wide, 576 pixels tall.
let game_width = 1024;
let game_height = 576;

// Here are global variables for the pixi framework and the stage.
let pixi = null;
let stage = null;

// Key_down is a dictionary of which keys are currently pressed and which ones aren't.
key_down = {};



// This function loads things before the game starts.
//
// Small files load quickly enough that we can just ask for
// them in the middle of game play. But large files would
// cause a noticeable hiccup, so we just load them first.
//
// When this function is done loading, it calls the
// function to create the Pixi game structure,
// and then it calls your function which sets up the game.
function loadAssets() {

  PIXI.Loader.shared
  .add("Art/mia_animations.json")
  .add("Art/smoke.json")
  .load(function() {
    initializePixi();
    initializeGame();
  })
}



// This function creates the Pixi game structure.
// It makes a renderer (aka a drawing program),
// starts an animation loop (so, draw about 60 times a second),
// and tells the computer to start *listening* for
// keyboard presses (both keys pressed down and keys let up).
function initializePixi() {

  // Create the pixi program
  pixi = new PIXI.Application(game_width, game_height, {antialias: true, backgroundColor: 0x000000});
  document.getElementById("game_container").appendChild(pixi.view);
  pixi.renderer.resize(game_width, game_height);

  // The stage is what you see on the screen.
  // Add something to the stage, see it on the screen.
  stage = pixi.stage;

  // This is a little clock which runs the game loop.
  let ticker = PIXI.Ticker.shared;
  ticker.autoStart = false;
  ticker.stop();
  let last_frame = 0;

  // Set up the game loop.
  // This does "tweening" (tweens are special animations you
  // can use to smoothly move something from point A to point B),
  // then it calls YOUR game update function,
  // then it calls pixi's render (aka draw) function.
  // Finally, it asks to run the next animation frame.
  function animate(now) {
    let diff = now - last_frame;
    last_frame = now

    TWEEN.update(now);
    updateGame(diff);
    ticker.update(now);
    pixi.renderer.render(pixi.stage);

    requestAnimationFrame(animate);
  }

  // start animation
  animate(0);

  // Web code which tells the web page to "listen" for keys being pressed down and keys being let up.
  document.addEventListener("keydown", function(event) {handleKeyDownEvent(event)}, false);
  document.addEventListener("keyup", function(event) {handleKeyUpEvent(event)}, false);
}



// This function is called any time a key is pressed down.
// All it does is make a record, "the A key is down now".
// It's up to YOU to use that information in the game update function.
function handleKeyDownEvent(event) {
  if (event.key === "Tab") {
    event.preventDefault();
  }

  key_down[event.key] = true;
}



// This function is called any time a key is let up.
// All it does is make a record, "the A key isn't down anymore".
// It's up to YOU to use that information in the game update function.
function handleKeyUpEvent(event) {
  event.preventDefault();

  key_down[event.key] = null;
}



// This function makes a PIXI.js sprite from the source file.
function makeSprite(file) {
  return new PIXI.Sprite(PIXI.Texture.from(file));
}



// This function makes a container which holds a bunch of other
// sprites and containers. If you move this container, or change
// its size, everything inside it will move or change size.
function makeContainer() {
  return new PIXI.Container();
}



// This function makes an animated sprite from the source file.
// The file should be preloaded using the loadAssets function.
function makeAnimatedSprite(file, animation) {
  let sheet = PIXI.Loader.shared.resources[file].spritesheet;
  let sprite = new PIXI.AnimatedSprite(sheet.animations[animation]);
  return sprite;
}



// This function makes a smoke effect.
// Note that you can give it extra information, such
// as location and size (aka scale).
// 
function makeSmoke(parent, x, y, xScale, yScale) {
  let sheet = PIXI.Loader.shared.resources["Art/smoke.json"].spritesheet;
  let smoke_sprite = new PIXI.AnimatedSprite(sheet.animations["smoke"]);
  smoke_sprite.anchor.set(0.5,0.5);
  smoke_sprite.position.set(x, y);
  parent.addChild(smoke_sprite);
  smoke_sprite.animationSpeed = 0.4; 
  smoke_sprite.scale.set(xScale, yScale);

  parent.addChild(smoke_sprite);
  smoke_sprite.loop = false;
  smoke_sprite.onComplete = function() {
    smoke_sprite.state = "dead";
    parent.removeChild(smoke_sprite);
  }
  smoke_sprite.play();
  return smoke_sprite;
}



// Play a sound effect.
// The sound file should be put into index.html and its id should
// match effect name, like this:
//
// <audio preload="auto" id="coin" >
//   <source src="Sound/coin.wav" type="audio/wav">
// </audio>
//
// <audio preload="auto" id="song" >
//   <source src="Sound/song.mp3" type="audio/mpeg">
// </audio>
//
// The first one is a wave file, better for short sound effects,
// and the second one is an mp3, better for long music.
//

var music_volume = 0.4;
var sound_volume = 0.6;
var current_music = null;

function soundEffect(effect_name) {
  if (sound_volume > 0) {
    let sound_effect = document.getElementById(effect_name);
    if (sound_effect != null) {
      sound_effect.volume = sound_volume;
      sound_effect.play();
    }
  }
}



// Stop playing a sound effect
function stopSoundEffect(effect_name) {
  if (sound_volume > 0) {
    let sound_effect = document.getElementById(effect_name);
    if (sound_effect != null) {
      sound_effect.pause();
    }
  }
}



// Play music on a loop
function setMusic(music_name) {
  if (music_volume > 0) {
    music = document.getElementById(music_name);
    music.loop = true;
    music.pause();
    music.currentTime = 0;
    music.volume = music_volume;
    music_name = music_name;
    music.play();
    current_music = music;
  }
}



// Stop playing the music and reset it.
function stopMusic() {
  if (current_music != null) {
    current_music.pause();
    current_music.currentTime = 0;
  }
}



// Get a system color from R, G, and B values.
// 1,1,1 is white. 1,0,0 is red.
// 0,1,0 is green. 0,0,1 is blue.
// 0,0,0 is black.
// You can use this to set the tint of things.
// For instance, brick.tint = color(1,0,0) will tint the brick red.
function color(R, G, B) {
  return PIXI.utils.rgb2hex([R,G,B]);
}



// This function picks a random object from a list. For instance, if you give it
// a list of colors like ["red", "purple", "blue", "yellow"], it will pick
// one of those four colors at random.
function pick(some_list) {
  return some_list[Math.floor(Math.random() * some_list.length)]
}



// This function picks a random number between 1 and N
function dice(number) {
  return Math.floor(Math.random() * number) + 1
}


// There's nothing down here!
