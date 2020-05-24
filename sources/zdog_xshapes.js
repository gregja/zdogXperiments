/*
   Example of a complex 3D object created with 3 primitives
   largely inspired by : https://library.fridoverweij.com/codelab/3d_wireframe/index.html
*/
{
    "use strict";

    var list_shapes = shapes3dToolbox.getAssemblyObject01();
    var id_shapes = Object.keys(list_shapes);

    var default_color = "#000000";  // color picker : https://www.w3schools.com/colors/colors_picker.asp
    var stroke_value = 1;
    var illo = undefined; // pointer to the main object (for refreshing)
    var shapes_wire = [];
    var shapes_paint = [];
    var draw_modes = ['Wireframe', 'Paint'];
    var draw_mode_default = draw_modes[1];
    var spin_modes = ['Spinning', 'Static'];
    var spin_mode_default = spin_modes[0];
    var scale_def = 1;

    var colpicker = document.getElementById("colorpicker");
    if (colpicker) {
        colpicker.value = default_color;
        colpicker.addEventListener('change', function(evt) {
            default_color = this.value;
            if (shapes_wire.length > 0) {
                shapes_wire.forEach(item => {
                    item.color = default_color;
                })
            }
        }, false);
    } else {
        console.warn('color picker not found');
    }

    // Wireframe shape
    function genShape1(obj3d) {
        var datas = [];

        obj3d.polygons.forEach(vertices => {

            vertices.forEach(item => {
                datas.push(obj3d.points[item]);
            });

        });
        return datas;
    }

    // filled shape
    function genShape2(ref, shape) {
        let generateShape = shapes3dToolbox[shape.fn];
        let shape_params = shape.default;
        let obj3d = generateShape(shape_params);
        var colors = chroma.scale(['#9cdf7c','#2A4858']).mode('lch').colors(obj3d.polygons.length);

        obj3d.polygons.forEach((vertices, idx) => {
            let shape = [];
            vertices.forEach(item => {
                shape.push(obj3d.points[item]);
            })

            shapes_paint.push(new Zdog.Shape({
                addTo: ref,
                path: shape,
                color: colors[idx],
                closed: false,
                stroke: stroke_value,
                fill: true,
            }));
        });
    }

    var isSpinning = true;

    illo = new Zdog.Illustration({
        element: '.zdog-canvas',
        dragRotate: true,
        scale: scale_def
        // pause spinning while dragging
        //onDragStart: () => isSpinning = false,
        //onDragEnd: () => isSpinning = false
    });

    function generateGraph() {
        illo.children = []; // drop all children before regeneration

        if (draw_mode_default == 'Wireframe') {
            shapes_wire = [];
            shapes_paint = [];

            list_shapes.forEach((item) => {
                let generateShape = shapes3dToolbox[item.fn];
                let shape_params = item.default;

                shapes_wire.push(new Zdog.Shape({
                    addTo: illo,
                    path: genShape1(generateShape(shape_params)),
                    color: default_color,
                    closed: false,
                    stroke: stroke_value,
                    fill: false,
                }));
            });

        } else {
            shapes_wire = [];
            shapes_paint = [];

            list_shapes.forEach(item => {
                genShape2(illo, item);
            });

        }
    }

    generateGraph();

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
        illo.scale.x = scale_def;
        illo.scale.y = scale_def;
        illo.scale.z = scale_def;
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

        }
    }

    function keyReleased (e) {
        e.preventDefault();
        // TODO : find something to implement here ;)
    }

    var draw_mode_btn = document.getElementById('drawmode');
    if (draw_mode_btn) {
        if (draw_mode_default == draw_modes[1]) {
          draw_mode_btn.innerHTML = draw_modes[0];
        } else {
          draw_mode_btn.innerHTML = draw_modes[1];
        }
        draw_mode_btn.addEventListener('click', function(evt) {
            let other_mode;
            if (draw_mode_default == draw_modes[0]) {
                draw_mode_default = draw_modes[1];
                other_mode = draw_modes[0];
                colpicker.setAttribute('disabled', 'disabled');
            } else {
                draw_mode_default = draw_modes[0];
                other_mode = draw_modes[1];
                colpicker.removeAttribute('disabled');
            }
            draw_mode_btn.innerHTML = other_mode;
            generateGraph();
        }, false);
    } else {
        console.warn('draw mode button not found');
    }

    var spin_mode_btn = document.getElementById('spinning');
    if (spin_mode_btn) {
        spin_mode_btn.innerHTML = spin_modes[1];
        spin_mode_btn.addEventListener('click', function(evt) {
            let other_mode;
            if (spin_mode_default == spin_modes[0]) {
                spin_mode_default = spin_modes[1];
                other_mode = spin_modes[0];
                isSpinning = false;
            } else {
                spin_mode_default = spin_modes[0];
                other_mode = spin_modes[1];
                isSpinning = true;
            }
            spin_mode_btn.innerHTML = other_mode;
            generateGraph();
        }, false);
    } else {
        console.warn('spin mode button not found');
    }

    document.addEventListener('keydown', keyPressed, false);
    document.addEventListener('keyup', keyReleased, false);

    document.addEventListener("DOMContentLoaded", function(event) {
        console.log("DOM fully loaded and parsed");
        animate();
    });

}
