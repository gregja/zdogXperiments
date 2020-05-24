
{
    var generateShape = shapes3dToolbox.flakeGenerator;
    var illo = undefined; // pointer to the main object (for refreshing)
    var list_levels = ['1', '2', '3', '4'];
    var level_value = list_levels[0];
    var spin_modes = ['Spinning', 'Static'];
    var spin_mode_default = spin_modes[0];
    var isSpinning = true;
    var tasks = [];

    let blocks_array = [];
    let block_current = -999;
    let block_maximum = -999;

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
        //onDragStart: () => isSpinning = false,
        //onDragEnd: () => isSpinning = true
    });

    let shapemaster = function (block, num_task) {
        if (num_task !== false) {
            tasks[num_task] = false;  // flag to know that the task is ended
        }
        new Zdog.Box({
            addTo: illo,
            width: block.side,
            height: block.side,
            depth: block.side,
            translate: {x: block.x, y: block.y, z: block.z},
            stroke: block.stroke,
            color: block.color, // default face color
            leftFace: block.leftFace,
            rightFace: block.rightFace,
            topFace: block.topFace,
            bottomFace: block.bottomFace,
        });
    };

    function generateGraph() {
        illo.children = []; // drop all children before regeneration

        let maxLevel = Number(level_value);
        if (maxLevel > 2) {
            if (isSpinning) {
                spin_mode_btn.click();
            }
        }
        var shape_params = {x:0, y:0, z:0, r:250, level:1, maxLevel: maxLevel};
        var blocks = generateShape(shape_params);
        let imax = blocks.length;
        console.log('Number of blocks to generate : '+imax);

        if (tasks.length > 0) {
            // stop remanining tasks before initializing a new series of tasks
            tasks.forEach(task => {
                if (task != false) {
                    clearTimeout(task);
                }
            });
            tasks = [];
        }

        blocks_array = [];
        block_current = -999;
        block_maximum = -999;

        if (maxLevel < 3) {
            let timer = 1;
            if (maxLevel == 2) {
                timer = 100;
            }
            for (let i = 0; i < imax; i++) {
                let block = blocks[i];
                tasks[i] = setTimeout(() => {
                    shapemaster(block, i);
                }, timer);
            }
        } else {
            block_current = -1;
            for (let i = 0; i < imax; i++) {
                blocks_array[i] = blocks[i];
            }
            block_maximum = imax;
        }
    }

    generateGraph();

    function draw (){
        if (isSpinning) {
            illo.rotate.z += 0.003;
        }
        illo.updateRenderGraph();
    }

    function animate() {

        if (block_current != -999) {
            block_current++;
            if (block_current < block_maximum) {
                let block = blocks_array[block_current];
                shapemaster(block, false);
            }
        }

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
        }, false);
    } else {
        console.warn('spin mode button not found');
    }

    document.addEventListener('keydown', keyPressed, false);
    document.addEventListener('keyup', keyReleased, false);

    document.addEventListener("DOMContentLoaded", function(event) {
        console.log("DOM fully loaded and parsed");
        animate();
    });

}
