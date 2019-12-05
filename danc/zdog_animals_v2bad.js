
{
  "use strict";

    var shape_params = {};

    const list_shapes = [
      {name:"wolf", path:"/assets/wolf2.json"},
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
                    //let nb_colors = obj3d.polygons.length;
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
        obj3d.polygons.forEach(items => {
            let shape = [];
            items.forEach(item => {
                if (obj3d.points[item] && obj3d.points[item] != undefined) {
                  shape.push(obj3d.points[item]);
                  idx++;
                } else {
                  console.warn('not found');
                }
            })
            //console.log(shape);
            if (shape.length > 1) {
                new Zdog.Shape({
                    addTo: ref,
                    path: shape,
                    color: colors[idx] || default_color,
                    closed: false,
                    stroke: stroke_value,
                    fill: true,
              //      scale: scale_init*10,
                });
            } else {
              console.warn('shape.length => ', shape.length)
            }
        });

    }

    // filled shape (points)
    function genShape3(ref) {
        console.log("Points mode");
        var obj3d = shape_params;

        obj3d.polygons.forEach((vertices, idx) => {
            let points = [];
            vertices.forEach((item, idx) => {
                if (item != undefined && obj3d.points[vertices[idx]] != undefined) {
                    points.push({point:obj3d.points[vertices[idx]]});
                }
            })

            let shape = [];

            points.forEach((item, idx) => {
                if (item.point != undefined && item.point.x != undefined) {
                    shape.push({x:item.point.x, y:item.point.y, z:item.point.z});
                }
            })

            shape.forEach((item, idx) => {
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
        illo.updateRenderGraph();
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

    /**
      * Split an array in blocks of arrays
      * @param arr
      * @param len
      * @returns {*[]}
      */
      function chunk (arr, len) {
          var chunks = [],
          i = 0,
          n = arr.length;
          while (i < n) {
              chunks.push(arr.slice(i, i += len));
          }
          return chunks;
      }

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


    function loadOBJ(url, scale = 1, onload) {
        fetch(url).then(response => response.text()).then(function(content) {
          const datas = JSON.parse(content);
          console.log(datas.vertices.length);
          console.log(datas.faces.length);
/*
          let tmpvertices = chunk(datas.vertices, 3);
          let vertices = [];
          let corresp = {};
          tmpvertices.forEach(item => {
            if (item.length == 3) {
              vertices.push({x: item[0], y:item[1], z:item[2]})
            }
          });
*/
          //let faces = chunk(datas.faces, 3);


/*
          let offset = 0;
          let faces = [];
          datas.faces.forEach(item => {
            if (vertices[item]) {
              faces.push(item);
            }
          });
*/
          let vertices = [];
          let polygons = [];
          let faces_length = datas.faces.length;
          let offset = 0;
          while (offset < faces_length) {
            let poly = [];
            let point = []

            point[0] = datas.vertices[datas.faces[offset]];
            offset++;
            point[1] = datas.vertices[datas.faces[offset]];
            offset++;
            point[2] = datas.vertices[datas.faces[offset]];
            offset++;

            vertices.push({x: point[0], y:point[1], z:point[2]});
            poly.push(vertices.length-1);

            point = [];

            point[0] = datas.vertices[datas.faces[offset]];
            offset++;
            point[1] = datas.vertices[datas.faces[offset]];
            offset++;
            point[2] = datas.vertices[datas.faces[offset]];
            offset++;

            vertices.push({x: point[0], y:point[1], z:point[2]});
            poly.push(vertices.length-1);

            point = [];

            point[0] = datas.vertices[datas.faces[offset]];
            offset++;
            point[1] = datas.vertices[datas.faces[offset]];
            offset++;
            point[2] = datas.vertices[datas.faces[offset]];
            offset++;

            vertices.push({x: point[0], y:point[1], z:point[2]});
            poly.push(vertices.length-1);

            polygons.push(poly);
          }

          shape_params = {points: vertices, polygons: polygons};
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
