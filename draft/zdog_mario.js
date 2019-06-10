/* jshint browser: true, devel: true, unused: true, undef: true */

var TAU = Math.PI * 2;

// -- Pseudo Vector3 class -- //

function Vector3( position ) {
  this.set( position );
}

Vector3.prototype.set = function( pos ) {
  pos = Vector3.sanitize( pos );
  this.x = pos.x;
  this.y = pos.y;
  this.z = pos.z;
  return this;
};

Vector3.prototype.rotate = function( rotation ) {
  if ( !rotation ) {
    return;
  }
  this.rotateZ( rotation.z );
  this.rotateY( rotation.y );
  this.rotateX( rotation.x );
  return this;
};

Vector3.prototype.rotateZ = function( angle ) {
  rotateProperty( this, angle, 'x', 'y' );
};

Vector3.prototype.rotateX = function( angle ) {
  rotateProperty( this, angle, 'y', 'z' );
};

Vector3.prototype.rotateY = function( angle ) {
  rotateProperty( this, angle, 'x', 'z' );
};

function rotateProperty( vec, angle, propA, propB ) {
  if ( angle % TAU === 0 ) {
    return;
  }
  var cos = Math.cos( angle );
  var sin = Math.sin( angle );
  var a = vec[ propA ];
  var b = vec[ propB ];
  vec[ propA ] = a*cos - b*sin;
  vec[ propB ] = b*cos + a*sin;
}

Vector3.prototype.add = function( vec ) {
  if ( !vec ) {
    return;
  }
  vec = Vector3.sanitize( vec );
  this.x += vec.x;
  this.y += vec.y;
  this.z += vec.z;
  return this;
};

Vector3.prototype.lerp = function( vec, t ) {
  this.x = lerp( this.x, vec.x, t );
  this.y = lerp( this.y, vec.y, t );
  this.z = lerp( this.z, vec.z, t );
  return this;
};

function lerp( a, b, t ) {
  return ( b - a ) * t + a;
}

// ----- utils ----- //

// add missing properties
Vector3.sanitize = function( vec ) {
  vec = vec || {};
  vec.x = vec.x || 0;
  vec.y = vec.y || 0;
  vec.z = vec.z || 0;
  return vec;
};

function PathAction( method, points, previousPoint ) {
  this.method = method;
  this.points = points.map( mapVectorPoint );
  this.renderPoints = points.map( mapVectorPoint );
  this.previousPoint = previousPoint;
  this.endRenderPoint = this.renderPoints[ this.renderPoints.length - 1 ];
  // arc actions come with previous point & corner point
  // but require bezier control points
  if ( method == 'arc' ) {
    this.controlPoints = [ new Vector3(), new Vector3() ];
  }
}

function mapVectorPoint( point ) {
  return new Vector3( point );
}

PathAction.prototype.reset = function() {
  // reset renderPoints back to orignal points position
  var points = this.points;
  this.renderPoints.forEach( function( renderPoint, i ) {
    var point = points[i];
    renderPoint.set( point );
  });
};

PathAction.prototype.transform = function( translation, rotation ) {
  this.renderPoints.forEach( function( renderPoint ) {
    renderPoint.rotate( rotation );
    renderPoint.add( translation );
  });
};

PathAction.prototype.render = function( ctx ) {
  this[ this.method ]( ctx );
};

PathAction.prototype.move = function( ctx ) {
  var point = this.renderPoints[0];
  ctx.moveTo( point.x, point.y );
};

PathAction.prototype.line = function( ctx ) {
  var point = this.renderPoints[0];
  ctx.lineTo( point.x, point.y );
};

PathAction.prototype.bezier = function( ctx ) {
  var cp0 = this.renderPoints[0];
  var cp1 = this.renderPoints[1];
  var end = this.renderPoints[2];
  ctx.bezierCurveTo( cp0.x, cp0.y, cp1.x, cp1.y, end.x, end.y );
};

PathAction.prototype.arc = function( ctx ) {
  var prev = this.previousPoint;
  var corner = this.renderPoints[0];
  var end = this.renderPoints[1];
  var cp0 = this.controlPoints[0];
  var cp1 = this.controlPoints[1];
  cp0.set( prev ).lerp( corner, 9/16 );
  cp1.set( end ).lerp( corner, 9/16 );
  ctx.bezierCurveTo( cp0.x, cp0.y, cp1.x, cp1.y, end.x, end.y );
};


// -------------------------- Shape -------------------------- //

