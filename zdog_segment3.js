
{

    var canvas = document.getElementById("zdog-canvas");
    var illo = {};
    var segment0 = segment1 = {};
    var slider0 = slider1 = {};
    var top_change = false;

    const PI = Math.PI;
    const DEG_TO_RAD = PI / 180;
    const RAD_TO_DEG = 180 / PI;
    const degToRad = angle => angle * DEG_TO_RAD;

    var canvas2 = document.getElementById('canvas-slider');
    var context2 = canvas2.getContext('2d');
    context2.imageSmoothingEnabled = true;
    canvas2.setAttribute('style', 'position: absolute; left: 100px; top: 200px;');

    function config() {
        illo = new Zdog.Illustration({
            zoom: 2,
            element: canvas,
            dragRotate: true,
        });

        segment0 = new Segment({width: 100, height: 20, color: "red", lineWidth: 2});
        segment0.x = -10;
        segment0.y = -10;
        segment0.draw(illo);

        segment1 = new Segment({width: 100, height: 20, color: "red", lineWidth: 2});
        segment1.draw(illo);

        slider0 = new Slider(-90, 90, 0);
        slider0.x = 100;
        slider0.y = 20;
        slider1 = new Slider(-160, 0, 0);
        slider1.x = 120;
        slider1.y = 20;

        top_change = true;

        slider0.captureMouse(canvas2);
        slider0.onchange = function() {
          top_change = true;
        };
        slider1.captureMouse(canvas2);
        slider1.onchange = function() {
          top_change = true;
        };
    }

    function drawFrame () {
      context2.clearRect(0, 0, canvas2.width, canvas2.height);
      slider0.draw(context2);
      slider1.draw(context2);
    }

    function draw (){
        if (top_change) {
          top_change = false;
          illo.children = [];

          segment0.rotation = degToRad(slider0.value);
          segment1.rotation = segment0.rotation + degToRad(slider1.value);
          segment1.x = segment0.getPin().x;
          segment1.y = segment0.getPin().y;

          segment0.draw(illo);
          segment1.draw(illo);
        }
        drawFrame();
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
          /*
          case LEFT_ARROW:{
              illo.scale.z += 0.3;
              break;
          }
          case RIGHT_ARROW:{
              illo.scale.z -= 0.3;
              break;
          }
          */
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

    document.addEventListener('keydown', keyPressed, false);
    document.addEventListener('keyup', keyReleased, false);

    document.addEventListener("DOMContentLoaded", function(event) {
        console.log("DOM fully loaded and parsed");
        if (canvas == undefined) {
            console.error('DOM target not found for ID zdog-canvas');
        } else {
            context = canvas.getContext('2d');
            config();
            animate();
        }
    });

}
