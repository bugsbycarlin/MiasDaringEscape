
// Bem-vindos! É aqui que vocês escreverão seu jogo.
// Qualquer coisa iniciando com duas // barras na frente é um comentário.
// O computador ignora comentários. Eles servem para humanos
// explicarem coisas a outros humanos.

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

  // Se a seta direita do teclado for pressionada, mova Mia para a direita
  if (key_down["ArrowRight"]) {
    mia.x = mia.x + 5;
  }

  // Se a seta esquerda do teclado for pressionada, mova Mia para a esquerda
  if (key_down["ArrowLeft"]) {
    mia.x = mia.x - 5;
  }

  // Se a seta para baixo for pressionada, mova Mia para baixo
  if (key_down["ArrowDown"]) {
    mia.y = mia.y + 5;
  }

  // Se a seta para cima for pressionada, mova Mia para cima
  if (key_down["ArrowUp"]) {
    mia.y = mia.y - 5;
  }
}

