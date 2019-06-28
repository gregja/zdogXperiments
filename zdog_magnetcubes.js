// Made with Zdog
// inspired by the pen "Swing" (by Pogany)
//    https://codepen.io/giaco/pen/RzjMBY

// version perso pour tests : https://codepen.io/gregja/pen/24862834456fafa972ca681cc71b5661?editors=0010
{
    "use strict";

    let canvas = document.getElementById('zdog-canvas');
    let width = canvas.width;
    let height = canvas.height;

    let illo = new Zdog.Illustration({
        element: canvas,
        dragRotate: true,
        translate:{x:-width/2, y:-height/2},
    //    rotate:{y:100, z:100}
    });

    var side = 40;
    var dist = 50;
    var mid_side = side / 2;
    var global_dist = dist * 2;
    var isSpinning = false;


    const getMousePos = function (canvas, evt) {
        // It's a very reliable algorithm to get mouse coordinates (don't use anything else)
        // it works fine on Firefox and Chrome
        // source : https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
        var rect = canvas.getBoundingClientRect();
        return {
            x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
            y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
        };
    }

    function generateGrid(xmax, ymax, space=100) {
        let items = [];
        let xbegin = space + 10;
        let ybegin = space + 10;
        for (let x=0; x<xmax; x++) {
            for (let y=0; y<ymax; y++) {
                items.push({node:null, coords:{x:x*space+xbegin, y:y*space+ybegin, z:0}});
            }
        }
        return items;
    }

    var boxes = generateGrid(7, 5, side+dist);

    const diffArctangente = (a, b) => {
        let diffX = a.x - b.x ;
        let diffY = a.y - b.y;
        return Math.atan2(diffY, diffX);
    }

    boxes.forEach(item => {
        item.node = new Zdog.Box({
            addTo: illo,
            width: side,
            height: side,
            depth: side,
            translate: item.coords,
            rotate: {x: 0.7, y:0.7},
            stroke: false,
            color: '#C25', // default face color
            leftFace: '#EA0',
            rightFace: '#E62',
            topFace: '#ED0',
            bottomFace: '#636',
        });
    })

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

    const PI_ON_SEMI_CIRCLE = Math.PI / 180;
    const SEMI_CIRCLE_ON_PI = 180 / Math.PI;

    const degreesToRadians = (val) => {
        return val * PI_ON_SEMI_CIRCLE;
    }

    const radiandToDegrees = (val) => {
        return val * SEMI_CIRCLE_ON_PI;
    }

    document.addEventListener('mousemove', (e) => {
        let mouse = getMousePos(canvas, e);
        mouse.z = 0; // z doesn't existe on the mouse object, we add it for comparison with the coordinates of the cubes

        // Effect 1 :
        /*
        	boxes.forEach(sqr => {
                let diff = diffHypothenuse(sqr.coords, mouse);
                if (diff < 200) {
                    let angle = degreesToRadians(diff / 5);
                    sqr.node.rotate = {x: angle, y:angle};
                }
        	})
        */

        // Effect 2 :
    	boxes.forEach(sqr => {
            let angle = diffArctangente(mouse, sqr.coords);
            sqr.node.rotate = {x: angle, y:angle};
    	});


    })

    document.addEventListener("DOMContentLoaded", function(event) {
        console.log("DOM fully loaded and parsed");
        animate();
    });
}