function Shape( options ) {
  this.create( options );
}

Shape.prototype.create = function( options ) {
  // default
  extend( this, Shape.defaults );
  // set options
  setOptions( this, options );

  this.updatePathActions();

  // transform
  this.translate = Vector3.sanitize( this.translate );
  this.rotate = Vector3.sanitize( this.rotate );
  // children
  this.children = [];
  if ( this.addTo ) {
    this.addTo.addChild( this );
  }
};

Shape.defaults = {
  stroke: true,
  fill: false,
  color: 'black',
  lineWidth: 1,
  closed: true,
  rendering: true,
  path: [],
};

var optionKeys = Object.keys( Shape.defaults ).concat([
  'rotate',
  'translate',
  'addTo',
]);

function setOptions( shape, options ) {
  for ( var key in options ) {
    if ( optionKeys.includes( key ) ) {
      shape[ key ] = options[ key ];
    }
  }
}

var actionNames = [
  'move',
  'line',
  'bezier',
  'arc',
];

// parse path into PathActions
Shape.prototype.updatePathActions = function() {
  var previousPoint;
  this.pathActions = this.path.map( function( pathPart, i ) {
    // pathPart can be just vector coordinates -> { x, y, z }
    // or path instruction -> { arc: [ {x0,y0,z0}, {x1,y1,z1} ] }
    var keys = Object.keys( pathPart );
    var method = keys[0];
    var points = pathPart[ method ];
    var isInstruction = keys.length === 1 && actionNames.includes( method ) &&
      Array.isArray( points );

    if ( !isInstruction ) {
      method = 'line';
      points = [ pathPart ];
    }

    // first action is always move
    method = i === 0 ? 'move' : method;
    // arcs require previous last point
    var pathAction = new PathAction( method, points, previousPoint );
    // update previousLastPoint
    previousPoint = pathAction.endRenderPoint;
    return pathAction;
  });
};

Shape.prototype.addChild = function( shape ) {
  this.children.push( shape );
};

// ----- update ----- //

Shape.prototype.update = function() {
  // update self
  this.reset();
  // update children
  this.children.forEach( function( child ) {
    child.update();
  });
  this.transform( this.translate, this.rotate );
};

Shape.prototype.reset = function() {
  // reset pathAction render points
  this.pathActions.forEach( function( pathAction ) {
    pathAction.reset();
  });
};

Shape.prototype.transform = function( translation, rotation ) {
  // transform points
  this.pathActions.forEach( function( pathAction ) {
    pathAction.transform( translation, rotation );
  });
  // transform children
  this.children.forEach( function( child ) {
    child.transform( translation, rotation );
  });
};

Shape.prototype.updateSortValue = function() {
  var sortValueTotal = 0;
  this.pathActions.forEach( function( pathAction ) {
    sortValueTotal += pathAction.endRenderPoint.z;
  });
  // average sort value of all points
  // def not geometrically correct, but works for me
  this.sortValue = sortValueTotal / this.pathActions.length;
};

// ----- render ----- //

Shape.prototype.render = function( ctx ) {
  var length = this.pathActions.length;
  if ( !this.rendering || !length ) {
    return;
  }
  var isDot = length == 1;
  if ( isDot ) {
    this.renderDot( ctx );
  } else {
    this.renderPath( ctx );
  }
};

// Safari does not render lines with no size, have to render circle instead
Shape.prototype.renderDot = function( ctx ) {
  ctx.fillStyle = this.color;
  var point = this.pathActions[0].endRenderPoint;
  ctx.beginPath();
  var radius = this.lineWidth/2;
  ctx.arc( point.x, point.y, radius, 0, TAU );
  ctx.fill();
};

Shape.prototype.renderPath = function( ctx ) {
  // set render properties
  ctx.fillStyle = this.color;
  ctx.strokeStyle = this.color;
  ctx.lineWidth = this.lineWidth;

  // render points
  ctx.beginPath();
  this.pathActions.forEach( function( pathAction ) {
    pathAction.render( ctx );
  });
  var isTwoPoints = this.pathActions.length == 2 &&
    this.pathActions[1].method == 'line';
  if ( !isTwoPoints && this.closed ) {
    ctx.closePath();
  }
  if ( this.stroke ) {
    ctx.stroke();
  }
  if ( this.fill ) {
    ctx.fill();
  }
};

// return Array of self & all child shapes
Shape.prototype.getShapes = function() {
  var shapes = [ this ];
  this.children.forEach( function( child ) {
    var childShapes = child.getShapes();
    shapes = shapes.concat( childShapes );
  });
  return shapes;
};

