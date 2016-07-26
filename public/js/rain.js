// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function(){
    return window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     ||  
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

//Flocking Behaviour
var canvas = document.getElementById("rain-canvas"),
    ctx = canvas.getContext("2d");

var w = window.innerWidth,
    h = window.innerHeight;

canvas.width = w;
canvas.height = h;

var particles = [],
    count = 100,
    bounce = -.4;

function Particle() {
    this.x = Math.random() * w;
    this.y = 0;

    this.vy = Math.random() * 2;
    this.vx = -0.5 + Math.random();

    this.color = "rgba(0, 0, 0, 0.5)";
    this.radius = 0.75;
    this.hits = 0;

    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.closePath();
        ctx.fill();
    };
}

//Fill the insects into flock
for(var i = 0; i < count; i++) {
    particles.push(new Particle());
}


function draw() {

    ctx.clearRect(0, 0, w, h);

    //Draw particles
    for(var j = 0; j < particles.length; j++) {
        var p = particles[j];
        p.draw();

        p.y += p.vy;
        p.x += p.vx;

        //Detect collision with floor
        if(p.y > h) {
            particles[j] = new Particle();
        }

        //Detect collision with walls
        if(p.x > w + 10) {
            particles[j] = new Particle();
        }

        else if(p.x < -10) {
            particles[j]
        }
    }   
}

// Start the main animation loop using requestAnimFrame
function animloop() {
    draw();
    requestAnimFrame(animloop);
}

animloop();
