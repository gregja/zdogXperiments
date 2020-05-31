/**
 * Constructive Solid Geometry (CSG)
 * Knowledge base of examples created with those documentations :
 *   https://joostn.github.io/OpenJsCad/
 *   http://evanw.github.io/csg.js/
 */

var csg_library = {};

csg_library['basic_1'] = {
    title: 'Basic 1',
    comment : 'cube union sphere',
    code: `var a = CSG.cube({ center: [-0.5, -0.5, -0.5] });
var b = CSG.sphere({ radius: 1.3, center: [0.5, 0.5, 0.5] });
final = a.union(b)`
};

csg_library['basic_2'] = {
    title: 'Basic 2',
    comment: 'cube subtract sphere',
    code: `var a = CSG.cube();
var b = CSG.sphere({ radius: 1.35 });
a.setColor(1, 1, 0);
b.setColor(0, 0.5, 1);
final = a.subtract(b);`
};

csg_library['cube_center'] = {
    title: 'Cube by center',
    comment: 'cube subtract sphere',
    code: `var cube = CSG.cube({
    center: [0, 0, 0],
    radius: [1, 1, 1]
});
final = cube;`
};

csg_library['cube_corners'] = {
    title: 'Cube by diagonally opposite corners',
    comment: 'cube subtract sphere',
    code: `var cube = CSG.cube({
    corner1: [-10, 5, 10],
    corner2: [10, -5, 1]
});
final = cube;`
};

csg_library['sphere_1'] = {
    title: 'Sphere',
    comment: 'simple example of sphere',
    code: `var sphere = CSG.sphere({
    center: [0, 0, 0],
    radius: 2,            // must be scalar
    resolution: 32        // optional
});
final = sphere;`
};

csg_library['cylinder_1'] = {
    title: 'Cylinder',
    comment: 'simple example of cylinder',
    code: `var cylinder = CSG.cylinder({
    start: [0, -1, 0],
    end: [0, 1, 0],
    radius: 1,
    resolution: 16        // optional
});
final = cylinder;`
};

csg_library['cone_1'] = {
    title: 'Cylinder',
    comment: 'simple example of cone',
    code: `var cone = CSG.cylinder({
    start: [0, -1, 0],
    end: [0, 1, 0],
    radiusStart: 1,
    radiusEnd: 2,
    resolution: 16        // optional
});
final = cone;`
};

csg_library['cone_sector_1'] = {
    title: 'Cone sector',
    comment: 'simple example of cone sector',
    code: `var coneSector = CSG.cylinder({
    start: [0, 0, -1],
    end: [0, 0, 1],
    radiusStart: 2,
    radiusEnd: 1,
    sectorAngle: 90,
    resolution: 16        // optional
});
final = coneSector;`
};

csg_library['roundedCylinder_1'] = {
    title: 'Rounded Cylinder',
    comment: 'like a cylinder, but with spherical endpoints',
    code: `var roundedCylinder = CSG.roundedCylinder({
    start: [0, -1, 0],
    end: [0, 1, 0],
    radius: 1,
    resolution: 16        // optional
});
final = roundedCylinder;`
};

csg_library['roundedCube_1'] = {
    title: 'Rounded Cube',
    comment: '',
    code: `var cube = CSG.roundedCube({
    corner1: [-10, 5, 10],
    corner2: [10, -5, 1]
    roundradius: 3,
    resolution: 8,        // optional
});
final = cube;`
};

csg_library['roundedCube_2'] = {
    title: 'Rounded Cube',
    comment: 'roundedCube works with a vector radius too',
    code: `var cube = CSG.roundedCube({
    radius: [10, 5, 8],
    roundradius: [3, 5, 0.01],
    resolution: 24
});
final = cube;`
};

csg_library['polyhedron_1'] = {
    title: 'Polyhedron',
    comment: 'a polyhedron (point ordering for faces: when looking at the face from the outside inwards, the points must be clockwise)',
    code: `var polyhedron = CSG.polyhedron({
    points:[ [10,10,0],[10,-10,0],[-10,-10,0],[-10,10,0], // the four points at base
        [0,0,10]  ],                                 // the apex point
    faces:[ [0,1,4],[1,2,4],[2,3,4],[3,0,4],              // each triangle side
        [1,0,3],[2,1,3] ]                         // two triangles for square base
});
final = polyhedron;`
};

csg_library['xtrusions_1'] = {
    title: 'Extrusions 1',
    comment: 'cube, sphere, cylinders on intersect, subtract, union ',
    code: `var a = CSG.cube();
var b = CSG.sphere({ radius: 1.35, stacks: 12 });
var c = CSG.cylinder({ radius: 0.7, start: [-1, 0, 0], end: [1, 0, 0] });
var d = CSG.cylinder({ radius: 0.7, start: [0, -1, 0], end: [0, 1, 0] });
var e = CSG.cylinder({ radius: 0.7, start: [0, 0, -1], end: [0, 0, 1] });
final = a.intersect(b).subtract(c.union(d).union(e))`
};

