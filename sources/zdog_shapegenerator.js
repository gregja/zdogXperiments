/**
 * Generator of shapes largely inspired by an example excerpt of the book of
 *  Nikolaus Gradwohl : "Processing 2: Creative Programming Hotshot", Packt Publishing 2013
 * You can watch another adaptation I've made before, with Processing.js, in
 *  that repository (in sketch17) : https://github.com/gregja/pjs3D_experiments
 */
{
    "use strict";

    var generateShape = shapes3dToolbox.customShape;

    var default_color = "#000000";  // color picker : https://www.w3schools.com/colors/colors_picker.asp
    var stroke_value = 1;
    var illo = {}; // pointer to the main object (for refreshing)
    var mainshape = {};  // pointer to the wireframe shape (when it's activated)
    var draw_modes = ['Paint', 'Wireframe'];
    var isPainting = true;
    var spin_modes = ['Spinning', 'Static'];
    var isSpinning = false;
    var rendrMode = true; // true=triangle strip standard ; false=triangle strip buggy but pretty
    var render_modes = ['triangle strip', 'buggy&pretty'];
    var scale_value = 0.3;
    var spinning_y = 0.003;

    const {
        cos, sin, PI, tan, sqrt, abs, pow
    } = Math;
    const DEG_TO_RAD = PI / 180;
    const degToRad = angle => angle * DEG_TO_RAD;
    const radToDeg = angle => angle * (180 / PI);

    var max_tri_strips = 30;
    var max_vertices = 72;
    var vertx = [];
    var verty = [];

    // what to do when an event "change" is triggered on a field form
    var slider_callback = function (self) {
        data_form[self.id] = self.value;
        generateGraph();
        return null;
    }

    // list of filters to generate as field forms
    var filters = [];   // count , radius , twist, hcount, phase, hradius
    filters.push({field: "count", min: 1, max: 100, value: 5, step: 1, label: "Count", callback: slider_callback});
    filters.push({field: "radius", min: -10, max: 100, value: 5, step: 1, label: "Radius", callback: slider_callback});
    filters.push({field: "twist", min: -2, max: 2, value: 2, step: .1, label: "Twist", callback: slider_callback});
    filters.push({field: "hcount", min: 0, max: 2, value: 1.5, step: .1, label: "HCount", callback: slider_callback});
    filters.push({field: "phase", min: 0, max: 4, value: 2, step: 1, label: "Phase", callback: slider_callback});
    filters.push({field: "hradius", min: -10, max: 10, value: 5, step: 1, label: "HRadius", callback: slider_callback});

    // store live parameters (attached to filters)
    var data_form = {};

    // generate form fields
    multiSliders('form', filters, data_form);
    console.log(data_form);
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

    /**
     * Generate shape in Wireframe mode
     * @param obj3d
     * @returns {Array}
     */
    function genShape1(obj3d) {
        var datas = [];

        obj3d.polygons.forEach(node => {
            let point_a = obj3d.points[node[0]];
            let point_b = obj3d.points[node[1]];
            let point_c = obj3d.points[node[2]];

            datas.push({x: point_a.x, y: point_a.y, z: point_a.z});
            datas.push({x: point_b.x, y: point_b.y, z: point_b.z});
            datas.push({x: point_c.x, y: point_c.y, z: point_c.z});
        });

        return datas;
    }

    /**
     * Generate list of colors
     * @param poly_length
     * @param gradient_color
     * @returns {Array}
     */
    function genColors(poly_length, gradient_color) {
        var colors = [];
        if (gradient_color == 1) {
            // each polygon has a unique color
            colors = chroma.scale(['#2A4858', '#9cdf7c']).mode('lch').colors(poly_length)
        } else {
            // generate a first set of unique colors (from darkest to brightest) for the first half
            // of the polygons, then reverse that color series for the second half of the polygons
            // (interesting mode for cylinders and cones)
            let nb_colors = poly_length;
            if (nb_colors % 2 == 0) {
                // we wish an odd number
                nb_colors += 1;
            }
            let tmp_colors = chroma.scale(['#2A4858', '#9cdf7c']).mode('lch').colors(Math.round(nb_colors / 2));
            for (let i = tmp_colors.length - 1; i >= 0; i--) {
                tmp_colors.push(tmp_colors[i]);
            }
            colors = tmp_colors;
        }
        return colors;
    }

    // filled shape
    /**
     * Generate shape in Paint mode
     * @param ref
     * @param shape_params
     * @param gradient_color
     */
    function genShape2(ref, shape_params, gradient_color = 1) {

        if (shape_params.hasOwnProperty('gradient_color')) {
            // if gradient_color is set in shape_params, it has priority
            gradient_color = Number(shape_params.gradient_color);
            if (gradient_color != 1 && gradient_color != 2) {
                console.warn('gradient color mode is bad, taken 1 by default');
                gradient_color = 1;
            }
        }

        // generate the top of the shape
        shape_params.rendrParts = 1;
        var obj3d1 = generateShape(shape_params);
        var colors1 = genColors(obj3d1.polygons.length, gradient_color);

        var points1 = obj3d1.points;
        obj3d1.polygons.forEach((vertices, idx) => {
            let shape = [];
            vertices.forEach(item => {
                let point = points1[item];
                shape.push({x: point.x, y: point.y, z: point.z});
            });

            new Zdog.Shape({
                addTo: ref,
                path: shape,
                color: colors1[idx],
                closed: false,
                stroke: stroke_value,
                fill: true,
            });
        });

        // generate the bottom of the shape
        shape_params.rendrParts = 2;
        var obj3d2 = generateShape(shape_params);
        var colors2 = genColors(obj3d2.polygons.length, 2);

        var points2 = obj3d2.points;
        obj3d2.polygons.forEach((vertices, idx) => {
            let shape = [];
            vertices.forEach(item => {
                let point = points2[item];
                shape.push({x: point.x, y: point.y, z: point.z});
            });

            new Zdog.Shape({
                addTo: ref,
                path: shape,
                color: colors2[idx],
                closed: false,
                stroke: stroke_value,
                fill: true,
            });
        });
    }

    illo = new Zdog.Illustration({
        element: '.zdog-canvas',
        dragRotate: true,
        translate: {y: -300},
        //  rotate: {z:degToRad(20)},
        scale: 4,
        // pause spinning while dragging
        //onDragStart: () => isSpinning = false,
        //onDragEnd: () => isSpinning = false
    });

    function generateGraph() {
        illo.children = []; // drop all children before regeneration
        let shape_params = JSON.parse(JSON.stringify(data_form));
        shape_params.max_tri_strips = max_tri_strips;
        shape_params.max_vertices = max_vertices;
        shape_params.rendrMode = rendrMode ? 1 : 2;

        if (!isPainting) {
            // Wireframe mode
            mainshape = new Zdog.Shape({
                addTo: illo,
                path: genShape1(generateShape(shape_params)),
                color: default_color,
                closed: false,
                stroke: stroke_value,
                fill: false,
            });
            mainshape.updatePath();
        } else {
            // Paint mode
            mainshape = null;
            genShape2(illo, shape_params);
        }
    }

    function draw() {

        if (isSpinning) {
            illo.rotate.y += spinning_y;
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
                illo.scale.z += scale_value;
                break;
            }
            case RIGHT_ARROW: {
                illo.scale.z -= scale_value;
                break;
            }
            case UP_ARROW: {
                illo.scale.x += scale_value;
                illo.scale.y += scale_value;
                illo.scale.z += scale_value;
                break;
            }
            case DOWN_ARROW: {
                illo.scale.x -= scale_value;
                illo.scale.y -= scale_value;
                illo.scale.z -= scale_value;
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

    function prepareEnvironment() {

        var draw_mode_btn = document.getElementById('drawmode');
        if (draw_mode_btn) {
            if (!isPainting) {
                draw_mode_btn.innerHTML = draw_modes[0];
            } else {
                draw_mode_btn.innerHTML = draw_modes[1];
            }
            draw_mode_btn.addEventListener('click', function (evt) {
                evt.preventDefault();
                let other_mode;
                if (isPainting) {
                    isPainting = false;
                    other_mode = draw_modes[0];
                    colpicker.setAttribute('disabled', 'disabled');
                } else {
                    isPainting = true;
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
            if (isSpinning) {
                spin_mode_btn.innerHTML = spin_modes[1];
            } else {
                spin_mode_btn.innerHTML = spin_modes[0];
            }
            spin_mode_btn.addEventListener('click', function (evt) {
                evt.preventDefault();
                let other_mode;
                if (isSpinning) {
                    other_mode = spin_modes[0];
                    isSpinning = false;
                } else {
                    other_mode = spin_modes[1];
                    isSpinning = true;
                }
                spin_mode_btn.innerHTML = other_mode;
                generateGraph();
            }, false);
        } else {
            console.warn('spin mode button not found');
        }

        var render_mode_btn = document.getElementById('rendrmode');
        if (render_mode_btn) {
            if (rendrMode) {
                render_mode_btn.innerHTML = render_modes[1];
            } else {
                render_mode_btn.innerHTML = render_modes[0];
            }
            render_mode_btn.addEventListener('click', function (evt) {
                evt.preventDefault();
                let other_mode;
                if (rendrMode) {
                    other_mode = render_modes[0];
                    rendrMode = false;
                } else {
                    other_mode = render_modes[1];
                    rendrMode = true;
                }
                render_mode_btn.innerHTML = other_mode;
                generateGraph();
            }, false);
        } else {
            console.warn('spin mode button not found');
        }
    }

    document.addEventListener('keydown', keyPressed, false);
    //document.addEventListener('keyup', keyReleased, false);

    document.addEventListener("DOMContentLoaded", function (event) {
        console.log("DOM fully loaded and parsed");
        prepareEnvironment();
        generateGraph();
        animate();
    });

}