Shape.prototype.copy = function( options ) {
  // copy options
  var shapeOptions = {};
  optionKeys.forEach( function( key ) {
    shapeOptions[ key ] = this[ key ];
  }, this );
  // add set options
  setOptions( shapeOptions, options );
  return new Shape( shapeOptions );
};


// ----- utils ----- //

function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

// -------------------------- Group -------------------------- //

function Group( options ) {
  this.create( options );
}

Group.prototype.create = function( options ) {
  // set options
  setGroupOptions( this, options );

  // transform
  this.translate = Vector3.sanitize( this.translate );
  this.rotate = Vector3.sanitize( this.rotate );
  // children
  this.children = [];
  if ( this.addTo ) {
    this.addTo.addChild( this );
  }
};

var groupOptionKeys = [
  'rotate',
  'translate',
  'addTo',
];

function setGroupOptions( shape, options ) {
  for ( var key in options ) {
    if ( groupOptionKeys.includes( key ) ) {
      shape[ key ] = options[ key ];
    }
  }
}


Group.prototype.addChild = function( shape ) {
  this.children.push( shape );
};

// ----- update ----- //

Group.prototype.update = function() {
  // update self
  this.reset();
  // update children
  this.children.forEach( function( child ) {
    child.update();
  });
  this.transform( this.translate, this.rotate );
};

Group.prototype.reset = function() {};

Group.prototype.transform = function( translation, rotation ) {
  // transform children
  this.children.forEach( function( child ) {
    child.transform( translation, rotation );
  });
};

Group.prototype.updateSortValue = function() {
  var sortValueTotal = 0;
  this.children.forEach( function( child ) {
    child.updateSortValue();
    sortValueTotal += child.sortValue;
  });
  // TODO sort children?
  // average sort value of all points
  // def not geometrically correct, but works for me
  this.sortValue = sortValueTotal / this.children.length;
};

// ----- render ----- //

Group.prototype.render = function( ctx ) {
  this.children.forEach( function( child ) {
    child.render( ctx );
  });
};

// do not include children, group handles rendering & sorting internally
Group.prototype.getShapes = function() {
  return [ this ];
};

// -------------------------- Dragger -------------------------- //

// quick & dirty drag event stuff
// messes up if multiple pointers/touches

// event support, default to mouse events
var downEvent = 'mousedown';
var moveEvent = 'mousemove';
var upEvent = 'mouseup';
if ( window.PointerEvent ) {
  // PointerEvent, Chrome
  downEvent = 'pointerdown';
  moveEvent = 'pointermove';
  upEvent = 'pointerup';
} else if ( 'ontouchstart' in window ) {
  // Touch Events, iOS Safari
  downEvent = 'touchstart';
  moveEvent = 'touchmove';
  upEvent = 'touchend';
}

function noop() {}

function Dragger( options ) {
  this.startElement = options.startElement;
  this.onPointerDown = options.onPointerDown || noop;
  this.onPointerMove = options.onPointerMove || noop;
  this.onPointerUp = options.onPointerUp || noop;

  this.startElement.addEventListener( downEvent, this );
}

Dragger.prototype.handleEvent = function( event ) {
  var method = this[ 'on' + event.type ];
  if ( method ) {
    method.call( this, event );
  }
};

Dragger.prototype.onmousedown =
Dragger.prototype.onpointerdown = function( event ) {
  this.pointerDown( event, event );
};

Dragger.prototype.ontouchstart = function( event ) {
  this.pointerDown( event, event.changedTouches[0] );
};

Dragger.prototype.pointerDown = function( event, pointer ) {
  event.preventDefault();
  this.dragStartX = pointer.pageX;
  this.dragStartY = pointer.pageY;
  window.addEventListener( moveEvent, this );
  window.addEventListener( upEvent, this );
  this.onPointerDown( pointer );
};

Dragger.prototype.ontouchmove = function( event ) {
  // HACK, moved touch may not be first
  this.pointerMove( event, event.changedTouches[0] );
};

Dragger.prototype.onmousemove =
Dragger.prototype.onpointermove = function( event ) {
  this.pointerMove( event, event );
};

Dragger.prototype.pointerMove = function( event, pointer ) {
  event.preventDefault();
  var moveX = pointer.pageX - this.dragStartX;
  var moveY = pointer.pageY - this.dragStartY;
  this.onPointerMove( pointer, moveX, moveY );
};