csg_library['gear_01'] = {
    title: 'Gear example 1',
    comment: 'example of gear taken on : https://joostn.github.io/OpenJsCad/',
    code: `
function main(params)
{
  // Main entry point; here we construct our solid: 
  var gear = involuteGear(
    params.numTeeth,
    params.circularPitch,
    params.pressureAngle,
    params.clearance,
    params.thickness
  );
  if(params.centerholeradius > 0)
  {
    var centerhole = CSG.cylinder({start: [0,0,-params.thickness], end: [0,0,params.thickness], radius: params.centerholeradius, resolution: 16});
    gear = gear.subtract(centerhole);
  }
  return gear;
}

// Here we define the user editable parameters: 
function getParameterDefinitions() {
  return [
    { name: 'numTeeth', caption: 'Number of teeth:', type: 'int', default: 15 },
    { name: 'circularPitch', caption: 'Circular pitch:', type: 'float', default: 10 },
    { name: 'pressureAngle', caption: 'Pressure angle:', type: 'float', default: 20 },
    { name: 'clearance', caption: 'Clearance:', type: 'float', default: 0 },
    { name: 'thickness', caption: 'Thickness:', type: 'float', default: 5 },
    { name: 'centerholeradius', caption: 'Radius of center hole (0 for no hole):', type: 'float', default: 2 },
  ];
}

/*
  For gear terminology see: 
    http://www.astronomiainumbria.org/advanced_internet_files/meccanica/easyweb.easynet.co.uk/_chrish/geardata.htm
  Algorithm based on:
    http://www.cartertools.com/involute.html

  circularPitch: The distance between adjacent teeth measured at the pitch circle
*/ 
function involuteGear(numTeeth, circularPitch, pressureAngle, clearance, thickness)
{
  // default values:
  if(arguments.length < 3) pressureAngle = 20;
  if(arguments.length < 4) clearance = 0;
  if(arguments.length < 4) thickness = 1;
  
  var addendum = circularPitch / Math.PI;
  var dedendum = addendum + clearance;
  
  // radiuses of the 4 circles:
  var pitchRadius = numTeeth * circularPitch / (2 * Math.PI);
  var baseRadius = pitchRadius * Math.cos(Math.PI * pressureAngle / 180);
  var outerRadius = pitchRadius + addendum;
  var rootRadius = pitchRadius - dedendum;

  var maxtanlength = Math.sqrt(outerRadius*outerRadius - baseRadius*baseRadius);
  var maxangle = maxtanlength / baseRadius;

  var tl_at_pitchcircle = Math.sqrt(pitchRadius*pitchRadius - baseRadius*baseRadius);
  var angle_at_pitchcircle = tl_at_pitchcircle / baseRadius;
  var diffangle = angle_at_pitchcircle - Math.atan(angle_at_pitchcircle);
  var angularToothWidthAtBase = Math.PI / numTeeth + 2*diffangle;

  // build a single 2d tooth in the 'points' array:
  var resolution = 5;
  var points = [new CSG.Vector2D(0,0)];
  for(var i = 0; i <= resolution; i++)
  {
    // first side of the tooth:
    var angle = maxangle * i / resolution;
    var tanlength = angle * baseRadius;
    var radvector = CSG.Vector2D.fromAngle(angle);    
    var tanvector = radvector.normal();
    var p = radvector.times(baseRadius).plus(tanvector.times(tanlength));
    points[i+1] = p;
    
    // opposite side of the tooth:
    radvector = CSG.Vector2D.fromAngle(angularToothWidthAtBase - angle);    
    tanvector = radvector.normal().negated();
    p = radvector.times(baseRadius).plus(tanvector.times(tanlength));
    points[2 * resolution + 2 - i] = p;
  }

  // create the polygon and extrude into 3D:
  var tooth3d = new CSG.Polygon2D(points).extrude({offset: [0, 0, thickness]});

  var allteeth = new CSG();
  for(var i = 0; i < numTeeth; i++)
  {
    var angle = i*360/numTeeth;
    var rotatedtooth = tooth3d.rotateZ(angle);
    allteeth = allteeth.unionForNonIntersecting(rotatedtooth);
  }

  // build the root circle:  
  points = [];
  var toothAngle = 2 * Math.PI / numTeeth;
  var toothCenterAngle = 0.5 * angularToothWidthAtBase; 
  for(var i = 0; i < numTeeth; i++)
  {
    var angle = toothCenterAngle + i * toothAngle;
    var p = CSG.Vector2D.fromAngle(angle).times(rootRadius);
    points.push(p);
  }

  // create the polygon and extrude into 3D:
  var rootcircle = new CSG.Polygon2D(points).extrude({offset: [0, 0, thickness]});

  var result = rootcircle.union(allteeth);

  // center at origin:
  result = result.translate([0, 0, -thickness/2]);

  return result;
}

var data = {
    numTeeth: 15,
    circularPitch:10,
    pressureAngle:20,
    clearance:0,
    thickness:5
\t};
final = main(data);
`
};

export const CsgLibrary  = csg_library;
