
{

    var canvas = document.getElementById("zdog-canvas");
    var illo = {};
    var segment = [];
    var slider = {};
    var top_change = false;
    var cycle = 0;

    const {
        cos, sin, PI, tan, sqrt, abs, pow
    } = Math;
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

        var colors = [];
        colors.push(["blue", "red", "green", "silver"]);
        colors.push(["red", "red", "green", "green"]);
        colors.push(["green", "silver", "green", "silver"]);
        colors.push(["green", "green", "green", "green"]);
        var color = 0;

        var thickness = 10;
        segment[0] = new Segment({width: 100, height: 30, color: colors[color][0], lineWidth: thickness});
        segment[1] = new Segment({width: 100, height: 20, color: colors[color][1], lineWidth: thickness});
        segment[2] = new Segment({width: 100, height: 30, color: colors[color][2], lineWidth: thickness, offset:1.1});
        segment[3] = new Segment({width: 100, height: 20, color: colors[color][3], lineWidth: thickness, offset:1.1});

        slider.speed = new Slider(0, 0.2, 0.08);
        slider.thighRange = new Slider(0, 90, 45);
        slider.thighBase = new Slider(0, 180, 90);
        slider.calfRange = new Slider(0, 90, 45);
        slider.calfOffset = new Slider(-3.14, 3.14, -1.57);
        slider.thickness = new Slider(1, 20, thickness);
        slider.colors = new Slider(1, 4, 1);


        segment[0].x = -10;
        segment[0].y = -10;

        segment[1].x = segment[0].getPin().x;
        segment[1].y = segment[0].getPin().y;

        segment[2].x = -10;
        segment[2].y = -10;

        segment[3].x = segment[2].getPin().x;
        segment[3].y = segment[2].getPin().y;

        slider.speed.x = 10;
        slider.speed.y = 10;
        slider.speed.captureMouse(canvas2);
        slider.speed.onchange = function() {
          top_change = true;
        };

        slider.thighRange.x = 30;
        slider.thighRange.y = 10;
        slider.thighRange.captureMouse(canvas2);
        slider.thighRange.onchange = function() {
          top_change = true;
        };

        slider.thighBase.x = 50;
        slider.thighBase.y = 10;
        slider.thighBase.captureMouse(canvas2);
        slider.thighBase.onchange = function() {
          top_change = true;
        };

        slider.calfRange.x = 70;
        slider.calfRange.y = 10;
        slider.calfRange.captureMouse(canvas2);
        slider.calfRange.onchange = function() {
          top_change = true;
        };

        slider.calfOffset.x = 90;
        slider.calfOffset.y = 10;
        slider.calfOffset.captureMouse(canvas2);
        slider.calfOffset.onchange = function() {
          top_change = true;
        };

        slider.thickness.x = 110;
        slider.thickness.y = 10;
        slider.thickness.captureMouse(canvas2);
        slider.thickness.onchange = function() {
          top_change = true;
          let value = Math.round(slider.thickness.value)
          segment[0].lineWidth = value;
          segment[1].lineWidth = value;
          segment[2].lineWidth = value;
          segment[3].lineWidth = value;
        };

        slider.colors.x = 130;
        slider.colors.y = 10;
        slider.colors.captureMouse(canvas2);
        slider.colors.onchange = function() {
          top_change = true;
          let choice = Math.round(slider.colors.value) - 1;
          segment[0].color = colors[choice][0];
          segment[1].color = colors[choice][1];
          segment[2].color = colors[choice][2];
          segment[3].color = colors[choice][3];
        };

        top_change = true;
    }

    function drawFrame () {
      context2.clearRect(0, 0, canvas2.width, canvas2.height);
      slider.speed.draw(context2);
      slider.thighRange.draw(context2);
      slider.thighBase.draw(context2);
      slider.calfRange.draw(context2);
      slider.calfOffset.draw(context2);
      slider.thickness.draw(context2);
      slider.colors.draw(context2);
    }

    function walk (segA, segB, cyc) {
      var angle0 = degToRad(sin(cyc) * slider.thighRange.value + slider.thighBase.value);
      var angle1 = degToRad(sin(cyc + slider.calfOffset.value) * slider.calfRange.value + slider.calfRange.value);

      segA.rotation = angle0;
      segB.rotation = segA.rotation + angle1;
      segB.x = segA.getPin().x;
      segB.y = segA.getPin().y;
    }

    function draw (){
      //if (top_change) {
        top_change = false;
        illo.children = [];

        cycle += slider.speed.value;
        walk(segment[0], segment[1], cycle);
        walk(segment[2], segment[3], cycle + PI);
        segment[0].draw(illo);
        segment[1].draw(illo);
        segment[2].draw(illo);
        segment[3].draw(illo);
      //}
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


    document.addEventListener('keydown', keyPressed, false);
    //document.addEventListener('keyup', keyReleased, false);

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