Dragger.prototype.onmouseup =
Dragger.prototype.onpointerup =
Dragger.prototype.ontouchend =
Dragger.prototype.pointerUp = function( event ) {
  window.removeEventListener( moveEvent, this );
  window.removeEventListener( upEvent, this );
  this.onPointerUp( event );
};

// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 72;
var h = 72;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 8, Math.floor( minWindowSize / w ) );
var pixelRatio = window.devicePixelRatio || 1;
zoom *= pixelRatio;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;
canvas.style.width = canvasWidth / pixelRatio + 'px';
canvas.style.height = canvasHeight / pixelRatio + 'px';
// colors
var colors = {
  eye: '#333',
  white: '#FFF',
  hair: '#631',
  overalls: '#24D',
  cloth: '#E11',
  skin: '#FC9',
  leather: '#A63',
};

var camera = new Shape();

// -- illustration shapes --- //

// head
new Shape({
  path: [
    { x: 0, y: -12, z: -1 },
  ],
  color: colors.skin,
  lineWidth: 23,
  addTo: camera,
});

// nose
new Shape({
  path: [
    { x: 0, y: -7, z: -14 },
  ],
  color: colors.skin,
  lineWidth: 7,
  addTo: camera,
});



// chin
var chinSide = { x: -5, y: -6, z: -5 };
var chinCenter = { x: 0, y: -3.5, z: -7 };
new Shape({
  path: [
    chinSide,
    chinCenter
  ],
  color: colors.skin,
  lineWidth: 10,
  addTo: camera,
});
// reverse
chinSide.x = -chinSide.x;
new Shape({
  path: [
    chinCenter,
    chinSide
  ],
  color: colors.skin,
  lineWidth: 10,
  addTo: camera,
});
// mouth
new Shape({
  path: [
    { x: -3, y: -3, z: -10 },
    { x: -1, y: -1, z: -10 },
    { x:  1, y: -1, z: -10 },
    { x:  3, y: -3, z: -10 },
  ],
  color: colors.cloth,
  fill: true,
  lineWidth: 2,
  addTo: camera,
});



// hat front
var hatFrontA = { x: -8, y: -20, z: -6 };
var hatFrontB = { x: -4, y: -23, z: -8 };
var hatFrontC = { x: -hatFrontB.x, y: hatFrontB.y, z: hatFrontB.z };

new Shape({
  path: [
    hatFrontA,
    hatFrontB,
    { x: -hatFrontB.x, y: hatFrontB.y, z: hatFrontB.z },
    { x: -hatFrontA.x, y: hatFrontA.y, z: hatFrontA.z },
  ],
  color: colors.cloth,
  closed: false,
  fill: false,
  lineWidth: 11,
  addTo: camera,
});
new Shape({
  path: [
    hatFrontB,
    hatFrontC,
  ],
  color: colors.cloth,
  closed: false,
  fill: false,
  lineWidth: 11,
  addTo: camera,
});
// hatFrontD
hatFrontA.x = -hatFrontA.x;
new Shape({
  path: [
    hatFrontC,
    hatFrontA,
  ],
  color: colors.cloth,
  closed: false,
  fill: false,
  lineWidth: 11,
  addTo: camera,
});


var hatTopFrontX = 10;
var hatTopFrontY = -19;
var hatTopFrontZ = -6;
var hatTopBackX = 7;
var hatTopBackY = -17;
var hatTopBackZ = 9;

var hatTopBackA = { x:  hatTopBackX, y: hatTopBackY, z: hatTopBackZ };
var hatTopBackB = { x: -hatTopBackX, y: hatTopBackY, z: hatTopBackZ };

// hat top
new Shape({
  path: [
    { x: -hatTopFrontX, y: hatTopFrontY, z: hatTopFrontZ },
    { x:  hatTopFrontX, y: hatTopFrontY, z: hatTopFrontZ },
    hatTopBackA,
    hatTopBackB,
  ],
  color: colors.cloth,
  fill: true,
  lineWidth: 9,
  addTo: camera,
});
// hat top back
new Shape({
  path: [
    hatTopBackA,
    hatTopBackB,
  ],
  color: colors.cloth,
  lineWidth: 9,
  addTo: camera,
});

// hat top cover
new Shape({
  path: [
    { x: -3, y: -20, z: 7 },
    { x:  3, y: -20, z: 7 },
    { x:  3, y: -23, z: -5 },
    { x: -3, y: -23, z: -5 },
  ],
  color: colors.cloth,
  lineWidth: 6,
  addTo: camera,
});

