// Reference:
// https://youtu.be/jj5ADM2uywg
// first JS game used code for heavy reference
// changed variables to match with my needs
// changed pipes to move vertically instead of horizontally
// created my own pipe and xwing sprites and added sound effects
// changed font + text layout

// board
let board;
let boardWidth = 1000;
let boardHeight = 800;
let context;

// xwing 
let xwingWidth = 50;
let xwingHeight = 50;
let xwingX = boardWidth/2;
let xwingY = boardHeight/2
let xwingImg;

let xwing = {
    x : xwingX,
    y : xwingY,
    width : xwingWidth,
    height : xwingHeight
}

// pipe
let pipeArray = [];
let pipeHeight = 50;
let pipeWidth = 500;
let leftPipe;
let rightPipe;

// explosion sprite
let boom = new Image();
boom.src = "../xwing_files/boom.png";

// sound effects
let coinSound = new Audio("../xwing_files/coinSound.mp3")
let shipExplode = new Audio("../xwing_files/explosion.mp3");
shipExplode.volume = 0.3;

// game rules
let pipeSpeed = 2;
let gameOver = false;
let score = 0;

window.onload = function() {
    // setting up the canvas
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // loads xwing and draws it based on dimenions given
    xwingImg = new Image();
    xwingImg.src = "../xwing_files/xwing.png";
    xwingImg.onload = function() {
        context.drawImage(xwingImg, xwing.x, xwing.y, xwing.width, xwing.height);
    }

    leftPipe = new Image();
    leftPipe.src = "../xwing_files/pipe.png";

    rightPipe = new Image();
    rightPipe.src = "../xwing_files/pipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 2000);
    document.addEventListener("keydown", moveXwing);
}

function update() {
    // base case
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    
    context.clearRect(0, 0, board.width, board.height);
    context.drawImage(xwingImg, xwing.x, xwing.y, xwing.width, xwing.height);

    // pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.y += pipeSpeed
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        if (!pipe.passed && xwing.x > pipe.x + pipe.width) {
            score += 1; 
            coinSound.play();
            pipe.passed = true;
        }

        if (detectCollision(xwing, pipe)) {
            gameOver = true;
        }
    }

    // clear pipes
    while (pipeArray.length > 0 && pipeArray[0].y > boardHeight) {
        pipeArray.shift(); 
    }

    // score
    context.fillStyle = "white";
    context.font="45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
        shipExplode.play();
    }    
}

function placePipes() {
    if (gameOver) return;

    let gap = 250;
    let randomPipeX = Math.floor(Math.random() * (boardWidth - gap));

    let leftPipeX = Math.max(0, randomPipeX);
    let rightPipeX = leftPipeX + gap;

    let leftPipeObj = {
        img: leftPipe,
        x: 0,
        y: -pipeHeight, 
        width: leftPipeX,
        height: pipeHeight,
        passed: false
    };

    let rightPipeObj = {
        img: rightPipe,
        x: rightPipeX,
        y: -pipeHeight,
        width: boardWidth - rightPipeX,
        height: pipeHeight,
        passed: false
    };

    pipeArray.push(leftPipeObj);
    pipeArray.push(rightPipeObj);
}

function moveXwing(e) {
    if (gameOver) return;

    let step = 50;
    if (e.code === "ArrowUp" && xwing.y - step >= 0) {
        xwing.y -= step;
    } else if (e.code === "ArrowDown" && xwing.y + xwing.height + step <= boardHeight) {
        xwing.y += step;
    } else if (e.code === "ArrowLeft" && xwing.x - step >= 0) {
        xwing.x -= step;
    } else if (e.code === "ArrowRight" && xwing.x + xwing.width + step <= boardWidth) {
        xwing.x += step;
    }
}

function detectCollision(a, b) {
    let margin = 10;
    return (
        a.x + margin < b.x + b.width &&
        a.x + a.width - margin > b.x &&
        a.y + margin < b.y + b.height &&
        a.y + a.height - margin > b.y
    );
}


