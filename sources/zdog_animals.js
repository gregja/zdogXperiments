/**
 * Largely inspired by this pen of Hankuro :
 *   https://codepen.io/hankuro/pen/QMVLJZ
 * rewritten for Zdog /**
 * Largely inspired by this pen of Hankuro :
 *   https://codepen.io/hankuro/pen/QMVLJZ
 *   (the wolf and elk meshes are created by Hankuro)
 * rewritten for Zdog by Gregja
 *   https://github.com/gregja/zdogXperiments/
 */
{
    "use strict";

    var shape_params = {};

	// path for codepen
  //   var path = "https://raw.githack.com/gregja/zdogXperiments/master/assets/";
	// path for local environment
	var path = "../assets/";

    // json files of the meshes :
    const list_shapes = [
        {
            name: "wolf",
            path: path+"wolf.json"
        },
        {
            name: "elk",
            path: path+"elk.json"
        },
        {
            name: "fox",
            path: path+"fox.json"
        },
        /*  TODO : json file for horse not compatible, adapt it later
        {
            name: "horse",
            path: path+"horse.json"
        },*/
      ];

    var default_color = "#000000";  // color picker : https://www.w3schools.com/colors/colors_picker.asp
    var stroke_value = 1;
    var scale_init = 5;
    var illo = undefined; // pointer to the main object (for refreshing)
    var mainshape = undefined;  // pointer to the wireframe shape (when it's activated)
    const draw_modes = ['Points', 'Wireframe', 'Paint'];
    var draw_mode_current = 2;  // use the Paint mode by default
    var zoom_factor = 0.05;
    const DEG_TO_RAD = Math.PI / 180;
    var current_morphing = 0;
    var max_morphing = -1;    // number of morphing vertices (calculated after loading)
    var is_moving = false;    // define to true if you want the animals move immediately after loading
    var isSpinning = false;   // spinning mode not used in that version (maybe later)
	  var jquery_used = false;  // define to true if you want to load JSON files with Jquery instead of the Fetch API

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

    illo = new Zdog.Illustration({
        element: '.zdog-canvas',
        dragRotate: true,
        scale: scale_init,
        // pause spinning while dragging
        //onDragStart: () => isSpinning = false,
        //onDragEnd: () => isSpinning = true
    });
    illo.rotate.z = 180 * DEG_TO_RAD;
    illo.rotate.y = 45 * DEG_TO_RAD;
    illo.translate.y = 200;

    /**
     * Wireframe mode
     * @param movie_index
     * @returns {Array}
     */
    function genShape1(movie_index = -1) {

        var obj3d = {};
        if (movie_index != -1) {
            let points = shape_params.morphings[movie_index];
            shape_params.points = points;
        }
        obj3d = shape_params;

        var datas = [];

        obj3d.polygons.forEach(vertices => {
            let points = [];

            vertices.forEach(item => {
                if (obj3d.points[item]) {
                    points.push({point: obj3d.points[item]});
                }
            })

            points.forEach(item => {
                if (item.point != undefined && item.point.x != undefined) {
                    datas.push({x: item.point.x, y: item.point.y, z: item.point.z});
                }
            })
        });
        return datas;
    }

    /**
     * Paint mode
     * @param ref
     * @param movie_index
     * @param gradient_color
     */
    function genShape2(ref, movie_index = -1, gradient_color = 1) {

        var obj3d = {};
        if (movie_index != -1) {
            let points = shape_params.morphings[movie_index];
            shape_params.points = points;
        }
        obj3d = shape_params;

        if (shape_params.hasOwnProperty('gradient_color')) {
            gradient_color = Number(shape_params.gradient_color);
            if (gradient_color != 1 && gradient_color != 2) {
                console.warn('gradient color mode is bad, taken 1 by default');
                gradient_color = 1;
            }
        }

        const reducer = (accumulator, currentValue) => accumulator + currentValue.length;
        let nb_colors = obj3d.polygons.reduce(reducer, 0);

        var colors = [];
        if (gradient_color == 1) {
            // each polygon has a unique color
            colors = chroma.scale(['#d8b48d', '#5f4121']).mode('lch').colors(nb_colors)
        } else {
            // generate a first set of unique colors (from darkest to brightest) for the first half
            // of the polygons, then reverse that color series for the second half of the polygons
            // (interesting mode for cylinders and cones)

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
        let idx = 0;
        obj3d.polygons.forEach(vertices => {
            let shape = [];
            vertices.forEach(item => {
                if (item != undefined && obj3d.points[item] != undefined) {
                    let point = obj3d.points[item];
                    shape.push({x: point.x, y: point.y, z: point.z});
                }
            });
            if (shape.length > 0) {
                new Zdog.Shape({
                    addTo: ref,
                    path: shape,
                    color: colors[idx] || default_color,
                    closed: false,
                    stroke: stroke_value,
                    fill: true,
                    //      scale: scale_init*10,
                });
                idx++;
            }
        });

    }

    /**
     * Points mode
     * @param ref
     * @param movie_index
     */
    function genShape3(ref, movie_index = -1) {
        var obj3d = {};
        if (movie_index != -1) {
            let points = shape_params.morphings[movie_index];
            shape_params.points = points;
        }
        obj3d = shape_params;

        obj3d.polygons.forEach(vertices => {

            let shape = [];
            vertices.forEach(item => {
                if (item != undefined && obj3d.points[item] != undefined) {
                    let point = obj3d.points[item];
                    shape.push({x: point.x, y: point.y, z: point.z});
                }
            });

            shape.forEach(item => {
                new Zdog.Shape({
                    addTo: ref,
                    color: default_color,
                    stroke: 4,
                    scale: scale_init * 10,
                    translate: {x: item.x, y: item.y, z: item.z},
                    fill: true,
                });
            })
        });
    }

    /**
     * Generate Zdog graph after loading a new animal
     */
    function generateGraph() {
        illo.children = []; // drop all children before regeneration

        if (draw_mode_current == 1) {
            // Wireframe mode
            mainshape = new Zdog.Shape({
                addTo: illo,
                path: genShape1(),
                color: default_color,
                closed: false,
                stroke: stroke_value,
                fill: false,
            });
            mainshape.updatePath();
        } else {
            if (draw_mode_current == 2) {
                // Faces mode
                mainshape = null;
                genShape2(illo);
            } else {
                // Points mode
                mainshape = null;
                genShape3(illo);
            }
        }
    }

    /**
     * Draw (nothing to add ;)
     */
    function draw() {
        if (isSpinning) {
            illo.rotate.y += 0.03;
        }

        if (!is_moving) {
            current_morphing = -1;
            illo.updateRenderGraph();
        } else {
            if (current_morphing == -1) {
                current_morphing = 0;
            }
            illo.children = []; // drop all children before regeneration
            if (draw_mode_current == 1) {
                // Wireframe mode
                mainshape = new Zdog.Shape({
                    addTo: illo,
                    path: genShape1(current_morphing),
                    color: default_color,
                    closed: false,
                    stroke: stroke_value,
                    fill: false,
                });
                mainshape.updatePath();
            } else {
                if (draw_mode_current == 2) {
                    // Faces mode
                    genShape2(illo, current_morphing);
                } else {
                    // Points mode
                    genShape3(illo, current_morphing);
                }
            }

            illo.updateRenderGraph();

            current_morphing++;

            if (current_morphing >= max_morphing) {
                current_morphing = 0;
            }
        }
    }

    /**
     * Main loop for animation
     */
    function animate() {
        draw();
        requestAnimationFrame(animate);
    }

    /**
     * Reset scale after zooming
     */
    function resetScale() {
        illo.scale.x = scale_init;
        illo.scale.y = scale_init;
        illo.scale.z = scale_init;
    }

    /**
     * Manage arrow keys (for zoom)
     * @param e
     */
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
                illo.scale.z += zoom_factor;
                break;
            }
            case RIGHT_ARROW: {
                illo.scale.z -= zoom_factor;
                break;
            }
            case UP_ARROW: {
                illo.scale.x += zoom_factor;
                illo.scale.y += zoom_factor;
                illo.scale.z += zoom_factor;
                break;
            }
            case DOWN_ARROW: {
                illo.scale.x -= zoom_factor;
                illo.scale.y -= zoom_factor;
                illo.scale.z -= zoom_factor;
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

    /**
     * Create event listeners for manage buttons
     */
    function prepareEnvironment() {
        var draw_mode_btn = document.getElementById('drawmode');
        if (draw_mode_btn) {
            let tmp_mode = draw_mode_current + 1;
            if (tmp_mode >= draw_modes.length) {
                tmp_mode = 0;
            }
            draw_mode_btn.innerHTML = draw_modes[tmp_mode];
            draw_mode_btn.addEventListener('click', function (evt) {
                draw_mode_current++;
                if (draw_mode_current > draw_modes.length - 1) {
                    draw_mode_current = 0;
                }
                let other_mode = draw_modes[draw_mode_current + 1] || draw_modes[0];
                if (draw_mode_current == 2) {
                    colpicker.setAttribute('disabled', 'disabled');
                } else {
                    colpicker.removeAttribute('disabled');
                }
                draw_mode_btn.innerHTML = other_mode;
                generateGraph();
            }, false);
        } else {
            console.warn('draw mode button not found');
        }

        var anime_mode_btn = document.getElementById('anime');
        if (anime_mode_btn) {
            if (is_moving) {
                anime_mode_btn.innerHTML = "stop anime";
            } else {
                anime_mode_btn.innerHTML = "start anime";
            }
            anime_mode_btn.addEventListener('click', function (evt) {
                is_moving = !is_moving;
                if (is_moving) {
                    anime_mode_btn.innerHTML = "stop anime";
                } else {
                    anime_mode_btn.innerHTML = "start anime";
                }
                generateGraph();
            }, false);
        } else {
            console.warn('draw mode button not found');
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
                let current_id = Number(String(this.value).replace('p', ''));
                let json_path = list_shapes[current_id].path;
                loadOBJ(json_path, 1, () => {
                    generateGraph();
                });

            }, false);
        } else {
            console.warn('obj selector not found');
        }

        var zoom1_btn = document.getElementById('zoom1');
        if (zoom1_btn) {
            zoom1_btn.addEventListener('click', function (e) {
                console.log('zoom 1');
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
                console.log('zoom 2');
                e.preventDefault();
                illo.scale.x += zoom_factor;
                illo.scale.y += zoom_factor;
                illo.scale.z += zoom_factor;
            }, false);
        } else {
            console.warn('zoom+ button not found');
        }

        document.addEventListener('keydown', keyPressed, false);
       // document.addEventListener('keyup', keyReleased, false);
    }

    /**
     * Generate vertices from JSON file
     * @param vertices
     * @returns {Array}
     */
    function makeVertices(vertices) {
        let _vertices = [];
        let size = vertices.length;
        let offset = 0;
        while (offset < size) {
            let vertice = {};
            vertice['x'] = vertices[offset++];
            vertice['y'] = vertices[offset++];
            vertice['z'] = vertices[offset++];
            _vertices.push(vertice);
        }
        return _vertices;
    }

    /**
     * Generate faces from JSON file
     * @param faces
     * @returns {Array}
     */
    function makeFaces(faces) {
        let _faces = [];
        let size = faces.length;
        let offset = 0;
        while (offset < size) {
            let type = faces[offset++];
            let face = [];
            face[0] = faces[offset++];
            face[1] = faces[offset++];
            face[2] = faces[offset++];

            //offset++;
            for (var i = 0; i < 5; i++) offset++;
            //offset++;

            _faces.push(face);
        }
        return _faces;
    }

    /**
     * Load JSON file
     * @param url
     * @param scale
     * @param onload
     */
    function loadOBJ(url, scale = 1, onload) {
		if (jquery_used) {
			loadjQuery(url, scale = 1, onload);
		} else {
			loadFetch(url, scale = 1, onload);
		}
    }

	/**
     * Load JSON file
     * @param url
     * @param scale
     * @param onload
     */
    function loadjQuery(url, scale = 1, onload) {

        jQuery.ajax({
            url: url
        }).done(function (datas) {
            let points = makeVertices(datas.vertices);
            let morphings = datas.morphTargets.map(item => makeVertices(item.vertices));
            max_morphing = morphings.length;
            let polygons = makeFaces(datas.faces);

            shape_params = {points: points, polygons: polygons, morphings: morphings};

            onload();
        });

    }

    /**
     * This function works locally, but don't work on Codepen, so I replaced it by the loadObj function using jQuery
     * @param url
     * @param scale
     * @param onload
     */
    function loadFetch(url, scale = 1, onload) {

        let myHeaders = new Headers({
            'Access-Control-Allow-Origin': path,
            'Content-Type': 'text/html'
        });
        var myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'no-cors',
            type: 'text',
            cache: 'default'
        };

        var myRequest = new Request(url, myInit);

        fetch(myRequest, myInit).then(response => {
            if (response.ok) {
                response.text().then(function (content) {
                    const datas = JSON.parse(content);
                    console.log(datas.vertices.length);
                    console.log(datas.faces.length);

                    let points = makeVertices(datas.vertices);
                    let morphings = datas.morphTargets.map(item => makeVertices(item.vertices));
                    max_morphing = morphings.length;
                    let polygons = makeFaces(datas.faces);

                    shape_params = {points: points, polygons: polygons, morphings: morphings};

                    onload();
                });
            } else {
                console.error('server githack response : ' + response.status);
            }
        }).catch(err => {
            console.error(err);
        });
    }

    document.addEventListener("DOMContentLoaded", function (event) {
        console.log("DOM fully loaded and parsed");

        let json_path = list_shapes[0].path;
        loadOBJ(json_path, 1, () => {
            generateGraph();
            prepareEnvironment();
            animate();
        });
    });

}
