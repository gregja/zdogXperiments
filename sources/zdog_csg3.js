import {CsgLibrary} from "../js/csg_library.js";
import {CSG} from "../js/csg.js";
import {generateCSG, generateOutputFileBlobUrl} from "../js/csg_tools.js";

function letsgo() {
    let current3Dobject;
    let current_code = CsgLibrary.basic_1.code;

    let textarea = document.getElementById('csgcode');
    textarea.value = current_code;
    let warning = document.getElementById('warning');
    let submit = document.getElementById('submit');

    let export_area = document.getElementById('export');

    let downloadLink = document.getElementById('export_link');
    if (downloadLink == undefined) {
        console.warn('Export not possible because the hidden download link is missing');
    } else {
        let export_button_stl = document.createElement('button');
        export_button_stl.innerText = 'Generate STL';
        export_area.appendChild(export_button_stl);
        export_button_stl.addEventListener('click', (evt)=>{
            generateOutputFileBlobUrl(current3Dobject, downloadLink, 'stl' )
        }, false);
    }

    var generateShape = function(scale=100) {
        current3Dobject = generateCSG(CSG, textarea.value, null, warning);

        let points = [];
        let polygons = [];
        let id_poly = -1;

        if (current3Dobject != null) {
            current3Dobject.polygons.forEach(items => {
                let polygon = [];
                items.vertices.forEach(vertex => {
                    let point = {x: vertex.pos.x * scale, y: vertex.pos.y * scale, z: vertex.pos.z * scale};
                    points.push(point);
                    id_poly++;
                    polygon.push(id_poly);
                });
                polygons.push(polygon);
            });
        }

        return {points: points, polygons: polygons};
    };

    var default_color = "#000000";  // color picker : https://www.w3schools.com/colors/colors_picker.asp
    var stroke_value = 1;
    var illo = undefined; // pointer to the main object (for refreshing)
    var mainshape = undefined;  // pointer to the wireframe shape (when it's activated)
    var draw_modes = ['Wireframe', 'Paint'];
    var draw_mode_default = draw_modes[1];
    var spin_modes = ['Spinning', 'Static'];
    var spin_mode_default = spin_modes[0];
    var isSpinning = true;

    var colpicker = document.getElementById("colorpicker");
    if (colpicker) {
        colpicker.value = default_color;
        colpicker.addEventListener('change', function(evt) {
            default_color = this.value;
            if (mainshape) {
                mainshape.color = default_color;
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
    function genShape2(ref) {
        var obj3d = generateShape();
        if (obj3d == null) {
            return;
        }
        var colors = chroma.scale(['#9cdf7c','#2A4858']).mode('lch').colors(obj3d.polygons.length);

        obj3d.polygons.forEach((vertices, idx) => {
            let shape = [];
            vertices.forEach(item => {
                shape.push(obj3d.points[item]);
            });

            new Zdog.Shape({
                addTo: ref,
                path: shape,
                color: colors[idx],
                closed: false,
                stroke: stroke_value,
                fill: true,
            });
        });
    }

    var isSpinning = true;

    illo = new Zdog.Illustration({
        element: '.zdog-canvas',
        dragRotate: true,
        // pause spinning while dragging
        //onDragStart: () => isSpinning = false,
        //onDragEnd: () => isSpinning = true
    });

    function generateGraph() {
        illo.children = []; // drop all children before regeneration
        if (draw_mode_default == 'Wireframe') {
            let shape = generateShape();
            if (shape == null) {
                return;
            }
            mainshape = new Zdog.Shape({
                addTo: illo,
                path: genShape1(shape),
                color: default_color,
                closed: false,
                stroke: stroke_value,
                fill: false,
            });
        } else {
            mainshape = null;
            genShape2(illo);
        }
    }

    submit.addEventListener("click",(evt)=>{
        evt.preventDefault();
        generateGraph();
    }, false);

    // generate first shape
    submit.click();

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
                if (mainshape) {
                    mainshape.stroke = stroke_value;
                }
                break;
            }
            case KEY_TWO:{
                stroke_value = 2;
                if (mainshape) {
                    mainshape.stroke = stroke_value;
                }
                break;
            }
            case KEY_THREE:{
                stroke_value = 3;
                if (mainshape) {
                    mainshape.stroke = stroke_value;
                }
                break;
            }
            case KEY_FOUR:{
                stroke_value = 4;
                if (mainshape) {
                    mainshape.stroke = stroke_value;
                }
                break;
            }
            case KEY_FIVE:{
                stroke_value = 5;
                if (mainshape) {
                    mainshape.stroke = stroke_value;
                }
                break;
            }

        }
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
            evt.preventDefault();
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
    //document.addEventListener('keyup', keyReleased, false);

    animate();
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
    letsgo();
});
