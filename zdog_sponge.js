
{
    var generateShape = shapes3dToolbox.spongeGenerator;
    var illo = undefined; // pointer to the main object (for refreshing)
    var list_levels = ['1', '2', '3'];
    var level_value = list_levels[0];
    var isSpinning = true;

    var levelselector = document.getElementById("levelselector");
    if (levelselector) {
        list_levels.forEach(item => {
            let option = document.createElement('option');
            option.setAttribute('value', item);
            option.innerHTML = item;
            levelselector.append(option);
        });

        levelselector.blur();
        levelselector.addEventListener('change', function(evt) {
          evt.preventDefault();
          this.blur();
          level_value = this.value;
          generateGraph();

        }, false);
    } else {
        console.warn('level selector not found');
    }

    illo = new Zdog.Illustration({
        element: '.zdog-canvas',
        dragRotate: true,
        // pause spinning while dragging
        onDragStart: () => isSpinning = false,
        onDragEnd: () => isSpinning = true
    });

    function generateGraph() {
        illo.children = []; // drop all children before regeneration

        var shape_params = {x:0, y:0, z:0, r:250, level:1, ref:illo, maxLevel: Number(level_value)};
        generateShape(shape_params);
    }

    generateGraph();

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
        e.preventDefault();
        // console.log(e.keyCode);

        // Documentation about keyboard events :
        //    https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
        const DOWN_ARROW = 40;
        const LEFT_ARROW = 37;
        const RIGHT_ARROW = 39;
        const UP_ARROW = 38;
        //const BACKSPACE = 8;
        const ESCAPE = 27;
        //const KEY_ONE = 49;
        //const KEY_TWO = 50;
        //const KEY_THREE = 51;
        //const KEY_FOUR = 52;
        //const KEY_FIVE = 53;

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
        animate();
    });

}
