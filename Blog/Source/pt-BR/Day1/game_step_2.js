
// Bem-vindos! É aqui que vocês escreverão seu jogo.
// Qualquer coisa iniciando com duas // barras na frente é um comentário.
// O computador ignora comentários. Eles servem para humanos
// explicarem coisas a outros humanos.

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

}

