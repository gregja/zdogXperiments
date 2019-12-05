
{
    var default_color = "#000000";  // color picker : https://www.w3schools.com/colors/colors_picker.asp
    var stroke_value = 1;

    var colpicker = document.getElementById("colorpicker");
    if (colpicker) {
        colpicker.value = default_color;
        colpicker.addEventListener('change', function(evt) {
            default_color = this.value;
            mainshape.color = default_color;
        }, false);
    } else {
        console.warn('color picker not found');
    }

    var constrain = function(n, low, high) {
        return Math.max(Math.min(n, high), low);
    };

    var map = function(n, start1, stop1, start2, stop2, withinBounds) {
        var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
        if (!withinBounds) {
            return newval;
        }
        if (start2 < stop2) {
            return constrain(newval, start2, stop2);
        } else {
            return constrain(newval, stop2, start2);
        }
    };

    const PI = Math.PI;
    const TAU = Zdog.TAU;
    var isSpinning = false;

    var bodies = new NBodySystem( Array(
        Sun(),Jupiter(),Saturn(),Uranus(),Neptune()
    ));

    var illo = new Zdog.Illustration({
        element: '.zdog-canvas',
        dragRotate: true,
        scale: 10,
        // pause spinning while dragging
        //onDragStart: () => isSpinning = false,
        //onDragEnd: () => isSpinning = true
    });

    let planets = new Zdog.Anchor({
        addTo: illo,
        scale: 1,
        //translate: { z: 40 },
        // rotate: { z: -Zdog.TAU/8 },
    });

    let sun_diam = 0;

    for (let i=0, imax=bodies.bodies.length; i<imax; i++) {
        let planet = bodies.bodies[i];
        if (planet.name == 'Sun') {
            sun_diam = planet.diameter;
            i = imax;
        }
    }

    for (let i=0, imax=bodies.bodies.length; i<imax; i++) {
        let planet = bodies.bodies[i];

        let diameter = map(planet.diameter, 0, sun_diam, 0, 80, false) ;
        console.log(planet.name, planet.diameter, 0, sun_diam, 0, 80, diameter);

        if (planet.name != 'Sun') {
            diameter += 10;
        }

        let sphere = new Zdog.Shape({
            addTo: planets,
            translate: { x:planet.x, y:planet.y, z:planet.z },
            stroke: diameter,
            color: planet.color
        });

    }

/*
    var mainshape = new Zdog.Shape({
        addTo: illo,
        path: tunnel_datas,
        color: default_color,
        closed: false,
        stroke: stroke_value,
        fill: false,
    });
*/

    function draw (){
        if (isSpinning) {
            illo.rotate.z += 0.003;
        }
        illo.updateRenderGraph();
    }

    function animate() {
        draw();
        requestAnimationFrame( animate );
    }

    function resetScale() {
        illo.scale.x = 1;
        illo.scale.y = 1;
        illo.scale.z = 1;
    }

    function keyPressed (e) {
        e.preventDefault();
        // console.log(e.keyCode);

        // Documentation about keyboard events :
        //    https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
        const DOWN_ARROW = 40;
        const LEFT_ARROW = 37;
        const RIGHT_ARROW = 39;
        const UP_ARROW = 38;
        const BACKSPACE = 8;
        const ESCAPE = 27;
        const KEY_ONE = 49;
        const KEY_TWO = 50;
        const KEY_THREE = 51;
        const KEY_FOUR = 52;
        const KEY_FIVE = 53;

        switch (e.keyCode) {
          case ESCAPE:{
              resetScale();
              break;
          }
          case LEFT_ARROW:{
              illo.scale.z += 0.3;
              break;
          }
          case RIGHT_ARROW:{
              illo.scale.z -= 0.3;
              break;
          }
          case UP_ARROW:{
              illo.scale.x += 0.3;
              illo.scale.y += 0.3;
              illo.scale.z += 0.3;
              break;
          }
          case DOWN_ARROW:{
              illo.scale.x -= 0.3;
              illo.scale.y -= 0.3;
              illo.scale.z -= 0.3;
              break;
          }
          case KEY_ONE:{
              stroke_value = 1;
              mainshape.stroke = stroke_value;
              break;
          }
          case KEY_TWO:{
              stroke_value = 2;
              mainshape.stroke = stroke_value;
              break;
          }
          case KEY_THREE:{
              stroke_value = 3;
              mainshape.stroke = stroke_value;
              break;
          }
          case KEY_FOUR:{
              stroke_value = 4;
              mainshape.stroke = stroke_value;
              break;
          }
          case KEY_FIVE:{
              stroke_value = 5;
              mainshape.stroke = stroke_value;
              break;
          }

        }
      }

    function keyReleased (e) {
        e.preventDefault();
        // TODO : find something to implement here ;)
    }

    document.addEventListener('keydown', keyPressed, false);
    document.addEventListener('keyup', keyReleased, false);

    document.addEventListener("DOMContentLoaded", function(event) {
        console.log("DOM fully loaded and parsed");
        animate();
    });

}



