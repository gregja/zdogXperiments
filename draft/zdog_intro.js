{

  let isSpinning = true;

  let illo = new Zdog.Illustration({
    element: '.zdog-canvas',
    dragRotate: true,
    // pause spinning while dragging
    onDragStart: () => isSpinning = false,
    onDragEnd: () => isSpinning = true
  });

  new Zdog.Ellipse({
    addTo: illo,
    diameter: 80,
    translate: {z: 40},
    stroke: 20,
    color: '#636',
  });

  new Zdog.Rect({
    addTo: illo,
    width: 80,
    height: 80,
    translate: {z: -40},
    stroke: 12,
    color: '#E62',
    fill: true,
  });

  function draw (){
    if (isSpinning) illo.rotate.y += 0.03;
    illo.updateRenderGraph();
  }

  function animate() {
    draw();
    requestAnimationFrame( animate );
  }

  document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
    animate();
  });

}
