// ==========================================
// FOOTBALL STARS
// Version 2
// ==========================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const CUT = 80;


// -------------------------
// GAME DATA
// -------------------------

let score = 0;


// -------------------------
// BALL
// -------------------------

const ball = {

    x: WIDTH/2,
    y: HEIGHT/2,

    radius:16,

    vx:0,
    vy:0

};


// -------------------------
// PLAYER DISC
// -------------------------

const player = {

    x:250,
    y:HEIGHT/2,

    homeX:250,
    homeY:HEIGHT/2,

    radius:32,

    dragging:false,

    startX:0,
    startY:0

};


// -------------------------
// PHYSICS
// -------------------------

const friction = 0.985;

const shotPower = 0.25;

const maxPull = 200;



// -------------------------
// MOUSE
// -------------------------

const mouse={

    x:0,
    y:0

};


canvas.addEventListener("mousemove",(e)=>{


    const rect=canvas.getBoundingClientRect();


    mouse.x=(e.clientX-rect.left)
    *(WIDTH/rect.width);


    mouse.y=(e.clientY-rect.top)
    *(HEIGHT/rect.height);



    if(player.dragging){


        let dx=mouse.x-player.startX;
        let dy=mouse.y-player.startY;


        let distance=Math.sqrt(
            dx*dx+dy*dy
        );


        if(distance>maxPull){

            dx*=maxPull/distance;
            dy*=maxPull/distance;

        }


        player.x=player.startX+dx;
        player.y=player.startY+dy;


    }


});



canvas.addEventListener("mousedown",()=>{


    let dx=mouse.x-player.x;
    let dy=mouse.y-player.y;


    if(Math.sqrt(dx*dx+dy*dy)
    <player.radius){


        player.dragging=true;


        player.startX=player.x;
        player.startY=player.y;


    }


});



canvas.addEventListener("mouseup",()=>{


    if(!player.dragging)
        return;



    let dx=
    player.startX-player.x;


    let dy=
    player.startY-player.y;



    ball.vx=dx*shotPower;
    ball.vy=dy*shotPower;



    player.dragging=false;


    player.x=player.homeX;
    player.y=player.homeY;


});



// -------------------------
// DRAW PITCH
// -------------------------

function drawPitch(){


    ctx.fillStyle="#218c45";

    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    ctx.strokeStyle="white";
    ctx.lineWidth=5;


    ctx.beginPath();


    ctx.moveTo(CUT,0);
    ctx.lineTo(WIDTH-CUT,0);

    ctx.lineTo(WIDTH,CUT);

    ctx.lineTo(WIDTH,HEIGHT-CUT);

    ctx.lineTo(WIDTH-CUT,HEIGHT);

    ctx.lineTo(CUT,HEIGHT);

    ctx.lineTo(0,HEIGHT-CUT);

    ctx.lineTo(0,CUT);


    ctx.closePath();

    ctx.stroke();



    // halfway line

    ctx.beginPath();

    ctx.moveTo(WIDTH/2,0);
    ctx.lineTo(WIDTH/2,HEIGHT);

    ctx.stroke();



    // centre circle

    ctx.beginPath();

    ctx.arc(
        WIDTH/2,
        HEIGHT/2,
        90,
        0,
        Math.PI*2
    );

    ctx.stroke();



}



// -------------------------
// GOALS
// -------------------------

function drawGoals(){


    ctx.fillStyle="white";


    ctx.fillRect(
        0,
        HEIGHT/2-90,
        35,
        180
    );


    ctx.fillRect(
        WIDTH-35,
        HEIGHT/2-90,
        35,
        180
    );


}



// -------------------------
// DRAW BALL
// -------------------------

function drawBall(){


    ctx.beginPath();


    ctx.fillStyle="white";


    ctx.arc(
        ball.x,
        ball.y,
        ball.radius,
        0,
        Math.PI*2
    );


    ctx.fill();


    ctx.strokeStyle="black";

    ctx.stroke();


}



// -------------------------
// DRAW PLAYER
// -------------------------

function drawPlayer(){


    ctx.beginPath();


    ctx.fillStyle="white";


    ctx.arc(
        player.x,
        player.y,
        player.radius,
        0,
        Math.PI*2
    );


    ctx.fill();



    ctx.strokeStyle="red";

    ctx.lineWidth=5;

    ctx.stroke();



}



// -------------------------
// AIM LINE
// -------------------------

function drawAim(){


    if(!player.dragging)
        return;


    ctx.beginPath();


    ctx.strokeStyle="yellow";

    ctx.lineWidth=4;


    ctx.moveTo(
        player.homeX,
        player.homeY
    );


    ctx.lineTo(
        player.x,
        player.y
    );


    ctx.stroke();



}



// -------------------------
// COLLISION
// -------------------------

function hitBall(){


    let dx=ball.x-player.x;
    let dy=ball.y-player.y;


    let distance=Math.sqrt(
        dx*dx+dy*dy
    );


    if(
        distance<
        ball.radius+player.radius
    ){


        let angle=Math.atan2(
            dy,
            dx
        );


        ball.vx+=Math.cos(angle)*8;
        ball.vy+=Math.sin(angle)*8;


    }


}



// -------------------------
// BALL UPDATE
// -------------------------

function updateBall(){


    ball.x+=ball.vx;
    ball.y+=ball.vy;



    ball.vx*=friction;
    ball.vy*=friction;



    if(ball.x-ball.radius<0){

        ball.x=ball.radius;
        ball.vx*=-0.9;

    }


    if(ball.x+ball.radius>WIDTH){

        ball.x=WIDTH-ball.radius;
        ball.vx*=-0.9;

    }


    if(ball.y-ball.radius<0){

        ball.y=ball.radius;
        ball.vy*=-0.9;

    }


    if(ball.y+ball.radius>HEIGHT){

        ball.y=HEIGHT-ball.radius;
        ball.vy*=-0.9;

    }



}



// -------------------------
// LOOP
// -------------------------

function gameLoop(){


    requestAnimationFrame(gameLoop);



    drawPitch();

    drawGoals();


    hitBall();

    updateBall();


    drawBall();

    drawPlayer();

    drawAim();



}


gameLoop();
