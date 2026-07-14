// =========================
// Football Stars
// Part 1
// =========================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const CUT = 80;

// ----------------------
// Game Objects
// ----------------------

const ball = {
    x: WIDTH / 2,
    y: HEIGHT / 2,
    radius: 16,
    vx: 0,
    vy: 0
};

const player = {
    x: 250,
    y: HEIGHT / 2,
    radius: 30,
    dragging: false,
    startX: 0,
    startY: 0
};

const friction = 0.985;

// England flag disc image
const englandDisc = new Image();
englandDisc.src = "england_disc.svg";

// ----------------------
// Mouse
// ----------------------

const mouse = {
    x: 0,
    y: 0,
    down: false
};

canvas.addEventListener("mousemove", e => {

    const rect = canvas.getBoundingClientRect();

    mouse.x = (e.clientX - rect.left) * (WIDTH / rect.width);
    mouse.y = (e.clientY - rect.top) * (HEIGHT / rect.height);

});

canvas.addEventListener("mousedown", () => {

    const dx = mouse.x - player.x;
    const dy = mouse.y - player.y;

    if (Math.sqrt(dx * dx + dy * dy) < player.radius) {

        player.dragging = true;

        player.startX = player.x;
        player.startY = player.y;

    }

});

canvas.addEventListener("mouseup", () => {

    player.dragging = false;

});

// ----------------------
// Pitch
// ----------------------

function drawPitch() {

    ctx.fillStyle = "#2e8b57";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 6;

    ctx.beginPath();

    ctx.moveTo(CUT, 0);
    ctx.lineTo(WIDTH - CUT, 0);
    ctx.lineTo(WIDTH, CUT);
    ctx.lineTo(WIDTH, HEIGHT - CUT);
    ctx.lineTo(WIDTH - CUT, HEIGHT);
    ctx.lineTo(CUT, HEIGHT);
    ctx.lineTo(0, HEIGHT - CUT);
    ctx.lineTo(0, CUT);

    ctx.closePath();
    ctx.stroke();

    // halfway line

    ctx.beginPath();

    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, HEIGHT);

    ctx.stroke();

    // centre circle

    ctx.beginPath();

    ctx.arc(WIDTH / 2, HEIGHT / 2, 90, 0, Math.PI * 2);

    ctx.stroke();

}

// ----------------------
// Ball
// ----------------------

function drawBall() {

    ctx.beginPath();

    ctx.fillStyle = "white";

    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);

    ctx.fill();

    ctx.strokeStyle = "black";

    ctx.stroke();

}

// ----------------------
// Player
// ----------------------

function drawPlayer() {

    if (englandDisc.complete) {

        ctx.drawImage(
            englandDisc,
            player.x - player.radius,
            player.y - player.radius,
            player.radius * 2,
            player.radius * 2
        );

    } else {

        ctx.beginPath();

        ctx.fillStyle = "red";

        ctx.arc(
            player.x,
            player.y,
            player.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}

// ----------------------
// Physics
// ----------------------

function updateBall() {

    ball.x += ball.vx;
    ball.y += ball.vy;

    ball.vx *= friction;
    ball.vy *= friction;

    if (Math.abs(ball.vx) < 0.05)
        ball.vx = 0;

    if (Math.abs(ball.vy) < 0.05)
        ball.vy = 0;

}

// ----------------------
// Main Loop
// ----------------------

function animate() {

    requestAnimationFrame(animate);

    drawPitch();

    updateBall();

    drawBall();

    drawPlayer();

}

animate();
// ==========================================
// PART 2
// Drag & Shoot Controls
// ==========================================

const MAX_PULL = 180;
const POWER = 0.22;

canvas.addEventListener("mousemove", (e)=>{

    const rect = canvas.getBoundingClientRect();

    mouse.x = (e.clientX-rect.left)*(WIDTH/rect.width);
    mouse.y = (e.clientY-rect.top)*(HEIGHT/rect.height);

    if(player.dragging){

        let dx = mouse.x-player.startX;
        let dy = mouse.y-player.startY;

        let dist = Math.sqrt(dx*dx+dy*dy);

        if(dist>MAX_PULL){

            dx*=MAX_PULL/dist;
            dy*=MAX_PULL/dist;

        }

        player.x=player.startX+dx;
        player.y=player.startY+dy;

    }

});

canvas.addEventListener("mouseup", ()=>{

    if(!player.dragging) return;

    player.dragging=false;

    let dx=player.startX-player.x;
    let dy=player.startY-player.y;

    let power=Math.sqrt(dx*dx+dy*dy);

    ball.vx=dx*POWER;
    ball.vy=dy*POWER;

    player.x=player.startX;
    player.y=player.startY;

});

// ==========================================
// Draw aiming line
// ==========================================

function drawAimLine(){

    if(!player.dragging)
        return;

    ctx.beginPath();

    ctx.strokeStyle="yellow";

    ctx.lineWidth=4;

    ctx.moveTo(player.startX,player.startY);

    ctx.lineTo(player.x,player.y);

    ctx.stroke();

}

// ==========================================
// Power Meter
// ==========================================

function drawPower(){

    if(!player.dragging)
        return;

    let dx=player.startX-player.x;
    let dy=player.startY-player.y;

    let p=Math.sqrt(dx*dx+dy*dy)/MAX_PULL;

    ctx.fillStyle="rgba(0,0,0,.5)";
    ctx.fillRect(20,HEIGHT-45,250,22);

    ctx.fillStyle="lime";

    if(p>0.33)
        ctx.fillStyle="yellow";

    if(p>0.66)
        ctx.fillStyle="red";

    ctx.fillRect(
        20,
        HEIGHT-45,
        250*p,
        22
    );

}

// ==========================================
// Player hits ball
// ==========================================

function playerBallCollision(){

    const dx=ball.x-player.x;
    const dy=ball.y-player.y;

    const dist=Math.sqrt(dx*dx+dy*dy);

    if(dist<ball.radius+player.radius){

        const nx=dx/dist;
        const ny=dy/dist;

        const overlap=
            ball.radius+
            player.radius-
            dist;

        ball.x+=nx*overlap;
        ball.y+=ny*overlap;

        ball.vx+=nx*8;
        ball.vy+=ny*8;

    }

}
