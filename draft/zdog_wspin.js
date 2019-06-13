// Made with Zdog
// https://codepen.io/forresto/pen/YbMQXj

const pixels = `
wwww          wwww       wwww
wwwwww       wwwww      wwwww
wwwwww      wwwwww     wwwww
wwwwwww     wwwwww    wwwwww
wwwwwww    wwwwwww    wwwwww
 wwwwwww   wwwwwww   wwwwww
  wwwwww  wwwwwwww   wwwwww
  wwwwww  wwwwwwwww  wwwwww
  wwwwww  wwwwwwwww wwwwww
  wwwwww wwwwwwwwww wwwwww
  wwwwww wwwww wwww wwwww
  wwwwwwwwwwww wwwwwwwwww
   wwwwwwwwww  wwwwwwwwww
   wwwwwwwwww  wwwwwwwww
   wwwwwwwwww  wwwwwwwww
   wwwwwwwww   wwwwwwww
   wwwwwwwww   wwwwwwww
   wwwwwwww    wwwwwww
    wwwwww      wwwwww
    wwwww       wwww
`;

const debug = false;

const stroke = 1;
const color = "#4d6bff";
const colorDebug = "rgba(0,0,0,0.1)";
const colorSide = "#323ed1";
const colorTop = "#738cff";
const colorBottom = "#202999";
const size = 360;
const pixelSize = 10;

const TAU = Math.PI * 2;
let isSpinning = !debug;

const initialRotate = { x: 0, y: 0, z: 0 };

let illo;

document.querySelector("#rotate").addEventListener("click", function() {
  illo.rotate.x = 0;
  illo.rotate.z = 0;
  isSpinning = true;
});

const pixelData = pixels
  .split("\n")
  .map(row => row.split(""));

//function setup(isSpinning) {
const canvas = document.querySelector(".zdog-canvas");
canvas.width = size;
canvas.height = size;

illo = new Zdog.Illustration({
  element: canvas,
  dragRotate: true,
  zoom: 1,
  rotate: initialRotate,
  onDragStart: function() {
    // setup(false);
    isSpinning = false;
  },
  onDragEnd: function() {
    // isSpinning = true;
  }
});

const shapeGroup = new Zdog.Group({
  addTo: illo,
  updateSort: true, // Fixes boxes' z
  translate: { x: 0, y: 0, z: 0 }
});

let widest = 1;
pixelData.forEach((row, y) => {
  if (widest < row.length) {
    widest = row.length;
  }
  row.forEach((pixel, x) => {
    if (pixel === " ") return;
    const hasLeft = x === 0 || row[x - 1] === " ";
    const hasRight = x === row.length - 1 || row[x + 1] === " ";
    const hasTop =
      y === 0 || pixelData[y - 1][x] == null || pixelData[y - 1][x] === " ";
    const hasBottom =
      y === pixelData.length - 1 ||
      pixelData[y + 1][x] == null ||
      pixelData[y + 1][x] === " ";

    new Zdog.Box({
      addTo: shapeGroup,
      width: pixelSize,
      height: pixelSize,
      depth: pixelSize * 5,
      stroke: stroke,
      fill: true,
      color: debug ? colorDebug : color,
      leftFace: hasLeft ? colorSide : false,
      rightFace: hasRight ? colorSide : false,
      topFace: !isSpinning && hasTop ? colorTop : false,
      bottomFace: !isSpinning && hasBottom && !isSpinning ? colorBottom : false,
      rearFace: isSpinning ? false : colorDebug,
      translate: { x: x * pixelSize, y: y * pixelSize }
    });
  });
});

shapeGroup.translate.x = -1 * widest * pixelSize / 2;
shapeGroup.translate.y = -1 * pixelData.length * pixelSize / 2;
// }
// setup(true);

function animate() {
  // rotate
  if (isSpinning) {
    illo.rotate.y = (Date.now() / 1000 / 6 * TAU) % (TAU / 2) - TAU / 4;
  }
  illo.updateRenderGraph();
  requestAnimationFrame(animate);
}
animate();

console.log({ illo });
