/**
 * Largely inspired by this pen of Hankuro :
 *   https://codepen.io/hankuro/pen/QMVLJZ
 * Temporary version with only the "points mode"
 * TODO : to finalize with the "paint mode"
 */
{
  "use strict";

    var shape_params = {};

    // sources of the meshes :
    const list_shapes = [
      {name:"wolf", path:"/assets/wolf.json"},
      {name:"elk", path:"/assets/elk.json"},
    ];

    var default_color = "#000000";  // color picker : https://www.w3schools.com/colors/colors_picker.asp
    var stroke_value = 1;
    var scale_init = 5;
    var illo = undefined; // pointer to the main object (for refreshing)
    var mainshape = undefined;  // pointer to the wireframe shape (when it's activated)
    const draw_modes = ['Points', 'Wireframe', 'Faces'];
    var draw_mode_current = 0;
    var zoom_factor = 0.03;
    const DEG_TO_RAD = Math.PI / 180;
    var current_morphing = 0;
    var max_morphing = -1;
    var is_moving = true;

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
    function genShape1() {
        console.log('Wireframe mode');
        var obj3d = shape_params;
        var datas = [];

        obj3d.polygons.forEach(vertices => {
            let points = [];

            vertices.forEach(item => {
                if (obj3d.points[item]) {
                  points.push({point:obj3d.points[item]});
                }
            })

            points.forEach((item, idx) => {
                if (item.point != undefined && item.point.x != undefined) {
                    datas.push({x: item.point.x, y:item.point.y, z:item.point.z});
                }
            })
        });
        return datas;
    }

    function genShape2(ref, gradient_color=1) {
        console.log('Paint mode');

        var obj3d = shape_params;

        if (shape_params.hasOwnProperty('gradient_color')) {
            gradient_color = Number(shape_params.gradient_color);
            if (gradient_color != 1 && gradient_color != 2) {
                console.warn('gradient color mode is bad, taken 1 by default');
                gradient_color = 1;
            }
        }

        const reducer = (accumulator, currentValue) => accumulator + currentValue.length;
        let nb_colors = obj3d.polygons.reduce(reducer, 0);
        console.log("nb_colors => ", nb_colors);
        var colors = [];
        if (gradient_color == 1) {
            // each polygon has a unique color
            colors = chroma.scale(['#9cdf7c','#2A4858']).mode('lch').colors(nb_colors)
        } else {
            // generate a first set of unique colors (from darkest to brightest) for the first half
            // of the polygons, then reverse that color series for the second half of the polygons
            // (interesting mode for cylinders and cones)

            if (nb_colors % 2 == 0) {
                // we wish an odd number
                nb_colors += 1;
            }
            let tmp_colors = chroma.scale(['#9cdf7c', '#2A4858']).mode('lch').colors(Math.round(nb_colors / 2));
            for (let i=tmp_colors.length-1; i>=0; i--) {
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
                    shape.push({x:point.x, y:point.y, z:point.z});
                }
            });
            if (shape.length > 0) {
                new Zdog.Shape({
                    addTo: ref,
                    path: shape,
                    color: colors[idx]|| default_color,
                    closed: false,
                    stroke: stroke_value,
                    fill: true,
                //      scale: scale_init*10,
                });
                idx++;
            }
        });

    }

    // filled shape (points)
    function genShape3(ref, movie_index=-1) {
        console.log("Points mode");
        var obj3d = {};
        if (movie_index != -1) {
          let points = shape_params.morphings[movie_index];
//          let morphings = datas.morphTargets.map(item => makeVertices(item.vertices));
//          max_morphing = morphings.length;
          //let vertices = makeVertices(datas.morphTargets[0].vertices);
//          let polygons = makeFaces(datas.faces);

          shape_params.points = points;
        }
        obj3d = shape_params;

        obj3d.polygons.forEach(vertices => {

            let shape = [];
            vertices.forEach(item => {
                if (item != undefined && obj3d.points[item] != undefined) {
                  let point = obj3d.points[item];
                    shape.push({x:point.x, y:point.y, z:point.z});
                }
            });

            shape.forEach(item => {
              new Zdog.Shape({
                  addTo: ref,
                  color: default_color,
                  stroke: 4,
                  scale: scale_init*10,
                  translate: {x:item.x, y:item.y, z:item.z},
                  fill: true,
              });
            })
        });
    }

    var isSpinning = true;

    illo = new Zdog.Illustration({
        element: '.zdog-canvas',
        dragRotate: true,
        scale: scale_init,
        // pause spinning while dragging
        onDragStart: () => isSpinning = false,
        onDragEnd: () => isSpinning = true
    });
    illo.rotate.z = 180 * DEG_TO_RAD;
    illo.translate.y = 200;

    function generateGraph() {
        illo.children = []; // drop all children before regeneration

        if (draw_mode_current == 1 ) {
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
            if (draw_mode_current == 2 ) {
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

    function draw (){
/*
        if (isSpinning) {
            illo.rotate.y += 0.03;
        }
  */

        if (!is_moving) {
          current_morphing = -1;
          illo.updateRenderGraph();
        } else {
          if (current_morphing == -1) {
            current_morphing = 0;
          }
          illo.children = []; // drop all children before regeneration
          genShape3(illo, current_morphing);
          illo.updateRenderGraph();

          current_morphing++;

          if (current_morphing >= max_morphing ) {
            current_morphing = 0;
          }
        }

    }

    function animate() {
        draw();
        requestAnimationFrame( animate );
    }

    function resetScale() {
        illo.scale.x = scale_init;
        illo.scale.y = scale_init;
        illo.scale.z = scale_init;
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
              illo.scale.z += zoom_factor;
              break;
          }
          case RIGHT_ARROW:{
              illo.scale.z -= zoom_factor;
              break;
          }
          case UP_ARROW:{
              illo.scale.x += zoom_factor;
              illo.scale.y += zoom_factor;
              illo.scale.z += zoom_factor;
              break;
          }
          case DOWN_ARROW:{
              illo.scale.x -= zoom_factor;
              illo.scale.y -= zoom_factor;
              illo.scale.z -= zoom_factor;
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

    function keyReleased (e) {
        e.preventDefault();
        // TODO : find something to implement here ;)
    }

    function prepareEnvironment() {
        var draw_mode_btn = document.getElementById('drawmode');
        if (draw_mode_btn) {
            draw_mode_btn.innerHTML = draw_modes[draw_mode_current+1];
            draw_mode_btn.addEventListener('click', function(evt) {
                draw_mode_current++;
                if (draw_mode_current > draw_modes.length - 1) {
                  draw_mode_current = 0;
                }
                let other_mode = draw_modes[draw_mode_current+1] || draw_modes[0];
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

        var objselector = document.getElementById("objselector");
        if (objselector) {
            objselector.setAttribute("value", "p0");
            list_shapes.forEach((item, idx) => {
                console.log(item)
                let option = document.createElement('option');
                option.setAttribute('value', 'p' + String(idx));
                option.innerHTML = item.name;
                objselector.append(option);
                if (idx == 0) {
                    option.setAttribute("selected", "selected");
                }
            });
            objselector.blur();
            objselector.addEventListener('change', function(evt) {
                evt.preventDefault();
                this.blur();
                let current_id = Number(String(this.value).replace('p', ''));
                let json_path = list_shapes[current_id].path;
                loadOBJ(json_path, 1, ()=>{
                  generateGraph();
                });

            }, false);
        } else {
            console.warn('obj selector not found');
        }

        var zoom1_btn = document.getElementById('zoom1');
        if (zoom1_btn) {
          zoom1_btn.addEventListener('click', function(e){
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
          zoom2_btn.addEventListener('click', function(e){
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
        document.addEventListener('keyup', keyReleased, false);
    }
/*
      function rotateVertex(angle, v){
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        let x = cos * v.x  - sin * v.z;
        let y = v.y;
        let z =  cos * v.z  + sin * v.x;
        v.x = x;
        v.y = y;
        v.z = z;
      }
*/

      function makeVertices(vertices){
        let _vertices = [];
        let size = vertices.length;
        let offset = 0;
        while (offset < size){
            let vertice = {};
            vertice['x'] = vertices[offset++];
            vertice['y'] = vertices[offset++];
            vertice['z'] = vertices[offset++];
            _vertices.push(vertice);
        }
        return _vertices;
      }

      function makeFaces(faces){
          let _faces = [];
          let size = faces.length;
        	let offset = 0;
          while (offset < size){
              let face = [];
              face[0] = faces[offset++];
              face[1] = faces[offset++];
              face[2] = faces[offset++];

              offset++;
            //  console.log('xxx1')
              for (var i = 0; i < 3; i++) offset++;

            //    console.log('xxx4')
              offset++;

              _faces.push(face);
          }
          return _faces;
      }

    function loadOBJ(url, scale = 1, onload) {
        fetch(url).then(response => response.text()).then(function(content) {
          const datas = JSON.parse(content);
          console.log(datas.vertices.length);
          console.log(datas.faces.length);

          let points = makeVertices(datas.vertices);
          let morphings = datas.morphTargets.map(item => makeVertices(item.vertices));
          max_morphing = morphings.length;
          //let vertices = makeVertices(datas.morphTargets[0].vertices);
          let polygons = makeFaces(datas.faces);

          shape_params = {points: points, polygons: polygons, morphings:morphings};
            console.log(shape_params);
          onload();
      }).catch(err => {
        console.error(err);
      });
    }

    document.addEventListener("DOMContentLoaded", function(event) {
        console.log("DOM fully loaded and parsed");

        let json_path = list_shapes[0].path;
        loadOBJ(json_path, 1, ()=>{
          generateGraph();
          prepareEnvironment();
          animate();
        });
    });

}
