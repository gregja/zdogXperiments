{

    // Made with Zdog

    // ----- setup ----- //

    // get canvas element and its context
    let canvas = document.querySelector('.zdog-canvas');
    let ctx = canvas.getContext('2d');
    // get canvas size
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;
    // illustration variables
    const TAU = Zdog.TAU;
    const zoom = 4;
    let isSpinning = true;

    // create an scene Anchor to hold all items
    let scene = new Zdog.Anchor();

    // ----- model ----- //

    // add shapes to scene
    new Zdog.Shape({
      addTo: scene,
      path: [
        { x:  0, y: -8 },
        { x:  8, y:  8 },
        { x: -8, y:  8 },
      ],
      translate: { z: 10 },
      color: '#E62',
      stroke: 3,
      fill: true,
    });

    new Zdog.Ellipse({
      addTo: scene,
      diameter: 20,
      translate: { z: -10 },
      stroke: 5,
      color: '#636',
    });

    new Zdog.Ellipse({
      addTo: scene,
      diameter: 80,
      translate: {z: 40},
      stroke: 20,
      color: '#636',
    });

    new Zdog.Rect({
      addTo: scene,
      width: 80,
      height: 80,
      translate: {z: -40},
      stroke: 12,
      color: '#E62',
      fill: true,
    });

    // ----- animate ----- //

    function animate() {
      // make changes to model, like rotating scene
      scene.rotate.y += isSpinning ? 0.03 : 0;
      scene.updateGraph();
      render();
      requestAnimationFrame( animate );
    }

    function render() {
      // clear canvas
      ctx.clearRect( 0, 0, canvasWidth, canvasHeight );
      ctx.save();
      // center canvas & zoom
      ctx.translate( canvasWidth/2, canvasHeight/2 );
      ctx.scale( zoom, zoom );
      // set lineJoin and lineCap to round
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      // render scene graph
      scene.renderGraphCanvas( ctx );
      ctx.restore();
    }


    // ----- drag ----- //

    let dragStartRX, dragStartRY;
    let minSize = Math.min( canvasWidth, canvasHeight );

    // add drag-rotatation with Dragger
    new Zdog.Dragger({
      startElement: canvas,
      onDragStart: function() {
        isSpinning = false;
        dragStartRX = scene.rotate.x;
        dragStartRY = scene.rotate.y;
      },
      onDragMove: function( pointer, moveX, moveY ) {
        scene.rotate.x = dragStartRX - ( moveY / minSize * TAU );
        scene.rotate.y = dragStartRY - ( moveX / minSize * TAU );
      },
    });


  document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
    animate();
  });

}
