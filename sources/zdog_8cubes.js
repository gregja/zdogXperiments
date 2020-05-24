// Made with Zdog
// https://codepen.io/gregja/pen/2b14a173072a742e2e259f65bd0c7cc6

let illo = new Zdog.Illustration({
  element: '.zdog-canvas',
  dragRotate: true,
});

var side = 40;
var dist = 50;
var mid_side = side / 2;
var global_dist = dist * 2;
var isSpinning = true;

var boxes = [];
boxes.push({x:-dist, y:-dist, z:-dist});
boxes.push({x:dist, y:dist, z:dist});
boxes.push({x:-dist, y:dist, z:dist});
boxes.push({x:dist, y:-dist, z:dist});
boxes.push({x:dist, y:dist, z:-dist});
boxes.push({x:-dist, y:-dist, z:dist});
boxes.push({x:-dist, y:dist, z:-dist});
boxes.push({x:dist, y:-dist, z:-dist});

const distance = (a, b) => {
  let dx = b.x - a.x;
  let dy = b.y - a.y;
  let dz = b.z - a.z;
  return Math.sqrt(dx*dx + dy*dy + dz*dz);
}

var links = [];
var deja_vu = [];

const search_deja_vu = (idx1, idx2) => {
    var criteria = String(idx1)+'-'+String(idx2);
    var found = deja_vu.find(function(element) {
      return element == criteria;
    });
    if (!found) {
        criteria = String(idx2)+'-'+String(idx1);
        found = deja_vu.find(function(element) {
          return element == criteria;
        });
    }
    return found;
}

// find dynamically the links between the wedges
boxes.forEach((item1, idx1) => {
    boxes.forEach((item2, idx2) => {
        if (idx1 != idx2) {
            if (!search_deja_vu(idx1, idx2)) {
                let xdist = distance(item2, item1);
                if (xdist == global_dist) {
                    links.push({a:idx1, b:idx2});
                    deja_vu.push(String(idx1)+'-'+String(idx2));
                    deja_vu.push(String(idx2)+'-'+String(idx1));
                }
            }
        }
    });
});

links.forEach(item => {
    let a = boxes[item.a];
    let b = boxes[item.b];

    new Zdog.Shape({
        addTo: illo,
        path: [
            { x: a.x, y: a.y, z:a.z },  // start
            { x: b.x, y: b.y, z:b.z }   // end
        ],
        closed: false,
        stroke: 10,
        color: '#636'
    });

});

boxes.forEach(item => {
    new Zdog.Box({
        addTo: illo,
        width: side,
        height: side,
        depth: side,
        translate: item,
        stroke: false,
        color: '#C25', // default face color
        leftFace: '#EA0',
        rightFace: '#E62',
        topFace: '#ED0',
        bottomFace: '#636',
    });
})

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