[ -1, 1 ].forEach( function( xSide ) {
  // eyes pupil
  new Shape({
    path: [
      { x: 5*xSide, y: -10, z: -10 },
      { x: 5*xSide, y: -8, z: -10 },
    ],
    color: colors.eye,
    lineWidth: 3,
    addTo: camera,
  });


  // eye brow
  new Shape({
    path: [
      { x: 7*xSide, y: -13.5, z: -10 },
      { x: 5.5*xSide, y: -14, z: -11 },
      { x: 4*xSide, y: -13.5, z: -11 },
    ],
    color: colors.hair,
    closed: false,
    lineWidth: 2.5,
    addTo: camera,
  });


  // hat brim
  // brim has left & right side
  new Shape({
    path: [
      { x: 10*xSide, y: -16, z: -8 },
      { x: 8*xSide, y: -16, z: -13 },
      { x: 0, y: -18, z: -17 },
      { x: 0, y: -19, z: -10 },
    ],
    color: colors.cloth,
    fill: true,
    lineWidth: 4,
    addTo: camera,
  });

  // hat top side
  new Shape({
    path: [
      { x:  hatTopFrontX*xSide, y: hatTopFrontY, z: hatTopFrontZ },
      { x:  hatTopBackX*xSide, y: hatTopBackY, z: hatTopBackZ },
    ],
    color: colors.cloth,
    lineWidth: 9,
    addTo: camera,
  });
  new Shape({
    path: [
      { x: 3*xSide, y: -20, z: 7 },
      { x: 3*xSide, y: -23, z: -5 },
    ],
    color: colors.cloth,
    lineWidth: 6,
    addTo: camera,
  });

  var mustacheGroup = new Group({
    addTo: camera,
  });

  // mustache
  new Shape({
    path: [
      { x: 2*xSide, y: -4.5, z: -12.5 },
      { x: 6.5*xSide, y: -5.5, z: -11 },
    ],
    color: colors.hair,
    fill: true,
    lineWidth: 3,
    addTo: mustacheGroup,
  });
  // mustache sections
  new Shape({
    path: [
      { x: 1.75*xSide, y: -4, z: -12 },
    ],
    color: colors.hair,
    fill: true,
    lineWidth: 4,
    addTo: mustacheGroup,
  });
  new Shape({
    path: [
      { x: 4.5*xSide, y: -4.5, z: -11.75 },
    ],
    color: colors.hair,
    fill: true,
    lineWidth: 4,
    addTo: mustacheGroup,
  });

  // side burns
  new Shape({
    path: [
      { x: 10*xSide, y: -9, z: -3 },
      { x: 10*xSide, y: -13, z: -1.5 },
      { x: 10*xSide, y: -13, z: -4 },
      { x: 10*xSide, y: -10, z: -5 },
    ],
    color: colors.hair,
    closed: false,
    fill: true,
    lineWidth: 3,
    addTo: camera,
  });

  // ears
  new Shape({
    path: [
      { x: 10*xSide, y: -8, z: 1 },
      { x: 10*xSide, y: -12, z: 1 },
      { x: 11*xSide, y: -12, z: 3 },
      { x: 10*xSide, y: -8, z: 2 },
    ],
    color: colors.skin,
    fill: true,
    lineWidth: 4,
    addTo: camera,
  });

  // hair side panel
  new Shape({
    path: [
      { x: 9*xSide, y: -12, z: 5 },
      { x: 8*xSide, y: -5, z: 4 },
      { x: 5*xSide, y: -5, z: 9 },
      { x: 6*xSide, y: -11.5, z: 10 },
    ],
    color: colors.hair,
    fill: true,
    lineWidth: 3,
    addTo: camera,
  });
  // hair balls
  new Shape({
    path: [
      { x: 6*xSide, y: -4, z: 7 },
    ],
    color: colors.hair,
    lineWidth: 6,
    addTo: camera,
  });
  new Shape({
    path: [
      { x: 2*xSide, y: -4, z: 9 },
    ],
    color: colors.hair,
    lineWidth: 6,
    addTo: camera,
  });

});

// hair back panel
new Shape({
  path: [
    { x: 5, y: -5, z: 9 },
    { x: 6, y: -11.5, z: 10 },
    { x: -6, y: -11.5, z: 10 },
    { x: -5, y: -5, z: 9 },
  ],
  color: colors.hair,
  fill: true,
  lineWidth: 3,
  addTo: camera,
});


