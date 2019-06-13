let canvas = document.querySelector('canvas');
let ringGroup;
let rings = [];
let ringCount = 100;
let ringRange = 200;

let il = new Zdog.Illustration({
  element: canvas,
  dragRotate: true
});

ringGroup = new Zdog.Group({ addTo: il });

for(let i = 1; i < ringCount; i++) {
  rings.push({
    shape: new Zdog.Ellipse({
      addTo: ringGroup,
      diameter: 1050,
      translate: {
        x: Calc.rand(-ringRange, ringRange),
        y: Calc.rand(-ringRange, ringRange),
        z: Calc.rand(-ringRange, ringRange),
      },
      stroke: Calc.rand(0.5, 2),
      color: `hsla(0, 0%, 100%, ${Calc.rand(0.1, 1)})`,
    })
  });
}

function animate() {
  ringGroup.rotate.y += 0.005;
  ringGroup.rotate.x -= 0.007;
  ringGroup.rotate.z -= 0.008;

  for(let i = 0, len = rings.length; i < len; i++) {
    let ring = rings[i].shape;
    ring.stroke = Calc.map(Math.sin(Date.now() * 0.007 + i * 0.2), -1, 1, 0.5, 3);
  }

  il.updateRenderGraph();
  window.requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
    animate();
});
