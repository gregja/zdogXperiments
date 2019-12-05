----

100x50 Raymarching lattice structure : ray marching en pur canvas 2d, par Niklas Knaack
https://codepen.io/NiklasKnaack/pen/Qxrmpz
https://codepen.io/NiklasKnaack

-----
// gear with zdog
//  https://codepen.io/anon/pen/pXKEKX
var w = 48;
var h = 48;
var minWindowSize = Math.min( window.innerWidth - 20 , window.innerHeight - 20 );
var zoom = Math.floor( minWindowSize / w );
var teeth = 8;
var frontZ = { z: 3 };
var backZ = { z: -3 };
var TAU = Zdog.TAU;

var gearPath = ( function() {
  var path = [];
  var teethCount = teeth * 4;
  for ( var i=0; i < teethCount; i++ ) {
    var isOuter = i % 4 < 2;
    var radius = isOuter ? 12 : 9.5;
    var theta = Math.ceil( i/2 ) * 2;
    theta += i % 2 ? -0.2 : 0.2;
    theta = ( theta/teethCount + 1/teethCount ) * TAU ;
    path.push({
      x: Math.cos( theta ) * radius,
      y: Math.sin( theta ) * radius,
    });
  }
  return path;
})();

gearPath.forEach( function( corner, i ) {
  var nextCorner = gearPath[ i + 1 ] || gearPath[0];
  new Zdog.Shape({
    addTo: gearSide,
    path: [
      new Zdog.Vector( corner ).add( frontZ ),
      new Zdog.Vector( corner ).add( backZ ),
      new Zdog.Vector( nextCorner ).add( backZ ),
      new Zdog.Vector( nextCorner ).add( frontZ ),
    ],
    color: i % 2 ? newColorC : colorB,
    fill: true,
    stroke: 1/zoom,
  });
});

----
cercles de 10 points (2 possibilités)

console.log('boucle 1');
for (let i=0, imax=360, step=imax/10; i<=imax; i += step) {
	let ang = i * Math.PI / 180;	// conversion angle en radians
	console.log(ang);
}

console.log('boucle 2');
for (let i = 0, imax= Math.PI * 2, step=imax / 10; i <= imax; i += step) {
	console.log(i);
}

----

// source : https://codepen.io/desandro/pen/XbqZzm

Vector.getDistance = function( a, b ) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return Math.sqrt( dx * dx + dy * dy );
};

Vector.addDistance = function( vector, distance, angle ) {
  var x = vector.x + Math.cos( angle ) * distance;
  var y = vector.y + Math.sin( angle ) * distance;
  return new Vector( x, y );
};

----

https://fr.wikipedia.org/wiki/Vecteur

deux droites du plan (de la forme y=ax+b) sont perpendiculaires si et seulement si leurs coefficients directeurs a et a' vérifient a.a'=-1.

Dans un plan cartésien, on peut trouver les coordonnées du point d’intersection de deux courbes (comme par exemple deux droites) en résolvant le système d’équations.
Soit les droites dont les équations sont
y = x – 4
y = –2x + 5
alors : x – 4 = –2x+ 5.

On représente ces droites dans un plan cartésien.
Donc : 3x = 9 et x = 3
Puis :  y = –1
Les coordonnées du point d’intersection de ces droites sont (3, –1).

https://lexique.netmath.ca/point-dintersection/
http://dossierslmm.chez-alice.fr/fiche/intersection_droites.pdf
http://labomath.free.fr/qcms/seconde/equadroite/droites.pdf
https://fr.wikipedia.org/wiki/Propri%C3%A9t%C3%A9s_m%C3%A9triques_des_droites_et_des_plans

----

tilde en JS ?

http://sametmax.com/loperateur-not-bitwise-ou-tilde-en-javascript/

L’opérateur NOT bitwise est en général utilisé comme un Math.floor(), en plus rapide.
Mais il a une propriété amusante sur les entiers, il les transforme en -(N+1), où N est l’entier en question.

~~(Math.random() * 40)

~-2 => 1
~-1 => 0
~0 => -1
~1 => -2
~2 => -3

-----

Jimp, manipulation d'images sous nodejs

https://www.npmjs.com/package/jimp


Phin, node http client :

https://github.com/ethanent/phin


----

// https://codepen.io/stormhaul/pen/gVJYWw

var l = l || {};

l.helper = {
    getRadialVector: (distance, theta) => {
        return {
            x: distance * Math.cos(theta),
            y: distance * Math.sin(theta)
        }
    },
    getCartesianDistance: (p1, p2) => {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    },
    getTheta: (p1, p2) => {
        return Math.atan2(
            p2.y - p1.y,
            p2.x - p1.x
        );
    },
    log: function() {
        for (let i in arguments) {
            let a = arguments[i];
            console.log(JSON.parse(JSON.stringify(a)));
        }
    },
    getUnitVectorBetweenTwoPoints: (p1, p2) => {
        let v = {x: p2.x - p1.x, y: p2.y - p1.y};
        let mag = Math.sqrt(v.x * v.x + v.y * v.y);

        return {
            x: v.x / mag,
            y: v.y / mag
        };
    },
    getRandom: (min, max) => {
        let diff = max - min;
        return Math.floor(Math.random() * diff + min);
    }
};