// belly/butt
new Shape({
  path: [
    { x: 0, y: 10, z: -1 },
  ],
  color: colors.overalls,
  lineWidth: 20,
  addTo: camera,
});

// right arm
var rightShoulder = { x: -8, y: 2, z: 2 };
new Shape({
  path: [
    rightShoulder,
    { x: -14, y: -7, z: -1 },
  ],
  color: colors.cloth,
  lineWidth: 8,
  addTo: camera,
});

// right hand
new Shape({
  path: [
    { x: -17, y: -13, z: -2 },
  ],
  color: colors.white,
  lineWidth: 12,
  addTo: camera,
});

// left arm
var leftShoulder = { x: 6, y: 3, z: 3 };
var leftElbow = { x: 8, y: 6, z: 7 };
new Shape({
  path: [
    leftShoulder,
    leftElbow,
  ],
  color: colors.cloth,
  lineWidth: 8,
  addTo: camera,
});
new Shape({
  path: [
    leftElbow,
    { x: 12, y: 8, z: 8 },
  ],
  color: colors.cloth,
  lineWidth: 8,
  addTo: camera,
});
// left hand
new Shape({
  path: [
    { x: 17, y: 11, z: 7 },
  ],
  color: colors.white,
  lineWidth: 12,
  addTo: camera,
});

new Shape({
  path: [
    leftShoulder,
    rightShoulder,
  ],
  color: colors.cloth,
  lineWidth: 8,
  addTo: camera,
});

// right leg
new Shape({
  path: [
    { x: -5, y: 14, z: -3 },
    { x: -5, y: 20, z: -2 },
    { x: -5, y: 22, z: -1 }
  ],
  closed: false,
  color: colors.overalls,
  lineWidth: 10,
  addTo: camera,
});
// right foot toe
new Shape({
  path: [
    { x: -5, y: 28, z: 1.5 }
  ],
  color: colors.leather,
  lineWidth: 11,
  addTo: camera,
});
// right foot sole
new Shape({
  path: [
    { x: -3, y: 22, z: 4 },
    { x: -7, y: 22, z: 4 },
    { x: -7, y: 29, z: 4 },
    { x: -3, y: 29, z: 4 },
  ],
  fill: true,
  color: colors.leather,
  lineWidth: 6,
  addTo: camera,
});


// left leg
new Shape({
  path: [
    { x: 5, y: 14, z: -3 },
    { x: 5, y: 12, z: -8 },
    { x: 5, y: 13, z: -12 },
  ],
  closed: false,
  color: colors.overalls,
  lineWidth: 10,
  addTo: camera,
});
// left foot toe
new Shape({
  path: [
    { x: 5, y: 9, z: -17 }
  ],
  color: colors.leather,
  lineWidth: 11,
  addTo: camera,
});
// left foot sole
new Shape({
  path: [
    { x: 3, y: 8, z:  -19.5 },
    { x: 7, y: 8, z:  -19.5 },
    { x: 7, y: 15, z: -18 },
    { x: 3, y: 15, z: -18 },
  ],
  fill: true,
  color: colors.leather,
  lineWidth: 6,
  addTo: camera,
});

var shapes = camera.getShapes();

// -- animate --- //


function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //

var isRotating = true;

function update() {
  camera.rotate.y += isRotating ? -0.05 : 0;
  camera.update();
  // sort
  shapes.forEach( function updateEachSortValue( shape ) {
    shape.updateSortValue();
  });
  // z-sort
  shapes.sort( function sortBySortValue( a, b ) {
    return b.sortValue - a.sortValue;
  });
}

// -- render -- //

function render() {
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.save();
  ctx.scale( zoom, zoom );
  ctx.translate( w/2, h/2 );

  shapes.forEach( function( shape ) {
    shape.render( ctx );
  });

  ctx.restore();
}

// ----- inputs ----- //

// click drag to rotate
var dragStartAngleX, dragStartAngleY;

new Dragger({
  startElement: canvas,
  onPointerDown: function() {
    isRotating = false;
    dragStartAngleX = camera.rotate.x;
    dragStartAngleY = camera.rotate.y;
  },
  onPointerMove: function( pointer, moveX, moveY ) {
    var angleXMove = moveY / canvasWidth * TAU;
    var angleYMove = moveX / canvasWidth * TAU;
    camera.rotate.x = dragStartAngleX + angleXMove;
    camera.rotate.y = dragStartAngleY + angleYMove;
  },
});
