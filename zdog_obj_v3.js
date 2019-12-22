
{
    "use strict";

    var default_color = "#000000";  // color picker : https://www.w3schools.com/colors/colors_picker.asp
    var fill_value = false;
    var stroke_value = 1;
    var draw_modes = ['Wireframe', 'Fill', 'Paint'];
    var draw_mode_default = draw_modes[0];
    var list_shapes = ['cube', 'diamond', 'dodecahedron', 'gem', 'humanoid', 'icosahedron', 'icosphere',
                        'magnolia', 'shuttle', 'skyscraper', 'hand', 'hand2',
                        'teapot', 'tetrahedron', 'toroid', 'torusknot', 'twistedtorus', 'head'];
    var current_shape = list_shapes[0];
    var spin_modes = ['Spinning', 'Static'];
    var spin_mode_default = spin_modes[0];
    var isSpinning = true;
    var illo, mainshape;

    // filled shape
    function genShape2(ref, obj3d) {
        var colors = chroma.scale(['#9cdf7c','#2A4858']).mode('lch').colors(obj3d.polygons.length);

        obj3d.polygons.forEach((vertices, idx) => {
            let points = [];
            vertices.forEach((item, idx) => {
                points.push({point:obj3d.points[vertices[idx]]});
            })

            let shape = [];

            points.forEach(item => {
                shape.push({x:item.point.x, y:item.point.y, z:item.point.z});
            })

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
        //onDragEnd: () => isSpinning = true
    });

    function start() {
        shapes3dToolbox.import3dObjAsync ({
            url: "./assets/"+list_shapes[0]+".obj.txt",
            scaleTo: 200,
            reorder: false,
            center: true
        }, function(shape3d) {
            illo.children = []; // drop all children before regeneration
            if (draw_mode_default == 'Paint') {
                genShape2(illo, shape3d);
            } else {
                mainshape = new Zdog.Shape({
                    addTo: illo,
                    path: generatePath(shape3d),
                    translate: { z: 10 },
                    color: default_color,
                    stroke: stroke_value,
                    closed: false,
                    fill: fill_value,
                });
            }
            animate();
        });
    }

    var colpicker = document.getElementById("colorpicker");
    if (colpicker) {
        colpicker.value = default_color;
        colpicker.blur();
        colpicker.addEventListener('change', function(evt) {
          evt.preventDefault();
          this.blur();
            default_color = this.value;
            mainshape.color = default_color;
        }, false);
    } else {
        console.warn('color picker not found');
    }

    function regenerateShape() {
        let newshape = shapes3dToolbox.import3dObjAsync ({
            url: "./assets/"+current_shape+".obj.txt",
            scaleTo: 200,
            reorder: false,
            center: true
        }, function(newshape){
            illo.children = []; // drop all children before regeneration
            if (draw_mode_default == 'Paint') {
                genShape2(illo, newshape);
            } else {
                mainshape = new Zdog.Shape({
                    addTo: illo,
                    path: generatePath(newshape),
                    translate: { z: 10 },
                    color: default_color,
                    stroke: stroke_value,
                    closed: false,
                    fill: (draw_mode_default=="Wireframe" ? false : true),
                });
            }

        });
    }

    var objselector = document.getElementById("objselector");
    if (objselector) {
        list_shapes.forEach(item => {
            let option = document.createElement('option');
            option.setAttribute('value', item);
            option.innerHTML = item;
            objselector.append(option);
        });
        objselector.value = list_shapes[0];
        objselector.blur();
        objselector.addEventListener('change', function(evt) {
            evt.preventDefault();
            this.blur();
            current_shape = this.value;
            regenerateShape();
        }, false);
    } else {
        console.warn('obj selector not found');
    }

    var fill_switcher = document.getElementById('fill_switcher');
    if (fill_switcher) {
        draw_modes.forEach(item => {
            let option = document.createElement('option');
            option.setAttribute('value', item);
            option.innerHTML = item;
            fill_switcher.append(option);
        });
        fill_switcher.value = draw_mode_default;
        fill_switcher.blur();
        fill_switcher.addEventListener('change', function(evt) {
            evt.preventDefault();
            this.blur();
            draw_mode_default = this.value;
            regenerateShape();
        }, false);
    } else {
        console.warn('fill switcher not found');
    }

    function resetScale() {
        illo.scale.x = 1;
        illo.scale.y = 1;
        illo.scale.z = 1;
    }

    function generatePath(obj3d) {
        var path = [];
        obj3d.polygons.forEach(vertices => {
            let points = [];

            vertices.forEach(vertix => {
                points.push({point:obj3d.points[vertix]});
            })

            points.forEach(item => {
                if (item.point.x) {
                    path.push({x:item.point.x, y:item.point.y, z:item.point.z});
                }
            });
        });
        return path;
    }

    function draw (){
        if (isSpinning) {
            illo.rotate.x += 0.003;
            illo.rotate.y += 0.003;
            illo.rotate.z += 0.003;
        }
        illo.updateRenderGraph();
    }

    function animate() {
        draw();
        requestAnimationFrame( animate );
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
    document.addEventListener('keyup', keyReleased, false);

    document.addEventListener("DOMContentLoaded", function(event) {
        console.log("DOM fully loaded and parsed");
        start();
    });

}