// Globe Particles
// https://codepen.io/HowToDevCode/pen/ORzzJm

var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.id = "canvas";
var ctx = canvas.getContext("2d");
var spheres = [];
var imgdata = [];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var imgWidth = 100;
var imgHeight = 50;
var screenX = canvas.width / 2;
var screenY = canvas.height / 2;
var screenScale = 1000;
var rotation = 0;
var isReadyAnimation = false;

var Vector = function (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

var Particle = function (x, y, z,colorsArrIndex) {
    this.pos = new Vector(x, y, z);
    this.posModel = new Vector(x, y, z);
    this.GenerateColorFromImgIndex(colorsArrIndex);
}

Particle.prototype.GenerateColorFromImgIndex = function (i) {
    this.r = 256-imgdata[i * 4 + 0];
    this.g = 256-imgdata[i * 4 + 1];
    this.b = imgdata[i * 4 + 2];
    this.a = 0;
}

var Sphere = function (x,y, radius, numPointsX, numPointsY) {
    this.pos = new Vector(x, y, 1);
    this.particles = [];
    this.GeneratePoints(x, y, radius, numPointsX, numPointsY);
}

function CreateColorsArr() {
    var canvasimg = document.createElement('canvas');
    var ctximg = canvasimg.getContext("2d");
    var img = new Image();
    img.crossOrigin = "";
    img.src = "https://ucarecdn.com/684548ca-0157-4455-9fe5-9782af655cf0/worldmapsmall_bw9sas.png";
    var ctximg = canvasimg.getContext("2d");
    img.onload = function () {
        ctximg.translate(imgWidth, imgHeight);
        ctximg.scale(-1, -1);
        ctximg.drawImage(img, 0, 0);
        imgdata = ctximg.getImageData(0, 0, imgWidth, imgHeight).data;
        ctximg.clearRect(0, 0, imgWidth, imgHeight);
        spheres.push(new Sphere(0, 0, canvas.height / 4, imgWidth,imgHeight));
        isReadyAnimation = true;
    }
}

Sphere.prototype.GeneratePoints = function (x, y, radius, num, num2) {
    x = x / 2;
    y = y / 2;
    num = Math.floor(num);
    var angle = 2 * Math.PI / num;
    var angle2 = Math.PI / num2;
    for (let j = 0; j <= num2; j++) {
		  for (let i = 0; i < num; i++) {
            var rx = radius * Math.cos(angle * i) * Math.sin(angle2 * j);
            var rz = radius * Math.sin(angle * i) * Math.sin(angle2 * j);
            var ry = radius * Math.cos(angle2 * j);
            this.particles.push(new Particle(x + rx, y + ry, rz, j * imgWidth + i));
        }
    }
}

Sphere.prototype.RotateAxisY = function (angle) {
    for (let i = 0, imax=this.particles.length; i < imax; i++) {
        this.particles[i].posModel.x = this.particles[i].pos.x * Math.cos(angle) + this.particles[i].pos.z * (-1) * Math.sin(angle);
        this.particles[i].posModel.y = this.particles[i].pos.y;
        this.particles[i].posModel.z = this.particles[i].pos.x * Math.sin(angle) + this.particles[i].pos.z * Math.cos(angle);
    }
}

Sphere.prototype.Draw = function (ctx) {
    ctx.beginPath();
    for (let i = 0, imax=this.particles.length; i < imax; i++) {
        var z = this.particles[i].posModel.z;
        var x = this.particles[i].posModel.x * screenScale / (z*(-1) + screenScale) + screenX;
        var y = this.particles[i].posModel.y * screenScale / (z*(-1) + screenScale) + screenY;;
        var a = (this.particles[i].posModel.z + (imgWidth / 2)) / imgWidth;
        if (a > 0.2) {
          ctx.fillStyle = "rgba(" + this.particles[i].r + "," + this.particles[i].g + "," + this.particles[i].b + "," + a + ")";
          ctx.fillRect(this.pos.x + x, this.pos.y + y, 2, 2);
        }
	  }
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (isReadyAnimation) {
        spheres[0].Draw(ctx);
        spheres[0].RotateAxisY(rotation);
        rotation += 0.05;
    }
    requestAnimationFrame(loop);
}
CreateColorsArr();
loop();
    
