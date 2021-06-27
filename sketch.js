const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var backImg, backgroundImg, craft1Img, spaceCraft, spaceCraft1, bombImg, bomb, explosionImg, playImg;
var bombGroup, gameState = "start", craft2Img, craft3Img, craft4Img, finishImg, finish, homeP;
var homeImg, playB, boomS, feedback_img, feedback, fuelImg, fuel = 300;
var clickS, explosion1Img, coinImg, coin, coinS, levelGroup;
var level = 1, level2Img, level2, restartIMG, restart;
var finishGroup, CoinGroup, count = 0, fuelGroup, fuel1;

function preload() {
    backImg = loadImage("images/background.jpg");
    craft1Img = loadImage("images/craft1.png");
    bombImg = loadImage("images/bomb.png");
    explosionImg = loadImage("images/explosion.png");
    explosion1Img = loadImage("images/explosion.png");
    craft2Img = loadImage("images/craft2.png");
    craft3Img = loadImage("images/craft3.png");
    craft4Img = loadImage("images/craft4.png");
    finishImg = loadImage("images/finish.png");
    playImg = loadImage("images/play.png");
    homeImg = loadImage("images/homeP.jpg");
    coinImg = loadImage("images/coin.png");
    level2Img = loadImage("images/level2.png");
    fuelImg = loadImage("images/fuel.png");
    restartImg = loadImage("images/restart.png");
    feedback_img = loadImage("images/feedback1.jpg");
    boomS = loadSound("sound/boom.wav");
    clickS = loadSound("sound/click.mp3");
    coinS = loadSound("sound/coin.wav");

}

function setup() {
    createCanvas(windowWidth / 2.5, windowHeight - 10);


    backgroundImg = createSprite(windowWidth / 4.4, height / 2, 100, 100);
    backgroundImg.addImage(backImg);
    backgroundImg.velocityY = 10;

    spaceCraft = createSprite(width / 2, 600, 100, 100);
    spaceCraft.addImage(craft1Img);
    spaceCraft.scale = 0.4;
    //spaceCraft.debug = true;
    spaceCraft.setCollider("circle", 0, 0, 180)
    spaceCraft.addImage("2", craft2Img);
    spaceCraft.addImage("3", craft3Img);
    spaceCraft.addImage("4", craft4Img);
    spaceCraft.addImage("explosion", explosionImg);
    //spaceCraft.rotation = -90;
    bombGroup = new Group();
    finishGroup = new Group();
    CoinGroup = new Group();
    levelGroup = new Group();
    fuelGroup = new Group();


    homeP = createSprite(width / 2, height / 2, 100, 100);
    homeP.addImage(homeImg);
    //homeP.scale = 0.3;
    playB = createSprite(width / 2, height / 2, 100, 100);
    playB.addImage(playImg);
    playB.scale = 0.5;

    spaceCraft1 = createSprite(width / 4.5, 150, 100, 100);
    spaceCraft1.addImage(craft1Img);
    spaceCraft1.scale = 0.4;
    spaceCraft1.rotation = 25;

    spaceCraft2 = createSprite(width / 1.3, 150, 100, 100);
    spaceCraft2.addImage(craft2Img);
    spaceCraft2.scale = 0.6;
    spaceCraft2.rotation = -25;

    spaceCraft3 = createSprite(width / 4, 570, 100, 100);
    spaceCraft3.addImage(craft3Img);
    spaceCraft3.scale = 0.9;
    spaceCraft3.rotation = 25;

    spaceCraft4 = createSprite(width / 1.3, 570, 100, 100);
    spaceCraft4.addImage(craft4Img);
    spaceCraft4.scale = 0.6;
    spaceCraft4.rotation = -25;


    feedback = createSprite(width / 2, height / 2, 100, 100);
    feedback.addImage(feedback_img);
    feedback.scale = 1.3;
    feedback.visible = false;
}