//--------------------
// FIND simplifié en JS

var array1 = [{id:5, data:'nom 5'}, {id:12, data:'nom 12'}, {id:8, data:'nom 8'}, {id:130, data:'nom 130'}];

var xxx = 6;

var found = array1.find(function(item) {
  return item.id == xxx;
});

console.log(found);  // expected output: undefined

xxx = 5;

var found = array1.find(function(item) {
  return item.id == xxx;
});

console.log(found);  // expected output: Object { id: 5, data: "nom 5" }

//--------------------------

// https://codepen.io/jackrugile/pen/WQBPzv

var rand = function( min, max ) {
	return Math.random() * ( max - min ) + min;
};


// classe vector 2d intéressante sur :
//  https://codepen.io/Gthibaud/pen/JjPJdpK


// star fractal par paul bourke :
//  http://paulbourke.net/fractals/star/
// excellent tuto sur les fractales :
//  http://paulbourke.net/fractals/polyhedral/


// fonctions trigo :
// https://www.maths-france.fr/Terminale/TerminaleS/FichesCours/FormulesTrigonometrie.pdf
// http://www.trigofacile.com/maths/trigo/etude/formulaires/pdf/essentiel-circulaire.pdf
// https://www.uni-muenster.de/Stochastik/falconnet/docs/enseignement/2008-2009/linearisation.pdf
// http://maths.ptsi.pagesperso-orange.fr/Trigonometrie.pdf

// canvas template de jacob foster :
//  https://codepen.io/Alca/pen/XeZBab

/-----------------------------
const {
	E, LN10, LN2, LOG10E, LOG2E, PI, SQRT1_2, SQRT2,
	abs, acos, acosh, asin, asinh, atan, atan2, atanh, cbrt, ceil, clz32,
	cosh, exp, expm1, floor, fround, hypot, imul, log, log10, log1p, log2, max,
	min, pow, /* random, */ round, sign, sinh, sqrt, tan, tanh, trunc
} = Math;

// vampirization of the Math Function
Object.getOwnPropertyNames(Math).map(function(p) {
  this[p] = Math[p];
});

/*
const cos = Math.cos;
const sin = Math.sin;
const asin = Math.asin;
const atan = Math.atan;
const pow = Math.pow;
const sqrt = Math.sqrt;
const abs = Math.abs;
const PI = Math.PI;
*/

//----------------------------

// https://library.fridoverweij.com/codelab/3d_wireframe/index.html

// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function randomIntFromInterval(min,max) {
	return Math.floor(Math.random()*(max-min+1)+min);
};

function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
};

// map() function in P5 or Processing:
// 'value' is converted from a value in the range of low1 to high1 into a value that ranges from low2 to high2.
// https://stackoverflow.com/questions/5649803/remap-or-map-function-in-javascript
function map_range(value, low1, high1, low2, high2) {
	return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
};


// Rotate shape around the z-axis
function rotateZ3D(theta,nodes) {
    var sinTheta = Math.sin(theta);
    var cosTheta = Math.cos(theta);

    for (var n=0; n<nodes.length; n++) {
        var node = nodes[n];
        var x = node[0];
        var y = node[1];
        node[0] = x * cosTheta - y * sinTheta;
        node[1] = y * cosTheta + x * sinTheta;
    }
};

// Rotate shape around the y-axis
function rotateY3D(theta,nodes) {
    var sinTheta = Math.sin(-theta);
    var cosTheta = Math.cos(-theta);

    for (var n=0; n<nodes.length; n++) {
        var node = nodes[n];
        var x = node[0];
        var z = node[2];
        node[0] = x * cosTheta - z * sinTheta;
        node[2] = z * cosTheta + x * sinTheta;
    }
};

// Rotate shape around the x-axis
function rotateX3D(theta,nodes) {
    var sinTheta = Math.sin(-theta);
    var cosTheta = Math.cos(-theta);

    for (var n=0; n<nodes.length; n++) {
        var node = nodes[n];
        var y = node[1];
        var z = node[2];
        node[1] = y * cosTheta - z * sinTheta;
        node[2] = z * cosTheta + y * sinTheta;
    }
};

// rotate with mouse/finger
function mouseDragged() {
    var dx = mouseX - pmouseX;
    var dy = mouseY - pmouseY;

    for (var shapeNum = 0; shapeNum < shapes.length; shapeNum++) {
        nodes = shapes[shapeNum].nodes;
        rotateY3D((mouseX - pmouseX) * Math.PI / 180,nodes);
        rotateX3D((mouseY - pmouseY) * Math.PI / 180,nodes);
    }
};

