/**
 * calabi-yau-manifold-3d
 * Adaptation for Zdog of the algorithm below :
 * https://observablehq.com/@sw1227/calabi-yau-manifold-3d
 */
{
    "use strict";

    var shape_params = {exponent: 5, projection: 3, disorder: 0};

    var default_color = "#000000";  // color picker : https://www.w3schools.com/colors/colors_picker.asp
    var stroke_value = 1;
    var zoom_factor = 5;
    var illo = undefined; // pointer to the main object (for refreshing)
    var mainshape = undefined;  // pointer to the wireframe shape (when it's activated)
    var draw_modes = ['Wireframe', 'Paint'];
    var draw_mode_default = draw_modes[1];
    var spin_modes = ['Spinning', 'Static'];
    var spin_mode_default = spin_modes[0];
    var isSpinning = true;
    var default_scale = 150;

    var generateShape = shapeCalabiYau.generateShape;

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

    // Wireframe shape
    function genShape1(obj3d) {
        var datas = [];

        obj3d.polygons.forEach(vertices => {
            let points = [];

            vertices.forEach((item, idx) => {
                points.push({point: obj3d.points[vertices[idx]]});
            })

            points.forEach(item => {
                datas.push({x: item.point.x, y: item.point.y, z: item.point.z});
            })
        });
        return datas;
    }

    // filled shape
    function genShape2(ref, gradient_color = 1) {
        var obj3d = generateShape(shape_params);

        if (shape_params.hasOwnProperty('gradient_color')) {
            // if gradient_color is set in shape_params, it has priority
            gradient_color = Number(shape_params.gradient_color);
            if (gradient_color != 1 && gradient_color != 2) {
                console.warn('gradient color mode is bad, taken 1 by default');
                gradient_color = 1;
            }
        }

        var colors = genColors(obj3d.polygons.length, gradient_color); //  chroma.scale(['#9cdf7c', '#2A4858']).mode('lch').colors(obj3d.polygons.length);

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

    function generateGraph() {
        illo.children = []; // drop all children before regeneration
        if (draw_mode_default == 'Wireframe') {
            mainshape = new Zdog.Shape({
                addTo: illo,
                path: genShape1(generateShape(shape_params)),
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

    function resetScale() {
        illo.scale.x = default_scale;
        illo.scale.y = default_scale;
        illo.scale.z = default_scale;
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

        }
    }

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

    var draw_mode_btn = document.getElementById('drawmode');
    if (draw_mode_btn) {
        if (draw_mode_default == draw_modes[1]) {
            draw_mode_btn.innerHTML = draw_modes[0];
        } else {
            draw_mode_btn.innerHTML = draw_modes[1];
        }
        draw_mode_btn.addEventListener('click', function (evt) {
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
            spin_mode_btn.innerHTML = spin_modes[0];
        } else {
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
        }, false);
    } else {
        console.warn('spin mode button not found');
    }

    var cursor_exponent = document.getElementById('exponent');
    if (cursor_exponent) {
        cursor_exponent.value = shape_params.exponent;
        let span_exponent = document.getElementById('span_exponent');
        if (span_exponent == undefined) {
            console.warn('span not found');
        } else {
            span_exponent.innerHTML = shape_params.exponent;
        }
        cursor_exponent.addEventListener('change', function (evt) {
            evt.preventDefault();
            shape_params.exponent = Number(evt.currentTarget.value);
            span_exponent.innerHTML = shape_params.exponent;
            generateGraph();
        }, false);
    } else {
        console.warn('cursor not found');
    }

    var cursor_projection = document.getElementById('projection');
    if (cursor_projection) {
        cursor_projection.value = shape_params.projection;
        let span_projection = document.getElementById('span_projection');
        if (span_projection == undefined) {
            console.warn('span not found');
        } else {
            span_projection.innerHTML = shape_params.projection;
        }
        cursor_projection.addEventListener('change', function (evt) {
            evt.preventDefault();
            shape_params.projection = Number(evt.currentTarget.value);
            span_projection.innerHTML = shape_params.projection;
            generateGraph();
        }, false);
    } else {
        console.warn('cursor not found');
    }

    var cursor_disorder = document.getElementById('disorder');
    if (cursor_disorder) {
        cursor_disorder.value = shape_params.disorder;
        let span_disorder = document.getElementById('span_disorder');
        if (span_disorder == undefined) {
            console.warn('span not found');
        } else {
            span_disorder.innerHTML = shape_params.disorder;
        }
        cursor_disorder.addEventListener('change', function (evt) {
            evt.preventDefault();
            shape_params.disorder = Number(evt.currentTarget.value);
            span_disorder.innerHTML = shape_params.disorder;
            generateGraph();
        }, false);
    } else {
        console.warn('cursor not found');
    }

    var zoom1_btn = document.getElementById('zoom1');
    if (zoom1_btn) {
        zoom1_btn.addEventListener('click', function (e) {
            e.preventDefault();
            illo.scale.x -= zoom_factor;
            illo.scale.y -= zoom_factor;
            illo.scale.z -= zoom_factor;
        }, false);
    } else {
        console.warn('zoom- button not found');
    }

    var zoom2_btn = document.getElementById('zoom2');
    if (zoom2_btn) {
        zoom2_btn.addEventListener('click', function (e) {
            e.preventDefault();
            illo.scale.x += zoom_factor;
            illo.scale.y += zoom_factor;
            illo.scale.z += zoom_factor;
        }, false);
    } else {
        console.warn('zoom+ button not found');
    }

    document.addEventListener('keydown', keyPressed, false);
    //document.addEventListener('keyup', keyReleased, false);

    document.addEventListener("DOMContentLoaded", function (event) {
        console.log("DOM fully loaded and parsed");

        illo = new Zdog.Illustration({
            element: '#zdog-canvas',
            dragRotate: true,
            // pause spinning while dragging
            //onDragStart: () => isSpinning = false,
            //onDragEnd: () => isSpinning = true
        });

        resetScale();
        generateGraph();
        animate();

    });

}


