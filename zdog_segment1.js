
{

    var isSpinning = false;

    var canvas = document.getElementById("zdog-canvas");
    var ctx = {};
    var illo = {};


    function config() {
        illo = new Zdog.Illustration({
            element: canvas,
            dragRotate: true,
            // pause spinning while dragging
            //  onDragStart: () => isSpinning = false,
            //  onDragEnd: () => isSpinning = true
        });

        var segment0 = new Segment({width: 100, height: 20, color: "red", engine: "zdog", lineWidth: 2});
        segment0.x = 100;
        segment0.y = 50;
        segment0.draw(illo);

        var segment1 = new Segment({width: 200, height: 10, color: "blue", context: illo});
        segment1.x = 100;
        segment1.y = 80;
        segment1.draw();

        var segment2 = new Segment({width: 80, height: 40, color: "yellow", context: illo, diameter: 5});
        segment2.x = 100;
        segment2.y = 120;
        segment2.draw();
    }

    function drawFixSegments() {
        var engine = "canvas";

        var segment0 = new Segment({width: 100, height: 20, color: "red", engine: engine, context:context, lineWidth: 2});
        segment0.x = 100;
        segment0.y = 50;
        segment0.draw();

        var segment1 = new Segment({width: 200, height: 10, color: "blue", engine: engine});
        segment1.x = 100;
        segment1.y = 80;
        segment1.draw(context);

        var segment2 = new Segment({width: 80, height: 40, color: "yellow", engine: engine, context:context, diameter: 5});
        segment2.x = 100;
        segment2.y = 120;
        segment2.draw();
    }

    function draw (){
        if (isSpinning) {
            illo.rotate.z += 0.003;
        }
        illo.updateRenderGraph();
    }

    function animate() {
        draw();
        drawFixSegments();
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
