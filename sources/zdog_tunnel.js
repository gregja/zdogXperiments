// to generate the 3D shape of tunnel, I used the algorithm of Niklas Knaack
// found on this pen :  https://codepen.io/NiklasKnaack/pen/WyWqja

{
    var default_color = "#000000";  // color picker : https://www.w3schools.com/colors/colors_picker.asp
    var stroke_value = 1;

    var colpicker = document.getElementById("colorpicker");
    if (colpicker) {
        colpicker.value = default_color;
        colpicker.addEventListener('change', function(evt) {
            default_color = this.value;
            mainshape.color = default_color;
        }, false);
    } else {
        console.warn('color picker not found');
    }

    var isSpinning = true;

    var illo = new Zdog.Illustration({
        element: '.zdog-canvas',
        dragRotate: true,
        // pause spinning while dragging
        onDragStart: () => isSpinning = false,
        onDragEnd: () => isSpinning = true
    });

    var mainshape = new Zdog.Shape({
        addTo: illo,
        path: tunnel_datas,
        color: default_color,
        closed: false,
        stroke: stroke_value,
        fill: false,
    });

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


    document.addEventListener('keydown', keyPressed, false);
    //document.addEventListener('keyup', keyReleased, false);

    document.addEventListener("DOMContentLoaded", function(event) {
        console.log("DOM fully loaded and parsed");
        animate();
    });

}
