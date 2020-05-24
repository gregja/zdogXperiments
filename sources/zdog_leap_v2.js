// link to the official gallery :
// https://developer-archive.leapmotion.com/gallery/tags/javascript

// link to install a leap motion on Linux Fedora :
// https://github.com/bugzy/leap-fedora-rpm

// a good tutorial on the Leap Motion (in french):
// https://slides.jmpp.io/leapjs/#/

// Link to the official documentation
// https://developer-archive.leapmotion.com/documentation/javascript/api/Leap.InteractionBox.html?proglang=javascript

{
    "use strict";

    let canvas = document.getElementById('zdog-canvas');

    const width = canvas.width;
    const height = canvas.height;

    let illo = new Zdog.Illustration({
        element: canvas,
        dragRotate: true,
        //   translate:{x:-width/2, y:-height/2},  // not apply translation here, because we need to know the version of the leap controller
    });

    const size_palm = 30;
    const size_finger = 20;
    const size_bone = 10;
    const size_inch = 15;

    var boxes = [];
    var illo_translate = true;  // flag to apply the translation on illo only once

    function getCoords(leapPoint, frame) {
        let mult = 0;
        if (frame.hasOwnProperty('interactionBox')) {
            // for older version of the leap motion controller
            let iBox = frame.interactionBox;
            let normalizedPoint = iBox.normalizePoint(leapPoint, true);
            mult = 1000;
            return {
                x: normalizedPoint[0] * mult,
                y: (1 - normalizedPoint[1]) * mult,
                z: normalizedPoint[2] * mult
            };
        } else {
            // for lastest version of the leap motion controller
            mult = 3;
            return {
                x: leapPoint[0] * mult,
                y: -leapPoint[1] * mult,
                z: leapPoint[2] * mult
            };
        }
    }

    function generateBox(digits, x, y, z, width, height, depth) {
        digits.push({width: width, height: height, depth: depth, coords: {x: x, y: y, z: z}});
    }

    function leapmotion() {

        const controller = new Leap.Controller();
        controller.connect();

        controller.on('frame', (frame) => {

            if (illo_translate) {
                // apply the translation once only
                illo_translate = false;
                if (frame.hasOwnProperty('interactionBox')) {
                    // for older version of the leap motion controller
                    illo.translate = {
                        x:(-width / 2), y:(-height / 2)
                    }
                } else {
                    // for lastest version of the leap motion controller
                    illo.translate = {
                        x:(width / 10) ,  y:(height / 2)
                    }
                }
            }

            let digits = [];

            // for each hand
            frame.hands.forEach(hand => {

                // for drawing the palm
                var palmPos = getCoords(hand.palmPosition, frame);
                generateBox(digits, palmPos.x, palmPos.y, palmPos.z, size_palm, size_palm, size_palm);

                // For each finger
                hand.fingers.forEach((finger, id) => {
                    /*
                                   for( var j = 0, jmax=finger.bones.length; j < jmax; j++ ){
                                      let bone = finger.bones[j];

                                      let pos = getCoords(bone.center(), frame);
                                      generateBox(digits, pos.x, pos.y, pos.z, size_bone, size_bone, size_bone);
                                   }
                    */
                    let size_item = size_bone;
                    if (id == 0) {
                        size_item = size_inch;
                    }
                    var carpPos = getCoords(finger.carpPosition, frame); // carpal
                    generateBox(digits, carpPos.x, carpPos.y, carpPos.z, size_finger, size_finger, size_finger);

                    var mcpPos = getCoords(finger.mcpPosition, frame); // metacarpal
                    generateBox(digits, mcpPos.x, mcpPos.y, mcpPos.z, size_item, size_item, size_item);

                    var pipPos = getCoords(finger.pipPosition, frame); // proximal
                    generateBox(digits, pipPos.x, pipPos.y, pipPos.z, size_item, size_item, size_item);

                    var dipPos = getCoords(finger.dipPosition, frame); // intermediate phalange
                    generateBox(digits, dipPos.x, dipPos.y, dipPos.z, size_item, size_item, size_item);

                    var tipPos = getCoords(finger.tipPosition, frame); // distal phalange
                    generateBox(digits, tipPos.x, tipPos.y, tipPos.z, size_item, size_item, size_item);

                });

            });
            boxes.push(digits);

        });

    }

    function draw() {

        let digits = [];
        if (boxes.length > 1) {
            digits = boxes.shift();
        } else {
            if (boxes.length == 1) {
                digits = boxes[0];
            } else {
                digits = [];
            }
        }

        illo.children = [];

        digits.forEach(item => {
            new Zdog.Box({
                addTo: illo,
                width: item.width,
                height: item.height,
                depth: item.depth,
                translate: item.coords,
                rotate: {x: 0.7, y: 0.7},
                stroke: false,
                color: '#C25', // default face color
                leftFace: '#EA0',
                rightFace: '#E62',
                topFace: '#ED0',
                bottomFace: '#636',
            });
        });

        illo.updateRenderGraph();
    }

    function animate() {
        draw();
        requestAnimationFrame(animate);
    }

    document.addEventListener("DOMContentLoaded", function (event) {
        console.log("DOM fully loaded and parsed");
        leapmotion();
        animate();
    });
}
