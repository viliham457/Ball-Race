/**
* Title: ball race game
* Author: william ballance
* Date: 3/7/24
* Version: 4.7
* Credit to chatgpt which was a huge assistance and helped with code a lot
**/

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// canvas dimensions
canvas.width = 400;
canvas.height = 800;

let blueWins = 0;
let redWins = 0;


// balls (if you want the score to be more even, set the speeds to the same)
const balls = [
    { x: 50, y: 50, radius: 10, color: 'blue', speed: 1.5, vx: 0, vy: 0 },
    { x: 150, y: 50, radius: 10, color: 'red', speed: 2, vx: 0, vy: 0 }
];

// ramp position arrays
const ramps = [
    { startX: 50, startY: 100, endX: 150, endY: 150 },    // Ramp 1
    { startX: 250, startY: 150, endX: 350, endY: 100 },   // Ramp 2
    { startX: 100, startY: 200, endX: 200, endY: 250 },   // Ramp 3
    { startX: 300, startY: 250, endX: 400, endY: 200 },   // Ramp 4
    { startX: 50, startY: 300, endX: 150, endY: 250 },    // Ramp 5
    { startX: 250, startY: 350, endX: 350, endY: 300 },   // Ramp 6
    { startX: 100, startY: 400, endX: 200, endY: 350 },   // Ramp 7
    { startX: 300, startY: 450, endX: 400, endY: 400 },   // Ramp 8
    { startX: 50, startY: 500, endX: 150, endY: 450 },    // Ramp 9
    { startX: 250, startY: 550, endX: 350, endY: 500 },   // Ramp 10
    { startX: 100, startY: 600, endX: 200, endY: 550 },   // Ramp 11
    { startX: 300, startY: 650, endX: 400, endY: 600 },   // Ramp 12
    { startX: 50, startY: 700, endX: 150, endY: 650 },    // Ramp 13
    { startX: 250, startY: 750, endX: 350, endY: 700 },   // Ramp 14
    { startX: 100, startY: 800, endX: 200, endY: 750 },   // Ramp 15
    { startX: 300, startY: 850, endX: 400, endY: 800 }    // Ramp 16
];

// moving obstacle array
const obstacles = [
    { x: 200, y: 200, width: 30, height: 30, color: 'green', speedX: 1, speedY: 1 },
    { x: 300, y: 400, width: 30, height: 30, color: 'purple', speedX: -1, speedY: 1 },
    { x: 100, y: 600, width: 30, height: 30, color: 'orange', speedX: 1.5, speedY: -1 }
];

function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function drawRamps() {
    ctx.strokeStyle = 'brown';
    ctx.lineWidth = 3;

    ramps.forEach(ramp => {
        ctx.beginPath();
        ctx.moveTo(ramp.startX, ramp.startY);
        ctx.lineTo(ramp.endX, ramp.endY);
        ctx.stroke();
        ctx.closePath();
    });
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function moveBall(ball) {
    ball.vy += 0.1; // ball gravity

    ball.x += ball.vx;
    ball.y += ball.vy;

    // ball reach bottom
    if (ball.y + ball.radius >= canvas.height) {
        console.log(`${ball.color} ball wins!`);
        resetBall(ball); // send back to top
    }

    // ramp collision
    ramps.forEach(ramp => {
        if (ball.x >= ramp.startX && ball.x <= ramp.endX) {
            let rampY = ramp.startY + (ramp.endY - ramp.startY) * (ball.x - ramp.startX) / (ramp.endX - ramp.startX);
            if (ball.y >= rampY - ball.radius && ball.y <= rampY + ball.radius) {
                ball.y = rampY - ball.radius; // move ball
                // move ball
                ball.vx = ball.speed * (ramp.endY - ramp.startY) / (ramp.endX - ramp.startX);
                ball.vy = ball.speed * -1; // roll upwards
            }
        }
    });

    // collision check with obstacles
    obstacles.forEach(obstacle => {
        if (ball.x + ball.radius >= obstacle.x && ball.x - ball.radius <= obstacle.x + obstacle.width &&
            ball.y + ball.radius >= obstacle.y && ball.y - ball.radius <= obstacle.y + obstacle.height) {
            // bounce in a random direction
            ball.vx = Math.random() * ball.speed * 2 - ball.speed; 
            ball.vy = Math.random() * ball.speed * -6 - ball.speed; 
        }
    });

    // check if the ball has reached the sides of the canvas
    if (ball.x + ball.radius >= canvas.width || ball.x - ball.radius <= 0) {
        ball.vx = -ball.vx; // reverse horizontal velocity on collision with sides
    }
}

function resetBall(ball) {
    // reset ball position to top of the canvas
    ball.x = Math.random() * (canvas.width - 2 * ball.radius) + ball.radius;
    ball.y = 0;

    // reset ball velocities
    ball.vx = Math.random() * ball.speed * 2 - ball.speed;
    ball.vy = 0;

    // win counter for the ball that won
    if (ball.color === 'blue') {
        blueWins++;
    } else if (ball.color === 'red') {
        redWins++;
    }
}


function moveObstacles() {
    obstacles.forEach(obstacle => {
        // move obstacles horizontally
        obstacle.x += obstacle.speedX;

        // reverse direction on collision with canvas edges
        if (obstacle.x + obstacle.width >= canvas.width || obstacle.x <= 0) {
            obstacle.speedX = -obstacle.speedX;
        }

        // move obstacles vertically
        obstacle.y += obstacle.speedY;

        // reverse direction on collision with canvas edges
        if (obstacle.y + obstacle.height >= canvas.height || obstacle.y <= 0) {
            obstacle.speedY = -obstacle.speedY;
        }
    });
}

function initializeBall(ball) {
    // where the balls spawn from
    ball.x = Math.random() * (canvas.width - 2 * ball.radius) + ball.radius;
    ball.y = 0; // start at the top

    // random velocities
    ball.vx = Math.random() * ball.speed * 2 - ball.speed; // send away horizontally
    ball.vy = Math.random() * ball.speed * 2; // send away vertically
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRamps();
    drawObstacles();
    
    balls.forEach(ball => {
        drawBall(ball);
        moveBall(ball);
    });

    moveObstacles();

    // draw score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Blue wins: ${blueWins}`, 10, 30);
    ctx.fillText(`Red wins: ${redWins}`, 10, 60);
}


// start balls
balls.forEach(ball => {
    initializeBall(ball);
});

// start game loop
const gameInterval = setInterval(gameLoop, 10);
