/*
   Example of a complex 3D object, Roboto ;)
   largely inspired by : https://codepen.io/hankuro/pen/LrbVrx
*/
{
    "use strict";

    var boxmesh = shapes3dToolbox.generateCuboid1;
    var shapes = [];
    var isSpinning = false;
    var isMoving = true;
    var scale_def = 10;
    var stroke_value = 1;
    var roboto;
    var cycle = 0 , angle = 0;
    var character = {};
    var spin_modes = ['Walking', 'Spinning', 'Static'];
    var spin_mode_default = spin_modes[2];

    const {
        cos, sin, PI
    } = Math;

    const TAU = Zdog.TAU;
    const DEG_TO_RAD = PI / 180;
    const RAD_TO_DEG = 180 / PI;

    const degToRad = angle => angle * DEG_TO_RAD;

    // draw filled shape
    function genShape(ref, shape_params) {
        let xTrans = shape_params.xTrans || 0;
        let yTrans = shape_params.yTrans || 0;
        let zTrans = shape_params.zTrans || 0;

        let obj3d = boxmesh(shape_params);
        let colors = chroma.scale(['#9cdf7c','#2A4858']).mode('lch').colors(obj3d.polygons.length);

        let shapes = [];

        obj3d.polygons.forEach((vertices, idx) => {
            let points = [];
            vertices.forEach((item, idx) => {
                points.push({point:obj3d.points[vertices[idx]]});
            })

            let shape = [];

            points.forEach(item => {
                shape.push({x:item.point.x, y:item.point.y, z:item.point.z});
            })

            shapes.push(new Zdog.Shape({
                addTo: ref,
                path: shape,
                color: colors[idx],
                closed: false,
                stroke: stroke_value,
                fill: true,
                translate: {x:xTrans, y:yTrans, z:zTrans}
            }));
        });
        return shapes;
    }

    function genRoboto(){

      const TAU = Zdog.TAU;

      const PI = Math.PI;
      const conv_formula = 180 * PI;

    	function degtorad(degres) {
    	  return degres / conv_formula;
    	}

    	roboto = new Zdog.Illustration({
    		element: '#zdog-canvas',
    		dragRotate: true,
      	zoom: 1.5,
        scale:{x: scale_def, y:-scale_def, z:scale_def},
        translate:{x:0, y:-30, z:0}
    	});

      character.head = new Zdog.Anchor({
          addTo: roboto,
          scale: scale_def,
          translate:{x:0, y:8.5, z:0}
          // rotate: { z: -Zdog.TAU/8 },
      });

      new Zdog.Shape({
        addTo: character.head,
        path: [
          { x: -.2, y:0, z:.24 }, // start at 1st point
          { x: .2, y:0, z:.24 }, // line to 2nd point
        ],
        stroke: 2,
        color: 'red',
      });

      var boxs = {};

      boxs.head = genShape(character.head, {xScale:0.2, yScale:0.25, zScale:0.22});

      character.body = new Zdog.Anchor({
          addTo: roboto,
          scale: scale_def,
          translate:{x:0, y:-0.3, z:0}
          // rotate: { z: -Zdog.TAU/8 },
      });

    	boxs.body = genShape(character.body, {xScale:0.4, yScale:0.6, zScale:0.3});

      //--- Left Leg

      character.leftLeg = new Zdog.Anchor({
          addTo: character.body,
          translate:{x:0.2, y:-0.99, z:0},
          // rotate: { z: -Zdog.TAU/8 },
      });

      character.leftLegUp = new Zdog.Anchor({
          addTo: character.leftLeg,
          // rotate: { z: -Zdog.TAU/8 },
      });

      boxs.leftUpperLeg = genShape(character.leftLegUp, {xScale:0.2,yScale:0.4,zScale:0.2});

      character.leftLegLow = new Zdog.Anchor({
          addTo: character.leftLeg,
          translate:{x:0, y:-0.83, z:0},
          // rotate: { z: -Zdog.TAU/8 },
      });

      boxs.leftLowerLeg = genShape(character.leftLegLow, {xScale:0.2,yScale:0.4,zScale:0.2});


      //--- Right Leg

      character.rightLeg = new Zdog.Anchor({
          addTo: character.body,
          translate:{x:-0.2, y:-0.99, z:0},
          // rotate: { z: -Zdog.TAU/8 },
      });

      character.rightLegUp = new Zdog.Anchor({
          addTo: character.rightLeg,
          // rotate: { z: -Zdog.TAU/8 },
      });

      boxs.rightUpperLeg = genShape(character.rightLegUp, {xScale:0.2,yScale:0.4,zScale:0.2});

      character.rightLegLow = new Zdog.Anchor({
          addTo: character.rightLeg,
          translate:{x:0, y:-0.83, z:0},
          // rotate: { z: -Zdog.TAU/8 },
      });

      boxs.rightLowerLeg = genShape(character.rightLegLow, {xScale:0.2,yScale:0.4,zScale:0.2});

      //---- Left arm

      character.leftArm = new Zdog.Anchor({
          addTo: character.body,
          translate:{x:0.6, y:0.2, z:0},
          // rotate: { z: -Zdog.TAU/8 },
      });

      character.leftArmUp = new Zdog.Anchor({
          addTo: character.leftArm,
          // rotate: { z: -Zdog.TAU/8 },
      });

      boxs.leftUpperArm = genShape(character.leftArmUp, {xScale:0.16,yScale:0.4,zScale:0.16});

      character.leftArmLow = new Zdog.Anchor({
          addTo: character.leftArm,
          translate:{x:0, y:-0.83, z:0},
          // rotate: { z: -Zdog.TAU/8 },
      });

      boxs.leftLowerArm = genShape(character.leftArmLow, {xScale:0.16,yScale:0.4,zScale:0.16});

      //------ Right arm

      character.rightArm = new Zdog.Anchor({
          addTo: character.body,
          translate:{x:-0.6, y:0.2, z:0},
          // rotate: { z: -Zdog.TAU/8 },
      });

      character.rightArmUp = new Zdog.Anchor({
          addTo: character.rightArm,
          // rotate: { z: -Zdog.TAU/8 },
      });

      boxs.rightUpperArm = genShape(character.rightArmUp, {xScale:0.16,yScale:0.4,zScale:0.16});

      character.rightArmLow = new Zdog.Anchor({
          addTo: character.rightArm,
          translate:{x:0, y:-0.83, z:0},
          // rotate: { z: -Zdog.TAU/8 },
      });

      boxs.rightLowerArm = genShape(character.rightArmLow, {xScale:0.16,yScale:0.4,zScale:0.16});

    }

    function draw (){
        if (isSpinning && !isMoving) {
            roboto.rotate.z += 0.003;
        }
        if (isMoving) {
            //--- angles for legs
            let angle0l = degToRad(sin(cycle) * 30);
            let angle1l = degToRad(sin(cycle) * -21) ;
            let angle2l = degToRad(sin(cycle + PI) * 30);
            let angle3l = degToRad(sin(cycle + PI) * -21) ;

            character.leftLeg.rotate.x = angle0l;
            character.rightLeg.rotate.x = angle2l;
            character.leftLegLow.rotate.x = angle1l;
            character.rightLegLow.rotate.x = angle3l;

            //--- angles for arms
            let angle0a = degToRad(sin(cycle) * 10);
            let angle1a = degToRad(sin(cycle) * 21) ;
            let angle2a = degToRad(sin(cycle + PI) * 10);
            let angle3a = degToRad(sin(cycle + PI) * 21) ;

            character.leftArm.rotate.x = angle2a;
            character.rightArm.rotate.x = angle0a;
            character.leftArmLow.rotate.x = angle3a;
            character.rightArmLow.rotate.x = angle1a;

            roboto.rotate.y -= 0.004;
            let x = cos(angle) * 20;
            let z = sin(angle) * 20;
            roboto.translate.x = x;
            roboto.translate.z = z;

            cycle += 0.05;
            angle += 0.004;
          }

          roboto.updateRenderGraph();
      }

      function animate() {
          draw();
          requestAnimationFrame( animate );
      }

      function resetScale() {
          roboto.scale.x = scale_def;
          roboto.scale.y = scale_def;
          roboto.scale.z = scale_def;
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
                  roboto.scale.z += 0.3;
                  break;
              }
              case RIGHT_ARROW:{
                  roboto.scale.z -= 0.3;
                  break;
              }
              case UP_ARROW:{
                  roboto.scale.x += 0.3;
                  roboto.scale.y += 0.3;
                  roboto.scale.z += 0.3;
                  break;
              }
              case DOWN_ARROW:{
                  roboto.scale.x -= 0.3;
                  roboto.scale.y -= 0.3;
                  roboto.scale.z -= 0.3;
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
/*
      var spin_mode_btn = document.getElementById('spinning');
      if (spin_mode_btn) {
          spin_mode_btn.innerHTML = spin_modes[1];
          spin_mode_btn.addEventListener('click', function(evt) {
              let other_mode;
              if (spin_mode_default == spin_modes[0]) {
                  spin_mode_default = spin_modes[1];
                  other_mode = spin_modes[0];
                  isSpinning = false;
              } else {
                  if (spin_mode_default == spin_modes[1]) {

                  } else {
                    spin_mode_default = spin_modes[0];
                    other_mode = spin_modes[1];
                    isSpinning = true;
                  }
              }
              spin_mode_btn.innerHTML = other_mode;
              generateGraph();
          }, false);
      } else {
          console.warn('spin mode button not found');
      }
*/
    document.addEventListener("DOMContentLoaded", function(event) {
        console.log("DOM fully loaded and parsed");
        genRoboto();
        animate();

    });

}

/*
    code for drawing axes X, Y and Z temporarily

      new Zdog.Shape({
        addTo: head,
        path: [
          { x: -40 }, // start at 1st point
          { x:  40 }, // line to 2nd point
        ],
        stroke: 1,
        color: '#636',
      });

      new Zdog.Shape({
        addTo: head,
        path: [
          { y: -40 }, // start at 1st point
          { y:  40 }, // line to 2nd point
        ],
        stroke: 1,
        color: '#636',
      });

      new Zdog.Shape({
        addTo: head,
        path: [
          { z: -40 }, // start at 1st point
          { z:  40 }, // line to 2nd point
        ],
        stroke: 1,
        color: '#636',
      });
*/



/*
      var boxs = [];
    	boxs.push(new myBox(0.2, 0.25, 0.22,PartMatrix[0]));
    	boxs.push(new myBox(0.5, 0.6, 0.3,PartMatrix[1]));
    	boxs.push(new LegArm(0.2, 0.4,0.2,new vertex(-0.14, 0.05, 0),true));
    	boxs.push(new LegArm(0.2, 0.4,0.2,new vertex(0.14,  0.05, 0.0),false));
    	boxs.push(new LegArm(0.16, 0.4,0.16,new vertex(0.36, 0.6, 0.0),true));
    	boxs.push(new LegArm(0.16, 0.4,0.16,new vertex(-0.36, 0.6, 0.0),false));
*/

/*
var Head = myBoxMesh(0.2,0.25,0.22);
Roboto.add(Head);

var Body = myBoxMesh(0.4,0.6,0.3);
Body.position.set(0,-0.3,0);
Roboto.add(Body);

var LeftLeg = new THREE.Group();
LeftLeg.position.set(0.1,-0.92,0);
Roboto.add(LeftLeg);
var LeftUpperLeg = myBoxMesh(0.2,0.4,0.2);
var LeftLowerLeg = myBoxMesh(0.2,0.4,0.2);
LeftLeg.add(LeftUpperLeg);
LeftLeg.add(LeftLowerLeg);
LeftLowerLeg.position.set(0,-0.43,0);

var RightLeg = new THREE.Group();
RightLeg.position.set(-0.11,-0.92,0);
Roboto.add(RightLeg);
var RightUpperLeg = myBoxMesh(0.2,0.4,0.2);
var RightLowerLeg = myBoxMesh(0.2,0.4,0.2);
RightLeg.add(RightUpperLeg);
RightLeg.add(RightLowerLeg);
RightLowerLeg.position.set(0,-0.43,0);

var LeftArm = new THREE.Group();
LeftArm.position.set(0.3,-0.3,0);
Roboto.add(LeftArm);
var LeftUpperArm = myBoxMesh(0.16,0.4,0.16);
var LeftLowerArm = myBoxMesh(0.16,0.4,0.16);
LeftArm.add(LeftUpperArm);
LeftArm.add(LeftLowerArm);
LeftLowerArm.position.set(0,-0.43,0);

var RightArm = new THREE.Group();
RightArm.position.set(-0.31,-0.3,0);
Roboto.add(RightArm);
var RightUpperArm = myBoxMesh(0.16,0.4,0.16);
var RightLowerArm = myBoxMesh(0.16,0.4,0.16);
RightArm.add(RightUpperArm);
RightArm.add(RightLowerArm);
RightLowerArm.position.set(0,-0.43,0);

//var clock = new THREE.Clock();
var cycle = 0 , angle = 0;
function render() {
  controls.update();
  var angle0 = Math.sin(cycle) * 30 * Math.PI / 180;
  var angle1 = Math.sin(cycle) * 31 * Math.PI / 180 ;
  var angle2 = Math.sin(cycle + Math.PI) * 30 * Math.PI / 180 ;
  var angle3 = Math.sin(cycle + Math.PI) * 31 * Math.PI / 180 ;

  LeftLeg.rotation.x = angle0;
  RightLeg.rotation.x = angle2;
  LeftLowerLeg.rotation.x = angle1;
  RightLowerLeg.rotation.x = angle3;
  LeftLeg.rotation.x = angle0;

  LeftArm.rotation.x = angle2;
  RightArm.rotation.x = angle0;
  LeftLowerArm.rotation.x = angle3;
  RightLowerArm.rotation.x = angle1;

  Roboto.rotation.y -= 0.004;
  var x = Math.cos(angle) * 20;
  var z = Math.sin(angle) * 20;
  Roboto.position.x = x;
  Roboto.position.z = z;

  renderer.render( scene, camera );
  cycle += 0.05;
  angle += 0.004;
}


*/
