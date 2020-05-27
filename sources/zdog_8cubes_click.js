// Made with Zdog
// https://codepen.io/gregja/pen/rEGmGB
{
    "use strict";

    let canvas_visible = document.getElementById('zdog-canvas');
    let context_visible = canvas_visible.getContext('2d');
    let canvas_ghost = document.getElementById('zdog-ghost');
    let context_ghost = canvas_ghost.getContext('2d');
    let width = canvas_visible.width;
    let height = canvas_visible.height;
    canvas_ghost.width = width;
    canvas_ghost.height = height;

    let illo = new Zdog.Illustration({
        element: canvas_visible,
        dragRotate: false,
    });

    let ghost = new Zdog.Illustration({
        element: canvas_ghost,
        dragRotate: false,
    });

    let side = 40;
    let dist = 50;
    //let mid_side = side / 2;
    let global_dist = dist * 2;
    let isSpinning = true;


    let boxes = [];
    boxes.push({x: -dist, y: -dist, z: -dist});
    boxes.push({x: dist, y: dist, z: dist});
    boxes.push({x: -dist, y: dist, z: dist});
    boxes.push({x: dist, y: -dist, z: dist});
    boxes.push({x: dist, y: dist, z: -dist});
    boxes.push({x: -dist, y: -dist, z: dist});
    boxes.push({x: -dist, y: dist, z: -dist});
    boxes.push({x: dist, y: -dist, z: -dist});

    const distance = (a, b) => {
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let dz = b.z - a.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    let links = [];
    let deja_vu = [];

    const search_deja_vu = (idx1, idx2) => {
        let criteria = String(idx1) + '-' + String(idx2);
        let found = deja_vu.find(function (element) {
            return element == criteria;
        });
        if (!found) {
            criteria = String(idx2) + '-' + String(idx1);
            found = deja_vu.find(function (element) {
                return element == criteria;
            });
        }
        return found;
    }

    // find dynamically the links between the wedges
    boxes.forEach((item1, idx1) => {
        boxes.forEach((item2, idx2) => {
            if (idx1 != idx2) {
                if (!search_deja_vu(idx1, idx2)) {
                    let xdist = distance(item2, item1);
                    if (xdist == global_dist) {
                        links.push({a: idx1, b: idx2});
                        deja_vu.push(String(idx1) + '-' + String(idx2));
                        deja_vu.push(String(idx2) + '-' + String(idx1));
                    }
                }
            }
        });
    });

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

    const componentToHex = (c) => {
        let hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    const rgbToHex = (r, g, b) => {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    const getPixel = function (context, x, y) {
        let imageData = context.getImageData(x, y, 1, 1);
        //console.log(imageData);
        let data = imageData.data;
        return rgbToHex(data[0], data[1], data[2]);
    }

    let nb_colors = links.length + boxes.length;
    let colors = chroma.scale(['#ffffcc', '#663300'])
        .mode('lch').colors(nb_colors);

    let current_color = 0;
    let catalog_colors = {};

    links.forEach(item => {
        let a = boxes[item.a];
        let b = boxes[item.b];

        let hidden_color = colors[current_color];
        current_color++;

        let visible = new Zdog.Shape({
            addTo: illo,
            path: [
                {x: a.x, y: a.y, z: a.z},  // start
                {x: b.x, y: b.y, z: b.z}   // end
            ],
            closed: false,
            stroke: 10,
            color: '#636'
        });

        let hidden = new Zdog.Shape({
            addTo: ghost,
            path: [
                {x: a.x, y: a.y, z: a.z},  // start
                {x: b.x, y: b.y, z: b.z}   // end
            ],
            closed: false,
            stroke: 10,
            color: hidden_color
        });

        catalog_colors[hidden_color] = {visible: visible, hidden: hidden};
    });

    boxes.forEach(item => {
        let hidden_color = colors[current_color];
        current_color++;

        let visible = new Zdog.Box({
            addTo: illo,
            width: side,
            height: side,
            depth: side,
            translate: item,
            stroke: false,
            color: '#C25', // default face color
            leftFace: '#EA0',
            rightFace: '#E62',
            topFace: '#ED0',
            bottomFace: '#636',
        });

        let hidden = new Zdog.Box({
            addTo: ghost,
            width: side,
            height: side,
            depth: side,
            translate: item,
            stroke: false,
            color: hidden_color,
            leftFace: hidden_color,
            rightFace: hidden_color,
            topFace: hidden_color,
            bottomFace: hidden_color,
        });

        catalog_colors[hidden_color] = {visible: visible, hidden: hidden};

    })

    function draw() {
        if (isSpinning) {
            let mini_move = 0.003;
            illo.rotate.z += mini_move;
            ghost.rotate.z += mini_move;
            illo.rotate.y += mini_move;
            ghost.rotate.y += mini_move;
        }

        ghost.updateRenderGraph();
        illo.updateRenderGraph();
    }

    function animate() {
        draw();
        requestAnimationFrame(animate);
    }

    function resetScale() {
        illo.scale.x = 1;
        illo.scale.y = 1;
        illo.scale.z = 1;
        ghost.scale = illo.scale
    }

    function keyPressed(e) {

        // Documentation about keyboard events :
        //    https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
        const DOWN_ARROW = 40;
        const LEFT_ARROW = 37;
        const RIGHT_ARROW = 39;
        const UP_ARROW = 38;
        //const BACKSPACE = 8;
        const ESCAPE = 27;

        const mini_move = 0.3;

        switch (e.keyCode) {
            case ESCAPE: {
                resetScale();
                break;
            }
            case LEFT_ARROW: {
                illo.scale.z += mini_move;
                ghost.scale = illo.scale;
                break;
            }
            case RIGHT_ARROW: {
                illo.scale.z -= mini_move;
                ghost.scale = illo.scale;
                break;
            }
            case UP_ARROW: {
                illo.scale.x += mini_move;
                illo.scale.y += mini_move;
                illo.scale.z += mini_move;
                ghost.scale = illo.scale
                break;
            }
            case DOWN_ARROW: {
                illo.scale.x -= mini_move;
                illo.scale.y -= mini_move;
                illo.scale.z -= mini_move;
                ghost.scale = illo.scale;
                break;
            }

        }
    }

    function shapeClicked(evt) {
        let forced_color = 'red';
        let coords = getMousePos(canvas_visible, evt);
        let color = getPixel(context_ghost, coords.x, coords.y);

        if (catalog_colors.hasOwnProperty(color)) {
            console.log('color found : ', coords.x, coords.y, color);
            let item = catalog_colors[color];
            if (item != undefined) {
                console.log(item);
                item.visible.color = forced_color;
                item.visible.leftFace = forced_color;
                item.visible.rightFace = forced_color;
                item.visible.topFace = forced_color;
                item.visible.bottomFace = forced_color;
            }
        } else {
            console.log('color not found : ', color, getPixel(context_visible, coords.x, coords.y));
        }
    }

    canvas_visible.addEventListener('click', shapeClicked, false);

    document.addEventListener('keydown', keyPressed, false);
    //document.addEventListener('keyup', keyReleased, false);

    let button = document.getElementById('hide_ghost');
    if (button) {
        button.innerHTML = 'Hide the ghost';
        button.setAttribute('data-status', 'visible');
        button.addEventListener('click', function (evt) {
            let status = this.getAttribute('data-status');
            if (status == 'visible') {
                status = 'hidden';
                this.innerHTML = 'Show the ghost';
            } else {
                status = 'visible';
                this.innerHTML = 'Hide the ghost';
            }
            this.setAttribute('data-status', status);
            canvas_ghost.style.visibility = status;
        }, false)
    } else {
        console.log('button #hide_ghost not found');
    }

    document.addEventListener("DOMContentLoaded", function (event) {
        console.log("DOM fully loaded and parsed");
        animate();
    });
}