function makeCuboid(xCenter,yCenter,zCenter,xLength,yLength,zLength,rx,ry,rz) {

	var nodes = [];
	var edges = [];

	var node0 = [-xLength + xCenter, -yLength + yCenter, -zLength + zCenter];
	var node1 = [-xLength + xCenter, -yLength + yCenter,  zLength + zCenter];
	var node2 = [-xLength + xCenter,  yLength + yCenter, -zLength + zCenter];
	var node3 = [-xLength + xCenter,  yLength + yCenter,  zLength + zCenter];
	var node4 = [ xLength + xCenter, -yLength + yCenter, -zLength + zCenter];
	var node5 = [ xLength + xCenter, -yLength + yCenter,  zLength + zCenter];
	var node6 = [ xLength + xCenter,  yLength + yCenter, -zLength + zCenter];
	var node7 = [ xLength + xCenter,  yLength + yCenter,  zLength + zCenter];
	nodes = [node0, node1, node2, node3, node4, node5, node6, node7];

	var edge0  = [0, 1];
	var edge1  = [1, 3];
	var edge2  = [3, 2];
	var edge3  = [2, 0];
	var edge4  = [4, 5];
	var edge5  = [5, 7];
	var edge6  = [7, 6];
	var edge7  = [6, 4];
	var edge8  = [0, 4];
	var edge9  = [1, 5];
	var edge10 = [2, 6];
	var edge11 = [3, 7];
	edges = [edge0, edge1, edge2, edge3, edge4, edge5, edge6, edge7, edge8, edge9, edge10, edge11];

	rotateZ3D(rz * Math.PI / 180,nodes);
	rotateY3D(ry * Math.PI / 180,nodes);
	rotateX3D(rx * Math.PI / 180,nodes);
	this.nodes = nodes;
	this.edges = edges;
};

function makeCylinder(xCenter,yCenter,zCenter,r,h,rx,ry,rz) {
	var dAlpha = 0.1;
	// creating the nodes
	var nodes = [];
	var alpha = 0;
	var i = 0;
	while (alpha <= 2 * Math.PI + dAlpha) {
	  var x = r*Math.cos(alpha) + xCenter;
	  var z = r*Math.sin(alpha) + zCenter;
	  nodes[i]=[x,yCenter+h/2, z];
	  nodes[i+1]=[x,yCenter-h/2, z];
	  alpha += dAlpha;
	  i += 2;
	}
	// creating the edges
	var edges = [];
	var p = 0;
	var q = 0;
	for (var n = 0; n < nodes.length/2 - 1; n++ ) {
		edges[q] = [p,p+1];
		edges[q+1] = [p+1,p+3];
		edges[q+2] = [p+3,p+2];
		edges[q+3] = [p+2,p];
		p+=2;
		q+=4;
	}
	rotateZ3D(rz * Math.PI / 180,nodes);
	rotateY3D(ry * Math.PI / 180,nodes);
	rotateX3D(rx * Math.PI / 180,nodes);
	this.nodes = nodes;
	this.edges = edges;
};

function makeSphere(xCenter,yCenter,zCenter,r) {
var yIncr = 5;
var angleIncr = 0.3;
var nodes = [];
var edges = [];
var j = 0;
var nLo = 0; // number of lines of longitude
var nLa = 0; // number of lines of latitude

    // create nodes and lines of latitude of half sphere
	for ( var y1 = r; y1 >= 0; y1 -= yIncr ) {
	var r_this = Math.sqrt(Math.pow(r,2) - Math.pow(y1,2));
	var i = 0;
		for ( var angle = 0; angle < 2 * Math.PI; angle += angleIncr ) {
			var x = Math.cos(angle) * r_this + xCenter;
			var z = Math.sin(angle) * r_this + zCenter;
			var y = y1 + yCenter;
			nodes[j] = [x,y,z];
			if (i==0) { var p = j; }
			else { edges[j] = [j,j-1]; }
			i++;
			j++;
		}
	nLo = i; //number of lines of longitude
	nLa++;   //number of lines of latitude
	edges[p] = [j-1,p];
	}
    // create nodes and lines of latitude of other half sphere
	for ( var y1 = -yIncr; y1 >= -r; y1 -= yIncr ) {
	var r_this = Math.sqrt(Math.pow(r,2) - Math.pow(y1,2));
	var i = true;
		for ( var angle = 0; angle < 2 * Math.PI; angle += angleIncr ) {
			var x = Math.cos(angle) * r_this + xCenter;
			var z = Math.sin(angle) * r_this + zCenter;
			var y = y1 + yCenter;
			nodes[j] = [x,y,z];
			if (i==true) { var p = j; }
			else { edges[j] = [j,j-1]; }
			i = false;
			j++;
		}
	nLa++;   //number of lines of latitude
	edges[p] = [j-1,p];
	}
	// create lines of longitude
	var t = 0;
	for (var s=0; s < nLo; s++) {
		t = s;
		for (var q=0; q < nLa-1; q++) {
  		var tn = t;
	  	t += nLo;
		  edges[j] = [t,tn];
		  j++;
		}
	}
	this.nodes = nodes;
	this.edges = edges;
};
