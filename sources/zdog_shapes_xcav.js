{
    "use strict";

    var list_shapes = shapes3dToolbox.getGeneratorsList2();
    var id_shapes = Object.keys(list_shapes);

    var generateShape = shapes3dToolbox[list_shapes[id_shapes[0]].fn];
    var effect = shapes3dToolbox.excavateShape;
    var shape_params = list_shapes[id_shapes[0]].default;

    var default_color = "#000000";  // color picker : https://www.w3schools.com/colors/colors_picker.asp
    var stroke_value = 1;
    var illo = undefined; // pointer to the main object (for refreshing)
    var mainshape = undefined;  // pointer to the wireframe shape (when it's activated)
    var draw_modes = ['Paint', 'Wireframe'];
    var draw_mode_default = draw_modes[0];
    var spin_modes = ['Spinning', 'Static'];
    var spin_mode_default = spin_modes[1];
    var fill_modes = ['Empty', 'Full'];
    var fill_mode_default = fill_modes[0];
    var thickness_modes = [2, 4, 8, 10, 12, 16];
    var thickness_mode_default = 8;
    var edge_modes = [1, 2, 3];
    var edge_mode_default = 1;
    var isSpinning = true;

    var colpicker = document.getElementById("colorpicker");
    if (colpicker) {
        colpicker.value = default_color;
        colpicker.addEventListener('change', function (evt) {
            default_color = this.value;
            if (mainshape) {
                mainshape.color = default_color;
            }
        }, false);
    } else {
        console.warn('color picker not found');
    }

    function regenerateShape() {
        if (draw_mode_default == 'Wireframe') {
            let shape;
            if (fill_mode_default == 'Empty') {
                shape = effect(generateShape(shape_params), {
                    bridge_mode: edge_mode_default,
                    thickness_ratio: thickness_mode_default
                });
            } else {
                shape = generateShape(shape_params);
            }
            mainshape = new Zdog.Shape({
                addTo: illo,
                path: genShape1(shape),
                color: default_color,
                closed: false,
                stroke: stroke_value,
                fill: false,
            });
            mainshape.updatePath();
        } else {
            mainshape = null;
            genShape2(illo);
        }
        resetScale();
        generateGraph();
    }

    var objselector = document.getElementById("objselector");
    if (objselector) {
        objselector.setAttribute("value", "p0");
        list_shapes.forEach((item, idx) => {
            let option = document.createElement('option');
            option.setAttribute('value', 'p' + String(idx));
            option.innerHTML = item.name;
            objselector.append(option);
            if (idx == 0) {
                option.setAttribute("selected", "selected");
            }
        });
        objselector.blur();
        objselector.addEventListener('change', function (evt) {
            evt.preventDefault();
            this.blur();
            var current_id = Number(String(this.value).replace('p', ''));
            generateShape = shapes3dToolbox[list_shapes[current_id].fn];
            shape_params = list_shapes[current_id].default;
            regenerateShape();
        }, false);
    } else {
        console.warn('obj selector not found');
    }

    var fillorempty = document.getElementById("fillorempty");
    if (fillorempty) {
        if (fill_mode_default == fill_modes[0]) {
            fillorempty.innerText = fill_modes[1];
        } else {
            fillorempty.innerText = fill_modes[0];
        }
        fillorempty.addEventListener('click', function (evt) {
            evt.preventDefault();
            if (fill_mode_default == fill_modes[0]) {
                fill_mode_default = fill_modes[1];
                fillorempty.innerText = fill_modes[0];
            } else {
                fill_mode_default = fill_modes[0];
                fillorempty.innerText = fill_modes[1];
            }
            regenerateShape();
        }, false);
    } else {
        console.warn('fillorempty selector not found');
    }

    var edgemode = document.getElementById("edgemode");
    if (edgemode) {
        edgemode.setAttribute("value", "p0");
        edge_modes.forEach((item) => {
            let option = document.createElement('option');
            option.setAttribute('value', 'p' + String(item));
            option.innerHTML = item;
            edgemode.append(option);
            if (item == edge_mode_default) {
                option.setAttribute("selected", "selected");
            }
        });
        edgemode.blur();
        edgemode.addEventListener('change', function (evt) {
            evt.preventDefault();
            this.blur();
            edge_mode_default = Number(String(this.value).replace('p', ''));
            regenerateShape();
        }, false);
    } else {
        console.warn('edgemode selector not found');
    }

    var thicknessmode = document.getElementById("thicknessmode");
    if (thicknessmode) {
        thicknessmode.setAttribute("value", "p0");
        thickness_modes.forEach((item) => {
            let option = document.createElement('option');
            option.setAttribute('value', 'p' + String(item));
            option.innerHTML = item;
            thicknessmode.append(option);
            if (item == thickness_mode_default) {
                option.setAttribute("selected", "selected");
            }
        });
        thicknessmode.blur();
        thicknessmode.addEventListener('change', function (evt) {
            evt.preventDefault();
            this.blur();
            thickness_mode_default = Number(String(this.value).replace('p', ''));
            regenerateShape();
        }, false);
    } else {
        console.warn('thicknessmode selector not found');
    }

    // Wireframe shape
    function genShape1(obj3d) {
        var datas = [];

        obj3d.polygons.forEach(vertices => {
            let points = [];

            vertices.forEach(item => {
                points.push({point: obj3d.points[item]});
            })

            points.forEach(item => {
                datas.push({x: item.point.x, y: item.point.y, z: item.point.z});
            })
        });
        return datas;
    }

    // filled shape
    function genShape2(ref, gradient_color = 1) {
        var obj3d;
        if (fill_mode_default == 'Empty') {
            obj3d = effect(generateShape(shape_params), {
                bridge_mode: edge_mode_default,
                thickness_ratio: thickness_mode_default
            });
        } else {
            obj3d = generateShape(shape_params);
        }

        if (shape_params.hasOwnProperty('gradient_color')) {
            gradient_color = Number(shape_params.gradient_color);
            if (gradient_color != 1 && gradient_color != 2) {
                console.warn('gradient color mode is bad, taken 1 by default');
                gradient_color = 1;
            }
        }

        var colors = [];
        if (gradient_color == 1) {
            // each polygon has a unique color
            colors = chroma.scale(['#9cdf7c', '#2A4858']).mode('lch').colors(obj3d.polygons.length)
        } else {
            // generate a first set of unique colors (from darkest to brightest) for the first half
            // of the polygons, then reverse that color series for the second half of the polygons
            // (interesting mode for cylinders and cones)
            let nb_colors = obj3d.polygons.length;
            if (nb_colors % 2 == 0) {
                // we wish an odd number
                nb_colors += 1;
            }
            let tmp_colors = chroma.scale(['#9cdf7c', '#2A4858']).mode('lch').colors(Math.round(nb_colors / 2));
            for (let i = tmp_colors.length - 1; i >= 0; i--) {
                tmp_colors.push(tmp_colors[i]);
            }
            colors = tmp_colors;
        }

        obj3d.polygons.forEach((vertices, idx) => {
            let shape = [];
            vertices.forEach(item => {
                if (item != undefined && obj3d.points[item] != undefined) {
                    let point = obj3d.points[item];
                    shape.push({x: point.x, y: point.y, z: point.z});
                }
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

    illo = new Zdog.Illustration({
        element: '.zdog-canvas',
        dragRotate: true,
        // pause spinning while dragging
        //onDragStart: () => isSpinning = false,
        //onDragEnd: () => isSpinning = false
    });

    function generateGraph() {
        illo.children = []; // drop all children before regeneration

        if (draw_mode_default == 'Wireframe') {
            mainshape = new Zdog.Shape({
                addTo: illo,
                path: genShape1(effect(generateShape(shape_params))),
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

    function draw() {
        if (isSpinning) {
            illo.rotate.z += 0.003;
        }
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
    }

    function keyPressed(e) {

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
            case ESCAPE: {
                resetScale();
                break;
            }
            case LEFT_ARROW: {
                illo.scale.z += 0.3;
                break;
            }
            case RIGHT_ARROW: {
                illo.scale.z -= 0.3;
                break;
            }
            case UP_ARROW: {
                illo.scale.x += 0.3;
                illo.scale.y += 0.3;
                illo.scale.z += 0.3;
                break;
            }
            case DOWN_ARROW: {
                illo.scale.x -= 0.3;
                illo.scale.y -= 0.3;
                illo.scale.z -= 0.3;
                break;
            }
            case KEY_ONE: {
                stroke_value = 1;
                if (mainshape) {
                    mainshape.stroke = stroke_value;
                }
                break;
            }
            case KEY_TWO: {
                stroke_value = 2;
                if (mainshape) {
                    mainshape.stroke = stroke_value;
                }
                break;
            }
            case KEY_THREE: {
                stroke_value = 3;
                if (mainshape) {
                    mainshape.stroke = stroke_value;
                }
                break;
            }
            case KEY_FOUR: {
                stroke_value = 4;
                if (mainshape) {
                    mainshape.stroke = stroke_value;
                }
                break;
            }
            case KEY_FIVE: {
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
        draw_mode_btn.innerHTML = draw_modes[1];
        draw_mode_btn.addEventListener('click', function (evt) {
            evt.preventDefault();
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
        if (spin_mode_default == spin_modes[1]) {
            isSpinning = false;
            spin_mode_btn.innerHTML = spin_modes[0];
        } else {
            isSpinning = true;
            spin_mode_btn.innerHTML = spin_modes[1];
        }
        spin_mode_btn.addEventListener('click', function (evt) {
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

    document.addEventListener("DOMContentLoaded", function (event) {
        console.log("DOM fully loaded and parsed");
        generateGraph();
        animate();
    });

}
