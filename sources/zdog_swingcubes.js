// Made with Zdog
{
    "use strict";

    let canvas = document.getElementById('zdog-canvas');
    let width = canvas.width;
    let height = canvas.height;

    var noise = null;
    var boxes = [];

    const radiandToDegrees = (val) => {
        return val * SEMI_CIRCLE_ON_PI;
    };

    let illo = new Zdog.Illustration({
        element: canvas,
        dragRotate: true,
        translate:{x:300},
        rotate:{x:0.9, y:0, z:-4}
    });

    let shape = new Zdog.Shape({
        addTo: illo,
        //    rotate:{y:100, z:100}
    });

    var side = 40;
    var dist = 50;
    var isSpinning = false;

    const getMousePos = function (canvas, evt) {
        // It's a very reliable algorithm to get mouse coordinates (don't use anything else)
        // it works fine on Firefox and Chrome
        // source : https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
        var rect = canvas.getBoundingClientRect();
        return {
            x: (evt.clientX - rect.left) / (rect.right - rect.left) * width,
            y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * height
        };
    }

    var valMin = Infinity;
    var valMax = -Infinity;

    function generateGrid(imax, jmax, gap=100, side=40) {
        let items = [];
        let xbegin = gap / 2;
        let ybegin = gap / 2;

        let yside = side / 2;

        for (let i=0; i<imax; i++) {
            for (let j=0; j<jmax; j++) {
                let x = i*gap+xbegin;
                let y = j*gap+ybegin;

                var value = noise.noise2D(i / imax, j / jmax);
                valMax = Math.max(valMax, value);
                valMin = Math.min(valMin, value);
                let depth = (value * 2 + 4) * yside;

                items.push({node:null, coords:{x:x, y:y, z:0, width:side, height:side, depth:Math.ceil(depth)}});
            }
        }
        return items;
    }

    function refreshGrid() {
        noise = new SimplexNoise(Math.random);
        shape.children = []; // drop all children before regeneration
        boxes = generateGrid(5, 5, side+dist, side);

        boxes.forEach(item => {
            item.node = new Zdog.Box({
                addTo: shape,
                width: item.coords.width,
                height: item.coords.height,
                depth: item.coords.depth,
                translate: {x:item.coords.x, y:item.coords.y, z:  Math.abs((item.coords.depth/2) - item.coords.z) },
                stroke: false,
                color: '#C25', // default face color
                leftFace: '#EA0',
                rightFace: '#E62',
                topFace: '#ED0',
                bottomFace: '#636',
            });
        });
    }

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

    document.addEventListener("DOMContentLoaded", function(event) {
        console.log("DOM fully loaded and parsed");
        refreshGrid();
        animate();
        setInterval(function(){
            refreshGrid();
            //illo.updateRenderGraph();
        }, 300);
    });
}
