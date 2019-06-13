// extract the necessary modules from the Zdog library
const {
  Illustration, Ellipse, Anchor, Group, TAU, Shape,
} = Zdog;

const canvas = document.querySelector('canvas');
const { width, height } = canvas;

// create an illustration out of the canvas element
const illustration = new Illustration({
  element: 'canvas',
  // allow for drag
  dragRotate: true,
});

// stroke used for the dial and to compute the stroke of the other shapes
const stroke = 40;

// group describing the clock's dial
const dial = new Group({
  addTo: illustration,
});
// outer stroke
new Ellipse({
  addTo: dial,
  stroke,
  diameter: width - stroke,
  color: '#272A5B',
});
// inner circle
new Ellipse({
  addTo: dial,
  stroke,
  color: '#272A5B',
});

// for each hand include an anchor element, to rotate from the center of the clock
const anchorSeconds = new Anchor({
  addTo: illustration,
});

// each hand is made of a path and a circle
// the path reaches outward before using an arc to wrap around the circle
new Shape({
  addTo: anchorSeconds,
  stroke: stroke / 2,
  color: 'hsl(60, 80%, 52%)',
  path: [
    { x: 0, y: -stroke },
    { x: 0, y: -height / 5 },
    {
      arc: [
        { x: 35, y: -height / 5 }, // corner
        { x: 35, y: -height / 5 - 35 }, // end point
      ],
    },
    {
      arc: [
        { x: 35, y: -height / 5 - 70 }, // corner
        { x: 0, y: -height / 5 - 70 }, // end point
      ],
    },
  ],
  closed: false,
  // rotate: { y: TAU / 2 },
});

// the circle is positioned at the center of the hypothetical circle made by the path's arcs
new Ellipse({
  addTo: anchorSeconds,
  stroke,
  color: 'hsl(60, 95%, 52%)',
  translate: { y: -height / 5 - 35 },
});


// copy the anchor for the other two hands
const anchorMinutes = anchorSeconds.copyGraph();
const anchorHours = anchorSeconds.copyGraph();

// loop through the children of every anchor to update the hue
// starting at 60 and rotating around the color wheel
[anchorSeconds, anchorMinutes, anchorHours].forEach((hand, indexHand) => {
  hand.children.forEach((child, indexChild) => {
    child.color = `hsl(${60 + 120 * indexHand}, ${80 + 15 * indexChild}%, 52%)`;
  });
});

// retrieve the current number of seconds, minutes and hours
const startingDate = new Date();

let seconds = startingDate.getSeconds();
let minutes = startingDate.getMinutes();
let hours = startingDate.getHours();

// for each anchor rotate the first child according to the time's value
// the idea is to have the arc wrap always below the circle
anchorSeconds.children[0].rotate.y = seconds > 30 ? TAU / 2 : 0;
anchorMinutes.children[0].rotate.y = minutes > 30 ? TAU / 2 : 0;
hours = hours > 12 ? hours - 12 : hours;
anchorHours.children[0].rotate.y = hours > 6 ? TAU / 2 : 0;

// rotate the anchors according to the initial value
anchorSeconds.rotate.z = TAU / 60 * seconds;
anchorMinutes.rotate.z = TAU / 60 * minutes;
anchorHours.rotate.z = TAU / 12 * hours;

// function called through the request animation function
function animate() {
  // update the graph
  illustration.updateRenderGraph();
  requestAnimationFrame(animate);

  // retrieve an instance of the date object
  const now = new Date();
  // if the number of seconds changes from the previous observation, update teh matching anchor
  if (now.getSeconds() !== seconds) {
    seconds = now.getSeconds();
    anchorSeconds.rotate.z = TAU / 60 * seconds;
    // if the hand passes past the pre-established threshold, rotate the path to wrap it around the circle in the opposite direction
    if (seconds === 30 || seconds === 0) {
      anchorSeconds.children[0].rotate.y += TAU / 2;
    }
    // repeat for the number of minutes and hours
    if (now.getMinutes() !== minutes) {
      minutes = now.getMinutes();
      anchorMinutes.rotate.z = TAU / 60 * minutes;
      if (minutes === 30 || minutes === 0) {
        anchorMinutes.children[0].rotate.y += TAU / 2;
      }
      if (now.getHours() !== minutes) {
        hours = now.getHours();
        anchorHours.rotate.z = TAU / 24 * hours;
        if (hours % 6 === 0) {
          anchorHours.children[0].rotate.y += TAU / 2;
        }
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
    animate();
});