function draw() {
    background("red");
    drawSprites();



    if (mousePressedOver(playB) && gameState === "start") {
        homeP.destroy();
        spaceCraft1.destroy();
        spaceCraft2.destroy();
        spaceCraft3.destroy();
        spaceCraft4.destroy();
        gameState = "play";
        clickS.play();
        playB.destroy();



    }

    if (gameState === "play") {
        if (keyDown(LEFT_ARROW)) {
            spaceCraft.x = spaceCraft.x - 30;
        }

        if (keyDown(RIGHT_ARROW)) {
            spaceCraft.x = spaceCraft.x + 30;
        }
        if (backgroundImg.y > 700) {
            backgroundImg.y = backgroundImg.height / 5;
        }
        if (spaceCraft.x < 100) {
            spaceCraft.x = 100;
        }
        if (spaceCraft.x > width - 100) {
            spaceCraft.x = width - 100;
        }
        spaceCraft.overlap(CoinGroup, removeCoin);
        if (spaceCraft.isTouching(fuelGroup)) {
            fuel = 300;
        }
        fill("red");
        text("COINS:" + count, 100, 200);

        spawnBomb();

        spawnCoin();
        showFuelBar();
        spawnFuel();
        fuel = fuel - 0.3;
        //console.log(fuel);


        if (fuel < 0) {
            swal.fire({

                text: 'FUEL EMPTY😮',
                confirmButtonText: "Restart",
                imageUrl: "images/fuelempty.png",
                imageWidth: 100,
                imageHeight: 200,
                imageAlt: 'Custom image',
                position: 'center',
                animation: true
            })
        }

        if (bombGroup.isTouching(spaceCraft)) {
            spaceCraft.changeAnimation("explosion");
            spaceCraft.scale = 1.5;
            boomS.play();
            gameState = "end";
        }
        if (level === 1) {
            if (frameCount % 500 === 0) {
                level2 = createSprite(width / 2, height / 7, 150, 100);
                level2.addImage(level2Img);
                level2.scale = 0.08;
                level2.lifetime = 500;
                level2.velocityY = 10;
                levelGroup.add(level2);
            }
            if (levelGroup.isTouching(spaceCraft)) {
                level = 2;
                console.log("level 1 ended")

            }
        }

        if (level === 2) {
            spaceCraft.changeImage("2")

            if (finishGroup.isTouching(spaceCraft)) {
                level = 3;
                console.log("level 2 ended")
            }
        }


        if (level === 3) {
            spaceCraft.changeImage("3");

            if (finishGroup.isTouching(spaceCraft)) {
                level = 4;
                console.log("level 3 ended")
            }
        }

        if (level === 4) {
            spaceCraft.changeImage("4");

        }


    }


    else if (gameState === "end") {
        bombGroup.destroyEach();
        finishGroup.destroyEach();
        CoinGroup.destroyEach();
        fuelGroup.destroyEach();
        backgroundImg.velocityY = 0;


    }



}
function spawnBomb() {
    if (frameCount % 80 === 0) {
        bomb = createSprite(random(100, width - 50), 0, 100);
        bomb.addImage(bombImg);
        bomb.scale = 0.2;
        //bomb.rotation = 45;
        bomb.velocityY = random(15, 20);
        bomb.velocityX = random(-15, 15);
        bomb.lifetime = 500;
        bombGroup.add(bomb);
    }
}
function spawnCoin() {
    if (frameCount % 50 === 0) {
        coin = createSprite(random(100, width - 100), 0, 100);
        coin.addImage(coinImg);
        coin.scale = 0.02;
        coin.velocityY = 10;
        coin.lifetime = 500;
        CoinGroup.add(coin);
    }
}
function spawnFinish() {
    if (frameCount % 1000 === 0) {
        finish = createSprite(width / 2, height / 7, 150, 100);
        finish.addImage(finishImg);
        finish.scale = 1.2;
        finish.lifetime = 500;
        finish.velocityY = 10;
        finishGroup.add(finish);
    }
}
function spawnLevel2() {
    if (frameCount % 500 === 0) {
        level2 = createSprite(width / 2, height / 7, 150, 100);
        level2.addImage(level2Img);
        level2.scale = 0.08;
        level2.lifetime = 500;
        level2.velocityY = 10;
        levelGroup.add(level2);
    }
}
function removeCoin(spaceCraft, coin) {
    coin.remove();
    coinS.play();
    count = count + 1;
}
function showFuelBar() {
    fill("white");
    rect(300, 50, 300, 30);

    fill("red");
    rect(300, 50, fuel, 30);
}
function spawnFuel() {
    if (frameCount % 200 === 0) {
        fuel1 = createSprite(random(100, width - 100), 0, 100);
        fuel1.addImage(fuelImg);
        fuel1.scale = 0.5;
        fuel1.lifetime = 500;
        fuel1.velocityY = 10;
        fuelGroup.add(fuel1);
    }
}







