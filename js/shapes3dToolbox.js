/*
 * Some functions of this small toolbox are largely inspired by the project Phoria.js of Kevin Roast
 *    => http://www.kevs3d.co.uk/dev/phoria/
 * Cone, Cylinder2, Sphere2, Cuboid2 are largely inspired by algorithms of Frido Verweij
 *    => https://librayRot.fridoverweij.com/codelab/
 * Functions rotateX3D, rotateXYD and rotateZ3D largely inspired by the tutorial of Peter Collingridge
 *    https://petercollingridge.appspot.com/3D-tutorial/rotating-objects
 * Mollusc shell, great creature, great sphere and a beautiful rose
 *    => https://echarts.apache.org/examples/en/editor.html
 * For the function excavateShape, I rewritten in Javascript an algorithm excerpt from the book
 *  "Graphisme 3D en Turbo Pascal", Gérald Grandpierre and Richard Cotté, édiTests 1988
 */

var shapes3dToolbox = (function () {
    "use strict";

    // shortcuts to Math Functions
    /*
    const abs = Math.abs;
    const sin = Math.sin;
    const cos = Math.cos;
    const tan = Math.tan;
    const sqrt = Math.sqrt;
    const PI = Math.PI;
    */
    const {
        cos, sin, PI, tan, sqrt, abs, pow
    } = Math;

    const TAU = PI * 2;
    const DEG_TO_RAD = PI / 180;

    const degToRad = angle => angle * DEG_TO_RAD;
    const radToDeg = angle => angle * ( 180 / PI );

    /**
     * Cube generator
     * @param config.scale
     * @param config.xRot
     * @param config.yRot
     * @param config.zRot
     */
    function generateCube(config) {
        var s = config.scale || 1;
        var xRot = config.xRot || null;
        var yRot = config.yRot || null;
        var zRot = config.zRot || null;

        var nodes = [{
            x: -1 * s,
            y: 1 * s,
            z: -1 * s
        }, {
            x: 1 * s,
            y: 1 * s,
            z: -1 * s
        }, {
            x: 1 * s,
            y: -1 * s,
            z: -1 * s
        }, {
            x: -1 * s,
            y: -1 * s,
            z: -1 * s
        }, {
            x: -1 * s,
            y: 1 * s,
            z: 1 * s
        }, {
            x: 1 * s,
            y: 1 * s,
            z: 1 * s
        }, {
            x: 1 * s,
            y: -1 * s,
            z: 1 * s
        }, {
            x: -1 * s,
            y: -1 * s,
            z: 1 * s
        }];

        rotateZ3D(zRot, nodes, true);
        rotateY3D(yRot, nodes, true);
        rotateX3D(xRot, nodes, true);

        return {
            points: nodes,
            edges: [{
                a: 0,
                b: 1
            }, {
                a: 1,
                b: 2
            }, {
                a: 2,
                b: 3
            }, {
                a: 3,
                b: 0
            }, {
                a: 4,
                b: 5
            }, {
                a: 5,
                b: 6
            }, {
                a: 6,
                b: 7
            }, {
                a: 7,
                b: 4
            }, {
                a: 0,
                b: 4
            }, {
                a: 1,
                b: 5
            }, {
                a: 2,
                b: 6
            }, {
                a: 3,
                b: 7
            }],
            polygons: [
                [0, 1, 2, 3],
                [1, 5, 6, 2],
                [5, 4, 7, 6],
                [4, 0, 3, 7],
                [4, 5, 1, 0],
                [3, 2, 6, 7]
            ]
        }
    }

    /**
     * Pyramid generator
     * @param config.scale
     * @param config.xRot
     * @param config.yRot
     * @param config.zRot
     */
    function generatePyramid(config) {
        var s = config.scale || 1;
        var xRot = config.xRot || null;
        var yRot = config.yRot || null;
        var zRot = config.zRot || null;

        var nodes = [{
            x: -1 * s,
            y: 0,
            z: -1 * s
        }, {
            x: -1 * s,
            y: 0,
            z: 1 * s
        }, {
            x: 1 * s,
            y: 0,
            z: 1 * s
        }, {
            x: 1 * s,
            y: 0 * s,
            z: -1 * s
        }, {
            x: 0,
            y: 1.5 * s,
            z: 0
        }];

        rotateZ3D(zRot, nodes, true);
        rotateY3D(yRot, nodes, true);
        rotateX3D(xRot, nodes, true);

        return {
            points: nodes,
            edges: [{
                a: 0,
                b: 1
            }, {
                a: 1,
                b: 2
            }, {
                a: 2,
                b: 3
            }, {
                a: 3,
                b: 0
            }, {
                a: 0,
                b: 4
            }, {
                a: 1,
                b: 4
            }, {
                a: 2,
                b: 4
            }, {
                a: 3,
                b: 4
            }],
            polygons: [
                [0, 1, 4],
                [1, 2, 4],
                [2, 3, 4],
                [3, 0, 4],
                [3, 2, 1, 0]
            ]
        }
    }

    /**
     * Tetrahedron generator
     * @param config.scale
     * @param config.xRot
     * @param config.yRot
     * @param config.zRot
     */
    function generateTetrahedron(config) {
        var s = config.scale || 100;
        var xRot = config.xRot || null;
        var yRot = config.yRot || null;
        var zRot = config.zRot || null;

        var nodes = [{
            x: 1 * s,
            y: 1 * s,
            z: 1 * s
        }, {
            x: 1 * s,
            y: -1 * s,
            z: -1 * s
        }, {
            x: -1 * s,
            y: 1 * s,
            z: -1 * s
        }, {
            x: -1 * s,
            y: -1 * s,
            z: 1 * s
        }, {
            x: -1 * s,
            y: -1 * s,
            z: -1 * s
        },{
            x: -1 * s,
            y: 1 * s,
            z: 1 * s
        },{
            x: 1 * s,
            y: -1 * s,
            z: 1 * s
        },{
            x: 1 * s,
            y: 1 * s,
            z: -1 * s
        }
        ];

        rotateZ3D(zRot, nodes, true);
        rotateY3D(yRot, nodes, true);
        rotateX3D(xRot, nodes, true);

        return {
            points: nodes,
            edges: [{
                a: 4,
                b: 3
            }, {
                a: 3,
                b: 5
            }, {
                a: 5,
                b: 2
            }, {
                a: 2,
                b: 4
            }, {
                a: 1,
                b: 6
            }, {
                a: 6,
                b: 0
            }, {
                a: 4,
                b: 1
            }, {
                a: 3,
                b: 6
            }, {
                a: 5,
                b: 0
            }],
            polygons: [
                [0, 1, 2],
                [1, 2, 3],
                [0, 2, 3],
                [0, 1, 3]
            ]
        }
    }

    /**
     * Cone generator
     * @param config.scale
     * @param config.radius
     * @param config.length
     * @param config.xRot
     * @param config.yRot
     * @param config.zRot
     */
    function generateCone(config) {
        var scale = config.scale || 1;
        var radius = config.radius || 100;
        var height = config.height || 200;
        var xRot = config.xRot || null;
        var yRot = config.yRot || null;
        var zRot = config.zRot || null;

        var nodes = [];
        var edges = [];
        var faces = [];

        var mid_height = height / 2;

        //creating nodes
        var alpha = 0;
        var dAlpha = 0.1;
        nodes[0] = [0,-mid_height,0];
        var i = 1;
        var limit = TAU + dAlpha;
        while (alpha <= limit) {
            let x = radius * cos(alpha) * scale;
            let z = radius * sin(alpha) * scale;
            nodes[i] = [x, mid_height, z];
            alpha += dAlpha;
            i += 1;
        }
        //creating faces
        var p = 0;
        for (let n = 0, nmax = nodes.length - 1; n < nmax; n++ ) {
            let edge = [nodes[0], nodes[p]];
            //let face = [nodes[0], nodes[p], nodes[p+1]];
            let face = [0, p, p+1];
            faces.push(face);
            edges.push(edge);
            p += 1;
        }

        rotateZ3D(zRot, nodes);
        rotateY3D(yRot, nodes);
        rotateX3D(xRot, nodes);

        return {
            points: nodes.map(item => { return { x: item[0], y: item[1], z:item[2] }}),
            edges: edges.map(item => { return { a: item[0], b: item[1] }}),
            polygons: faces
        }
    }

    /**
     * Conical Frustum generator
     * @param config.scale
     * @param config.radius
     * @param config.length
     * @param config.xRot
     * @param config.yRot
     * @param config.zRot
     */
    function generateConicalFrustum(config) {
        var scale = config.scale || 1;
        var radiusTop = config.radiusTop || 50;
        var radiusBottom = config.radiusBottom || 100;
        var heightTop = config.heightTop || 50;
        var heightBottom = config.heightBottom || 200;
        var xRot = config.xRot || null;
        var yRot = config.yRot || null;
        var zRot = config.zRot || null;
        var crossing = config.crossing || false;

        var nodes = [];
        var edges = [];
        var faces = [];

        //creating nodes
        var alpha = 0;
        var dAlpha = 0.1;

        var i = 0;
        var limit = TAU + dAlpha;
        while (alpha <= limit) {
            let x = radiusTop * cos(alpha) * scale;
            let z = radiusTop * sin(alpha) * scale;
            nodes[i] = [x, heightTop, z];
            i += 1;
            x = radiusBottom * cos(alpha) * scale;
            z = radiusBottom * sin(alpha) * scale;
            nodes[i] = [x, heightBottom, z];
            alpha += dAlpha;
            i += 1;
        }
        //creating faces
        var p = 0;
        for (let n = 0, nmax = nodes.length; n < nmax; n+=2 ) {
            let edge = [nodes[n], nodes[n+1]];
            //let face = [nodes[0], nodes[p], nodes[p+1]];
            if (n > 1) {
                let face;
                if (crossing) {
                    face = [n-2, n-1, n, n+1];
                } else {
                    face = [n-2, n-1, n+1, n];
                }
                faces.push(face);
            }
            edges.push(edge);
        }

        rotateZ3D(zRot, nodes);
        rotateY3D(yRot, nodes);
        rotateX3D(xRot, nodes);

        return {
            points: nodes.map(item => { return { x: item[0], y: item[1], z:item[2] }}),
            edges: edges.map(item => { return { a: item[0], b: item[1] }}),
            polygons: faces
        }
    }

    /**
     * Icosahedron generator
     * @param config.scale
     * @param config.xRot
     * @param config.yRot
     * @param config.zRot
     */
    function generateIcosahedron(config) {
        var s = config.scale || 1;
        var xRot = config.xRot || null;
        var yRot = config.yRot || null;
        var zRot = config.zRot || null;

        var t = (1 + sqrt(5)) / 2,
            tau = (t / sqrt(1 + t * t)) * s,
            one = (1 / sqrt(1 + t * t)) * s;

        var nodes = [{
            x: tau,
            y: one,
            z: 0
        }, {
            x: -tau,
            y: one,
            z: 0
        }, {
            x: -tau,
            y: -one,
            z: 0
        }, {
            x: tau,
            y: -one,
            z: 0
        }, {
            x: one,
            y: 0,
            z: tau
        }, {
            x: one,
            y: 0,
            z: -tau
        }, {
            x: -one,
            y: 0,
            z: -tau
        }, {
            x: -one,
            y: 0,
            z: tau
        }, {
            x: 0,
            y: tau,
            z: one
        }, {
            x: 0,
            y: -tau,
            z: one
        }, {
            x: 0,
            y: -tau,
            z: -one
        }, {
            x: 0,
            y: tau,
            z: -one
        }];

        rotateZ3D(zRot, nodes, true);
        rotateY3D(yRot, nodes, true);
        rotateX3D(xRot, nodes, true);

        return {
            points: nodes,
            edges: [{
                a: 4,
                b: 8
            }, {
                a: 8,
                b: 7
            }, {
                a: 7,
                b: 4
            }, {
                a: 7,
                b: 9
            }, {
                a: 9,
                b: 4
            }, {
                a: 5,
                b: 6
            }, {
                a: 6,
                b: 11
            }, {
                a: 11,
                b: 5
            }, {
                a: 5,
                b: 10
            }, {
                a: 10,
                b: 6
            }, {
                a: 0,
                b: 4
            }, {
                a: 4,
                b: 3
            }, {
                a: 3,
                b: 0
            }, {
                a: 3,
                b: 5
            }, {
                a: 5,
                b: 0
            }, {
                a: 2,
                b: 7
            }, {
                a: 7,
                b: 1
            }, {
                a: 1,
                b: 2
            }, {
                a: 1,
                b: 6
            }, {
                a: 6,
                b: 2
            }, {
                a: 8,
                b: 0
            }, {
                a: 0,
                b: 11
            }, {
                a: 11,
                b: 8
            }, {
                a: 11,
                b: 1
            }, {
                a: 1,
                b: 8
            }, {
                a: 9,
                b: 10
            }, {
                a: 10,
                b: 3
            }, {
                a: 3,
                b: 9
            }, {
                a: 9,
                b: 2
            }, {
                a: 2,
                b: 10
            }],
            polygons: [
                [4, 8, 7],
                [4, 7, 9],
                [5, 6, 11],
                [5, 10, 6],
                [0, 4, 3],
                [0, 3, 5],
                [2, 7, 1],
                [2, 1, 6],
                [8, 0, 11],
                [8, 11, 1],
                [9, 10, 3],
                [9, 2, 10],
                [8, 4, 0],
                [11, 0, 5],
                [4, 9, 3],
                [5, 3, 10],
                [7, 8, 1],
                [6, 1, 11],
                [7, 2, 9],
                [6, 10, 2]
            ]
        }
    }

    /**
     * Cylinder generator version 1
     * @param config.radius
     * @param config.length
     * @param config.strips
     * @param config.xRot
     * @param config.yRot
     * @param config.zRot
     */
    function generateCylinder1(config) {

        var radius = config.radius || 50;
        var length = config.length || 200;
        var strips = config.strips || 5;
        var xRot = config.xRot || null;
        var yRot = config.yRot || null;
        var zRot = config.zRot || null;

        var points = [],
            polygons = [],
            edges = [];
        var inc = TAU / strips;
        for (var s = 0, offset = 0; s <= strips; s++) {
            points.push({
                x: cos(offset) * radius,
                z: sin(offset) * radius,
                y: length / 2
            });
            points.push({
                x: cos(offset) * radius,
                z: sin(offset) * radius,
                y: -length / 2
            });
            offset += inc;
            if (s !== 0) {
                polygons.push([s * 2 - 2, s * 2, s * 2 + 1, s * 2 - 1]);
                edges.push({
                    a: s * 2,
                    b: s * 2 - 2
                }, {
                    a: s * 2 - 2,
                    b: s * 2 - 1
                }, {
                    a: s * 2 + 1,
                    b: s * 2 - 1
                });
                if (s === strips - 1) {
                    var vs = [];
                    for (let i = strips; i >= 0; i--) {
                        vs.push(i * 2)
                    }
                    polygons.push(vs);
                    vs = [];
                    for (let i = 0; i < strips; i++) {
                        vs.push(i * 2 + 1)
                    }
                    polygons.push(vs);
                }
            }
        }

        rotateZ3D(zRot, points, true);
        rotateY3D(yRot, points, true);
        rotateX3D(xRot, points, true);

        return {
            points: points,
            edges: edges,
            polygons: polygons
        }
    }

    /**
     * Cylinder generator version 2
     * (algorithm by Frido Verweij)
     * @param config.xCenter
     * @param config.yCenter
     * @param config.zCenter
     * @param config.radius
     * @param config.length
     * @param config.xRot
     * @param config.yRot
     * @param config.zRot
     * @param config.crossing (default : true)
     * @returns {{polygons: Array, edges: {a: *, b: *}[], points: {x: *, y: *, z: *}[]}}
     */
    function generateCylinder2(config) {
        // xCenter,yCenter,zCenter,r,h,xRot,yRot,zRot
        var xCenter = config.xCenter || 0;
        var yCenter = config.yCenter || 0;
        var zCenter = config.zCenter || 0;

        var radius = config.radius || 100;
        var length = config.length || 200;

        var xRot = config.xRot || null;
        var yRot = config.yRot || null;
        var zRot = config.zRot || null;

        var crossing = config.crossing || true;

        // creating the nodes
        var nodes = [];
        var dAlpha = 0.1;
        var alpha = 0;
        var i = 0;
        var mid_length = length/2;
        while (alpha <= TAU + dAlpha) {
            let x = radius * cos(alpha) + xCenter;
            let z = radius * sin(alpha) + zCenter;
            nodes[i] = [x, yCenter + mid_length, z];
            nodes[i+1] = [x, yCenter - mid_length, z];
            alpha += dAlpha;
            i += 2;
        }
        // creating the edges
        var edges = [];
        var p = 0;
        var q = 0;
        for (let n = 0, nmax=nodes.length/2 - 1; n < nmax; n++ ) {
            edges[q] = [p, p+1];
            edges[q+1] = [p+1, p+3];
            edges[q+2] = [p+3, p+2];
            edges[q+3] = [p+2, p];
            p += 2;
            q += 4;
        }

        rotateZ3D(zRot, nodes);
        rotateY3D(yRot, nodes);
        rotateX3D(xRot, nodes);

        let mesh = generateMesh(edges, crossing);

        return {
            points: nodes.map(item => { return { x: item[0], y: item[1], z:item[2] }}),
            edges: edges.map(item => { return { a: item[0], b: item[1] }}),
            polygons: mesh
        }
    }

    /**
     * Cuboid generator version 1
     * @param config.xScale
     * @param config.yScale
     * @param config.zScale
     * @param config.xRot
     * @param config.yRot
     * @param config.zRot
     */
    function generateCuboid1(config) {
        var xScale = config.xScale || 1,
            yScale = config.yScale || 1,
            zScale = config.zScale || 1;

        var xRot = config.xRot || null;
        var yRot = config.yRot || null;
        var zRot = config.zRot || null;

        var nodes = [{
            x: -1 * xScale,
            y: 1 * yScale,
            z: -1 * zScale
        }, {
            x: 1 * xScale,
            y: 1 * yScale,
            z: -1 * zScale
        }, {
            x: 1 * xScale,
            y: -1 * yScale,
            z: -1 * zScale
        }, {
            x: -1 * xScale,
            y: -1 * yScale,
            z: -1 * zScale
        }, {
            x: -1 * xScale,
            y: 1 * yScale,
            z: 1 * zScale
        }, {
            x: 1 * xScale,
            y: 1 * yScale,
            z: 1 * zScale
        }, {
            x: 1 * xScale,
            y: -1 * yScale,
            z: 1 * zScale
        }, {
            x: -1 * xScale,
            y: -1 * yScale,
            z: 1 * zScale
        }];

        rotateZ3D(zRot, nodes, true);
        rotateY3D(yRot, nodes, true);
        rotateX3D(xRot, nodes, true);

        return {
            points: nodes,
            edges: [{
                a: 0,
                b: 1
            }, {
                a: 1,
                b: 2
            }, {
                a: 2,
                b: 3
            }, {
                a: 3,
                b: 0
            }, {
                a: 4,
                b: 5
            }, {
                a: 5,
                b: 6
            }, {
                a: 6,
                b: 7
            }, {
                a: 7,
                b: 4
            }, {
                a: 0,
                b: 4
            }, {
                a: 1,
                b: 5
            }, {
                a: 2,
                b: 6
            }, {
                a: 3,
                b: 7
            }],
            polygons: [
                [0, 1, 2, 3],
                [0, 4, 5, 1],
                [1, 5, 6, 2],
                [2, 6, 7, 3],
                [4, 0, 3, 7],
                [5, 4, 7, 6]
            ]
        }
    }

    /**
     * Cuboid generator version 2
     * @param config.xCenter
     * @param config.yCenter
     * @param config.zCenter
     * @param config.xLength
     * @param config.yLength
     * @param config.zLength
     * @param config.xRot
     * @param config.yRot
     * @param config.zRot
     * @param config.crossing (default : false)
     * @returns {{polygons: Array, edges: {a: *, b: *}[], points: {x: *, y: *, z: *}[]}}
     */
    function generateCuboid2(config) {
        var xCenter = config.xCenter || 0;
        var yCenter = config.yCenter || 0;
        var zCenter = config.zCenter || 0;
        var xLength = config.xLength || 100;
        var yLength = config.yLength || 20;
        var zLength = config.zLength || 50;
        var crossing = config.crossing || false;

        var xRot = config.xRot || null;
        var yRot = config.yRot || null;
        var zRot = config.zRot || null;

        var nodes = [];
        var edges = [];

        nodes.push([-xLength + xCenter, -yLength + yCenter, -zLength + zCenter]);
        nodes.push([-xLength + xCenter, -yLength + yCenter,  zLength + zCenter]);
        nodes.push([-xLength + xCenter,  yLength + yCenter, -zLength + zCenter]);
        nodes.push([-xLength + xCenter,  yLength + yCenter,  zLength + zCenter]);
        nodes.push([ xLength + xCenter, -yLength + yCenter, -zLength + zCenter]);
        nodes.push([ xLength + xCenter, -yLength + yCenter,  zLength + zCenter]);
        nodes.push([ xLength + xCenter,  yLength + yCenter, -zLength + zCenter]);
        nodes.push([ xLength + xCenter,  yLength + yCenter,  zLength + zCenter]);

        edges.push([0, 1]);
        edges.push([1, 3]);
        edges.push([3, 2]);
        edges.push([2, 0]);
        edges.push([4, 5]);
        edges.push([5, 7]);
        edges.push([7, 6]);
        edges.push([6, 4]);
        edges.push([0, 4]);
        edges.push([1, 5]);
        edges.push([2, 6]);
        edges.push([3, 7]);

        rotateZ3D(zRot, nodes);
        rotateY3D(yRot, nodes);
        rotateX3D(xRot, nodes);

        let mesh = generateMesh(edges, crossing);

        return {
            points: nodes.map(item => { return { x: item[0], y: item[1], z:item[2] }}),
            edges: edges.map(item => { return { a: item[0], b: item[1] }}),
            polygons: mesh
        }
    }

    /**
     * Cuboid generator version 3
     * @param config.scale
     * @param config.size
     * @param config.xTranslate
     * @param config.yTranslate
     * @param config.zTranslate
     * @param config.xRot
     * @param config.yRot
     * @param config.zRot
     */
    function generateCuboid3(config) {
        var size = config.size || 1,
            scale = config.scale || 1,
            xTranslate = config.xTranslate || 0,
            yTranslate = config.yTranslate || 0,
            zTranslate = config.zTranslate || 0;

        var xRot = config.xRot || null;
        var yRot = config.yRot || null;
        var zRot = config.zRot || null;

        var tmpnodes = [{
            x: size * scale,
            y: 0 * scale,
            z: size  * scale
        }, {
            x: size * scale,
            y: size * scale,
            z: size * scale
        }, {
            x: 0 * scale,
            y: size * scale,
            z: size * scale
        }, {
            x: 0 * scale,
            y: 0 * scale,
            z: size * scale
        }, {
            x: size * scale,
            y: 0 * scale,
            z: 0 * scale
        }, {
            x: size * scale,
            y: size * scale,
            z: 0 * scale
        }, {
            x: 0 * scale,
            y: size * scale,
            z: 0 * scale
        }, {
            x: 0 * scale,
            y: 0 * scale,
            z: 0 * scale
        }];

        var nodes = [];
        if (xTranslate != 0 || yTranslate != 0 || zTranslate != 0) {
            nodes = tmpnodes.map(item => {
                return {x: item.x + xTranslate, y: item.y + yTranslate, z:item.z + zTranslate};
            });
        } else {
            nodes = tmpnodes;
        }

        var polygons = [];
        polygons.push([0,1,2,3]);
        polygons.push([0,4,5,1]);
        polygons.push([1,5,6,2]);
        polygons.push([2,6,7,3]);
        polygons.push([3,7,4,0]);
        polygons.push([7,6,5,4]);

        var edges = [];
        for (let i=0, imax=polygons.length; i<imax; i++) {
            let a = polygons[i];
            let b = polygons[i+1];
            edges.push({a:a, b:b });
        }

        rotateZ3D(zRot, nodes, true);
        rotateY3D(yRot, nodes, true);
        rotateX3D(xRot, nodes, true);

        return {
            points: nodes,
            edges: edges,
            polygons: polygons
        }
    }

    /**
     * Cuboid generator version 4
     * @param config.nodes
     * @param config.scale
     * @param config.xTranslate
     * @param config.yTranslate
     * @param config.zTranslate
     * @param config.xRot
     * @param config.yRot
     * @param config.zRot
     */
    function generateCuboid4(config) {
        var scale = config.scale || 1,
            xTranslate = config.xTranslate || 0,
            yTranslate = config.yTranslate || 0,
            zTranslate = config.zTranslate || 0;

        var xRot = config.xRot || null;
        var yRot = config.yRot || null;
        var zRot = config.zRot || null;

        var nodes = config.nodes.map(node => {
            return {x: node.x * scale + xTranslate * scale,
                y: node.y * scale + yTranslate * scale,
                z: node.z * scale + zTranslate * scale
            }});

        var polygons = [];
        polygons.push([0,1,2,3]);
        polygons.push([0,4,5,1]);
        polygons.push([1,5,6,2]);
        polygons.push([2,6,7,3]);
        polygons.push([3,7,4,0]);
        polygons.push([7,6,5,4]);

        var edges = [];
        for (let i=0, imax=polygons.length; i<imax; i++) {
            let a = polygons[i];
            let b = polygons[i+1];
            edges.push({a:a, b:b });
        }

        rotateZ3D(zRot, nodes, true);
        rotateY3D(yRot, nodes, true);
        rotateX3D(xRot, nodes, true);

        return {
            points: nodes,
            edges: edges,
            polygons: polygons
        }
    }

    /**
     * Rescale coordinates of a mesh
     * @param nodes
     * @param scale
     */
    function rescale(nodes, scale) {
        if (scale == 1) return;
        for (let i=0, imax=nodes.length; i<imax ; i++) {
            let node = nodes[i];
            node.x = node.x * scale;
            node.y = node.y * scale;
            node.z = node.z * scale;
        }
    }

    /**
     * Icosahedron generator 2
     * @param config.scale (default: 1)
     * @param config.side (default : 10)
     * @param config.xRot
     * @param config.yRot
     * @param config.zRot
     */
    function generateIcosahedron2(config) {
        var scale = config.scale || 1;

        var xRot = config.xRot || null;
        var yRot = config.yRot || null;
        var zRot = config.zRot || null;

        var nb_vertices = 12;

        var side = config.side || 10;
        var h = side / sqrt(5);
        var co = cos(TAU / 5);
        var si = sin(TAU / 5);

        var nodes = [];
        nodes.push({x: 0, y:0, z:-side});
        nodes.push({x: 2*h, y:0, z:-h});

        for (let i=nodes.length; i<6 ; i++) {
            let x = co * nodes[i-1].x - si * nodes[i-1].y;
            let y = si * nodes[i-1].x + co * nodes[i-1].y;
            let z = -h;
            nodes[i] = {x:x, y:y, z:z};
        }

        for (let i=nodes.length; i<=nb_vertices ; i++) {
            let x = -nodes[i-6].x;
            let y = -nodes[i-6].y;
            let z = -nodes[i-6].z;
            nodes[i] = {x:x, y:y, z:z};
        }

        if (scale != 1) {
            rescale(nodes, scale);
        }

        // 20 faces
        var polygons = [];
        polygons.push([2, 1, 0]);
        polygons.push([3, 2, 0]);
        polygons.push([4, 3, 0]);
        polygons.push([5, 4, 0]);
        polygons.push([1, 5, 0]);
        polygons.push([1, 2, 10]);
        polygons.push([2, 3, 11]);
        polygons.push([3, 4, 7]);
        polygons.push([4, 5, 8]);
        polygons.push([5,1,9]);
        polygons.push([10,9,1]);
        polygons.push([11,10,2]);
        polygons.push([7,11,3]);
        polygons.push([8,7,4]);
        polygons.push([9,8,5]);
        polygons.push([9,10,6]);
        polygons.push([10,11,6]);
        polygons.push([11,7,6]);
        polygons.push([7,8,6]);
        polygons.push([8,9,6]);

        var edges = [];
        for (let i=0, imax=polygons.length; i<imax; i++) {
            let a = polygons[i];
            let b = polygons[i+1];
            edges.push({a:a, b:b });
        }

        rotateZ3D(zRot, nodes, true);
        rotateY3D(yRot, nodes, true);
        rotateX3D(xRot, nodes, true);

        return {
            points: nodes,
            edges: edges,
            polygons: polygons
        }
    }

    /**
     * Dodecahedron generator
     * Warning : algorithm slightly buggy, but result interesting
     * @param config.scale (default: 1)
     * @param config.xRot
     * @param config.yRot
     * @param config.zRot
     * @returns {{polygons: [], edges: [], points: []}}
     */
    function generateDodecahedron(config) {
        var scale = config.scale || 1;

        var xRot = config.xRot || null;
        var yRot = config.yRot || null;
        var zRot = config.zRot || null;

        var nb_vertices = 20;

        var co = cos(TAU / 5);
        var si = sin(TAU / 5);

        var nodes = [];
        nodes.push({x: 3.9027346442, y:-2.8355026945, z:-6.3147573033});

        for (let step = 5, j=0, jmax=step*2; j<jmax; j+= step) {
            for (let i = j + 1, imax = j + 5; i < imax; i++) {
                let x = co * nodes[i - 1].x - si * nodes[i - 1].y;
                let y = si * nodes[i - 1].x + co * nodes[i - 1].y;
                let z = nodes[i - 1].z;
                nodes[i] = {x: x, y: y, z: z};
            }
            if (j == 0) {
                nodes.push({x: 6.3147573033, y: 4.5879397349, z: -1.4907119850});
            }
        }

        for (let i=nodes.length; i<nb_vertices ; i++) {
            let t = nb_vertices - i - 1;
            let x = -nodes[t].x;
            let y = -nodes[t].y;
            let z = -nodes[t].z;
            nodes[i] = {x:x, y:y, z:z};
        }

        if (scale != 1) {
            rescale(nodes, scale);
        }

        var polygons = [];
        polygons.push([4, 3, 2, 1, 0]);
        polygons.push([0, 1, 6, 11, 5]);
        polygons.push([1, 2, 7, 10, 6]);
        polygons.push([2, 3, 8, 14, 7]);
        polygons.push([3, 4, 9, 13, 8]);
        polygons.push([4, 0, 5, 12, 9]);
        polygons.push([5, 11, 16, 17, 12]);
        polygons.push([6, 10, 15, 16, 11]);
        polygons.push([7, 14, 19, 15, 10]);
        polygons.push([8, 13, 18, 19, 14]);
        polygons.push([9, 12, 17, 18, 13]);
        polygons.push([19, 18, 17, 16, 15]);

        var edges = [];
        for (let i=0, imax=polygons.length; i<imax; i++) {
            let a = polygons[i];
            let b = polygons[i+1];
            edges.push({a:a, b:b });
        }

        rotateZ3D(zRot, nodes, true);
        rotateY3D(yRot, nodes, true);
        rotateX3D(xRot, nodes, true);

        return {
            points: nodes,
            edges: edges,
            polygons: polygons
        }
    }

    /**
     * Cuboid generator version 5
     * @param config.nodes
     * @param config.scale
     * @param config.xTranslate
     * @param config.yTranslate
     * @param config.zTranslate
     * @param config.xRot
     * @param config.yRot
     * @param config.zRot
     * @param config.triangleSize
     */
    function generateCuboid5(config) {
        var scale = config.scale || 1,
            xTranslate = config.xTranslate || 0,
            yTranslate = config.yTranslate || 0,
            zTranslate = config.zTranslate || 0;

        var xRot = config.xRot || null;
        var yRot = config.yRot || null;
        var zRot = config.zRot || null;

        var triangleSize = (config.hasOwnProperty('triangleSize') ? Number(config.triangleSize) : 10);

        var nodes = config.nodes.map(node => {
            return {x: node.x * scale + xTranslate * scale,
                y: node.y * scale + yTranslate * scale,
                z: node.z * scale + zTranslate * scale
            }});

        var polygons = [];
        polygons.push([0,1,2,3]); // same Y dimension
        polygons.push([7,6,5,4]); // same Y dimension
        polygons.push([0,4,5,1]); // same Z dimension
        polygons.push([1,5,6,2]); // same Z dimension
        polygons.push([3,7,4,0]); // same X dimension
        polygons.push([2,6,7,3]); // same X dimension

        var edges = [];

        var new_nodes = [];
        var new_polygons = [];

        function triangulateFace(coords, context) {
            let xmin = Infinity;
            let xmax = -Infinity;
            let ymin = Infinity;
            let ymax = -Infinity;
            let vertices = [];

            //console.log(coords);
            coords.forEach(node => {
                //let node = nodes[poly[num]];
                if (node.x > xmax) xmax = node.x;
                if (node.x < xmin) xmin = node.x;
                if (node.y > ymax) ymax = node.y;
                if (node.y < ymin) ymin = node.y;
            });

            let stepx = (xmax - xmin) / triangleSize;
            let stepy = (ymax - ymin) / triangleSize;
            console.log(context);
            console.log(xmin, ymin, xmax, ymax);
            console.log(stepx, stepy);
            //vertices.push([xmin, ymin]);
            for (let xi=xmin, ximax = xmax+stepx; xi<ximax; xi+=stepx ) {
                for (let yi=ymin, yimax = ymax+stepy; yi<yimax; yi+=stepy ) {
                    vertices.push([xi, yi]);
                }
            }
            return {vertices:vertices, triangles: Delaunay.triangulate(vertices)};
        }

        for (let i = 0, imax = polygons.length; i < imax; i++) {
            let poly = polygons[i];
            let same = {x:true, y:true, z:true}; // array of booleans : detectors of same values on X, Y or Z
            let vals = {x:null, y:null, z:null}; // array of coordinates : store last value of X, Y or Z

            poly.forEach((item, num) => {
                let node = nodes[poly[num]];
                if (vals.x != null && vals.x != node.x) {
                    same.x = false;
                } else {
                    vals.x = node.x;
                }
                if (vals.y != null && vals.y != node.y) {
                    same.y = false;
                } else {
                    vals.y = node.y;
                }
                if (vals.z != null && vals.z != node.z) {
                    same.z = false;
                } else {
                    vals.z = node.z;
                }
            });

            if (same.z) {
                // cancel temporarily the Z dimension
                let coords = [];
                poly.forEach((item, num) => {
                    let node = nodes[poly[num]];
                    coords.push({x:node.x, y:node.y});
                });

                let works = triangulateFace(coords, "same Z "+vals.z);
                let triangles = works.triangles;
                let vertices = works.vertices;

                for (let i=0, imax=triangles.length; i<imax; i+=3) {
                    let tpoly = [];
                    new_nodes.push({x:vertices[triangles[i]][0], y:vertices[triangles[i]][1], z:vals.z });
                    tpoly.push(new_nodes.length-1);
                    new_nodes.push({x:vertices[triangles[i+1]][0], y:vertices[triangles[i+1]][1], z:vals.z});
                    tpoly.push(new_nodes.length-1);
                    new_nodes.push({x:vertices[triangles[i+2]][0], y:vertices[triangles[i+2]][1], z:vals.z});
                    tpoly.push(new_nodes.length-1);
                    new_polygons.push(tpoly);
                }
            } else {
                if (same.x) {
                    // cancel temporarily the X dimension
                    let coords = [];
                    poly.forEach((item, num) => {
                        let node = nodes[poly[num]];
                        coords.push({x:node.y, y:node.z});
                    });

                    let works = triangulateFace(coords, "same X "+vals.x);
                    let triangles = works.triangles;
                    let vertices = works.vertices;

                    for (let i=0, imax=triangles.length; i<imax; i+=3) {
                        let tpoly = [];
                        new_nodes.push({x:vals.x, y:vertices[triangles[i]][0], z:vertices[triangles[i]][1]});
                        tpoly.push(new_nodes.length-1);
                        new_nodes.push({x:vals.x, y:vertices[triangles[i+1]][0], z:vertices[triangles[i+1]][1]});
                        tpoly.push(new_nodes.length-1);
                        new_nodes.push({x:vals.x, y:vertices[triangles[i+2]][0], z:vertices[triangles[i+2]][1]});
                        tpoly.push(new_nodes.length-1);
                        new_polygons.push(tpoly);
                    }

                } else {
                    if (same.y) {
                        // cancel temporarily the Y dimension
                        let coords = [];
                        poly.forEach((item, num) => {
                            let node = nodes[poly[num]];
                            coords.push({x:node.x, y:node.z});
                        });

                        let works = triangulateFace(coords, "same Y "+vals.y);
                        let triangles = works.triangles;
                        let vertices = works.vertices;

                        for (let i=0, imax=triangles.length; i<imax; i+=3) {
                            let tpoly = [];
                            new_nodes.push({x:vertices[triangles[i]][0], y:vals.y, z:vertices[triangles[i]][1]});
                            tpoly.push(new_nodes.length-1);
                            new_nodes.push({x:vertices[triangles[i+1]][0], y:vals.y, z:vertices[triangles[i+1]][1]});
                            tpoly.push(new_nodes.length-1);
                            new_nodes.push({x:vertices[triangles[i+2]][0], y:vals.y, z:vertices[triangles[i+2]][1]});
                            tpoly.push(new_nodes.length-1);
                            new_polygons.push(tpoly);
                        }

                    }
                }
            }
        }

        nodes = new_nodes;
        polygons = new_polygons;

        rotateZ3D(zRot, nodes, true);
        rotateY3D(yRot, nodes, true);
        rotateX3D(xRot, nodes, true);

        return {
            points: nodes,
            edges: edges,
            polygons: polygons
        }
    }

    /**
     * Generate a mesh from an array of edges
     * @param edges
     * @returns {Array}
     */
    function generateMesh(edges, crossing=true) {
        let polys = [];
        for (let i=0, imax = edges.length; i<imax; i+=2) {
            let edge1 = edges[i];
            let edge2 = edges[i+1];
            if (edge2 != undefined) {
                if (crossing) {
                    polys.push([edge1[0], edge1[1], edge2[0], edge2[1]]);
                } else {
                    polys.push([edge1[0], edge1[1], edge2[1], edge2[0]]);
                }

            }
        }
        return polys;
    }


    /**
     * Excavate a 3D shape, drawing only the edges, playing on the thickness (2, 4, 8, 10, 12, 16)
     *  and the drawing mode of edges (with or without crossing)
     * @param original.points
     * @param original.polygons
     * @param params.thickness_ratio (default 8)
     * @param params.bridge_mode (default 1)
     * @returns {{polygons: [], edges: {a: *, b: *}[], points: []}}
     */
    function excavateShape(original, params={}) {

        var ori_nodes = original.points || [];
        var ori_polys = original.polygons || [];

        var thickness_ratio = params.thickness_ratio || 8;
        var bridge_mode = params.bridge_mode || 1;

        var nb_faces = ori_polys.length;     // face

        var new_edges = [];
        var new_nodes = [];
        var new_polygons = [];

        // arbitrary precision for calculus
        var dec = 0.001;

        // calculus of thickness : will be calculated with the length of the first edge as reference
        var thickness = 0;

        var xg, yg, zg;

        if (nb_faces > 0) {
            let first = ori_nodes[ori_polys[0][0]];
            let second = ori_nodes[ori_polys[0][1]];

            let nn = sqrt(pow((first.x - second.x),2)
                        + pow((first.y - second.y),2)
                        + pow((first.z - second.z),2)) ;
            thickness = nn / thickness_ratio;
        }

        var u = 0;

        ori_polys.forEach((vertices) => {

            // isolate the points of the face to work just on it
            let points = [];
            vertices.forEach((item) => {
                points.push(ori_nodes[item]);
            });

            xg = .0;
            yg = .0;
            zg = .0;

            // determine the gravity point of the face (or polygon)
            let tmp = 1;
            points.forEach((point) => {
                xg += point.x;
                yg += point.y;
                zg += point.z;
                tmp++;
            });
            xg = xg / tmp;
            yg = yg / tmp;
            zg = zg / tmp;

            let u1 = points[0].x;
            let u2 = points[0].y;
            let u3 = points[0].z;

            // duplicate the first point at the last position of the points array, to "loop the loop" and generate a complete structure
            let last = points.length;
            points[last] = {};
            points[last].x = points[0].x;
            points[last].y = points[0].y;
            points[last].z = points[0].z;

            for (let j=1, jmax=points.length; j<jmax; j++) {
                let v1 = points[j].x;
                let v2 = points[j].y;
                let v3 = points[j].z;

                u1 += dec * (v1 - u1);
                u2 += dec * (v2 - u2);
                u3 += dec * (v3 - u3);

                v1 += dec * (u1 - v1);
                v2 += dec * (u2 - v2);
                v3 += dec * (u3 - v3);

                new_nodes[u] = {};
                new_nodes[u].x = u1 + dec * (xg - u1);
                new_nodes[u].y = u2 + dec * (yg - u2);
                new_nodes[u].z = u3 + dec * (zg - u3);

                new_nodes[u+1] = {};
                new_nodes[u+1].x = v1 + dec * (xg - v1);
                new_nodes[u+1].y = v2 + dec * (yg - v2);
                new_nodes[u+1].z = v3 + dec * (zg - v3);

                let nn = sqrt(pow((new_nodes[u].x - xg), 2)
                            + pow((new_nodes[u].y - yg), 2)
                            + pow((new_nodes[u].z - zg), 2));

                new_nodes[u+3] = {};
                new_nodes[u+3].x = new_nodes[u].x + thickness * (xg - new_nodes[u].x) / nn;
                new_nodes[u+3].y = new_nodes[u].y + thickness * (yg - new_nodes[u].y) / nn;
                new_nodes[u+3].z = new_nodes[u].z + thickness * (zg - new_nodes[u].z) / nn;

                let ref_u1 = u+1;
                nn = sqrt(pow((new_nodes[ref_u1].x - xg), 2)
                            + pow((new_nodes[ref_u1].y - yg), 2)
                            + pow((new_nodes[ref_u1].z - zg), 2));

                let ref_u2 = u+2;
                new_nodes[ref_u2] = {};
                new_nodes[ref_u2].x = new_nodes[ref_u1].x + thickness * (xg - new_nodes[ref_u1].x) / nn;
                new_nodes[ref_u2].y = new_nodes[ref_u1].y + thickness * (yg - new_nodes[ref_u1].y) / nn;
                new_nodes[ref_u2].z = new_nodes[ref_u1].z + thickness * (zg - new_nodes[ref_u1].z) / nn;

                new_edges.push([u, u+1]);
                new_edges.push([u+3, u]);
                new_edges.push([u+2, u+1]);
                new_edges.push([u+3, u+2]);

                if (bridge_mode == 3) {
                    new_polygons.push([u, u+3, u+1, u+2]);
                } else {
                    if (bridge_mode == 2) {
                        new_polygons.push([u, u+2, u+3, u+1]);
                    } else {
                        new_polygons.push([u, u+1, u+2, u+3]);
                    }
                }

                u1 = v1;
                u2 = v2;
                u3 = v3;
                u += 4;
            }
        });

        return {
            points: new_nodes,
            edges: new_edges.map(item => { return { a: item[0], b: item[1] }}),
            polygons: new_polygons
        };
    }

    /**
     * Sphere generator version 1
     * @param scale (default value : 100)
     * @param lats (default value : 20)
     * @param longs (default value : 20)
     * @param generateUVs (default value : false)
     */
    function generateSphere1(config) {
        var scale, lats, longs, generateUVs;
        scale = config.scale || 100;
        lats  = config.lats || 20;
        longs = config.longs || 20;
        generateUVs = config.generateUVs || false;
        var points = [],
            edges = [],
            polys = [],
            uvs = [];
        for (let latNumber = 0; latNumber <= lats; ++latNumber) {
            for (let longNumber = 0; longNumber <= longs; ++longNumber) {
                var theta = latNumber * PI / lats;
                var phi = longNumber * TAU / longs;
                var sinTheta = sin(theta);
                var sinPhi = sin(phi);
                var cosTheta = cos(theta);
                var cosPhi = cos(phi);
                var x = cosPhi * sinTheta;
                var y = cosTheta;
                var z = sinPhi * sinTheta;
                if (generateUVs) {
                    var u = longNumber / longs;
                    var v = latNumber / lats;
                    uvs.push({
                        u: u,
                        v: v
                    })
                }
                points.push({
                    x: scale * x,
                    y: scale * y,
                    z: scale * z
                })
            }
        }
        for (let latNumber = 0; latNumber < lats; ++latNumber) {
            for (let longNumber = 0; longNumber < longs; ++longNumber) {
                var first = (latNumber * (longs + 1)) + longNumber;
                var second = first + longs + 1;
                if (latNumber === 0) {
                    var p = [first + 1, second + 1, second];
                    if (generateUVs) {
                        p.uvs = [uvs[first + 1].u, uvs[first + 1].v, uvs[second + 1].u, uvs[second + 1].v, uvs[second].u, uvs[second].v]
                    }
                    polys.push(p);
                    edges.push({
                        a: first,
                        b: second
                    })
                } else {
                    if (latNumber === lats - 1) {
                        let p = [first + 1, second, first];
                        if (generateUVs) {
                            p.uvs = [uvs[first + 1].u, uvs[first + 1].v, uvs[second].u, uvs[second].v, uvs[first].u, uvs[first].v]
                        }
                        polys.push(p);
                        edges.push({
                            a: first,
                            b: second
                        })
                    } else {
                        let p = [first + 1, second + 1, second, first];
                        if (generateUVs) {
                            p.uvs = [uvs[first + 1].u, uvs[first + 1].v, uvs[second + 1].u, uvs[second + 1].v, uvs[second].u, uvs[second].v, uvs[first].u, uvs[first].v]
                        }
                        polys.push(p);
                        edges.push({
                            a: first,
                            b: second
                        });
                        edges.push({
                            a: second,
                            b: second + 1
                        })
                    }
                }
            }
        }
        return {
            points: points,
            edges: edges,
            polygons: polys
        }
    }

    /**
     * Sphere generator version 2
     * (algorithm by Frido Verweij)
     * @param config
     * @returns {{polygons: Array, edges: {a: *, b: *}[], points: {x: *, y: *, z: *}[]}}
     */
    function generateSphere2(config) {
        var xCenter = config.xCenter || 0;
        var yCenter = config.yCenter || 0;
        var zCenter = config.zCenter || 0;
        var radius = config.radius || 100;
        var crossing = config.crossing || false;

        var yIncr = 5;
        var angleIncr = 0.3;
        var nodes = [];
        var edges = [];

        var j = 0;
        var nLo = 0; // number of lines of longitude
        var nLa = 0; // number of lines of latitude

        // create nodes and lines of latitude of half sphere
        for ( let y1 = radius; y1 >= 0; y1 -= yIncr ) {
            let r_this = sqrt(pow(radius,2) - pow(y1,2));
            let i = 0;
            for ( let angle = 0; angle < TAU; angle += angleIncr ) {
                let x = cos(angle) * r_this + xCenter;
                let z = sin(angle) * r_this + zCenter;
                let y = y1 + yCenter;
                nodes[j] = [x,y,z];
                if (i==0) {
                    var p = j;
                } else {
                    edges[j] = [j,j-1];
                }
                i++;
                j++;
            }
            nLo = i; //number of lines of longitude
            nLa++;   //number of lines of latitude
            edges[p] = [j-1,p];
        }

        // create nodes and lines of latitude of other half sphere
        for ( let y1 = -yIncr; y1 >= -radius; y1 -= yIncr ) {
            let r_this = sqrt(pow(radius,2) - pow(y1,2));
            let i = true;
            for ( let angle = 0; angle < TAU; angle += angleIncr ) {
                let x = cos(angle) * r_this + xCenter;
                let z = sin(angle) * r_this + zCenter;
                let y = y1 + yCenter;
                nodes[j] = [x,y,z];
                if (i==true) {
                    var p = j;
                } else {
                    edges[j] = [j,j-1];
                }
                i = false;
                j++;
            }
            nLa++;   //number of lines of latitude
            edges[p] = [j-1,p];
        }
        // create lines of longitude
        var t = 0;
        for (let s=0; s < nLo; s++) {
            t = s;
            for (let q=0; q < nLa-1; q++) {
                let tn = t;
                t += nLo;
                edges[j] = [t,tn];
                j++;
            }
        }

        let mesh = generateMesh(edges, crossing);

        return {
            points: nodes.map(item => { return { x: item[0], y: item[1], z:item[2] }}),
            edges: edges.map(item => { return { a: item[0], b: item[1] }}),
            polygons: mesh
        }
    };

    /**
     * Strange fruit generator
     * @param config.scale
     * @param config.datas
     * @param config.xRot
     * @param config.yRot
     * @param config.zRot
     */
    function generateStrangeFruit(config) {
        var scale = config.scale || 1;
        var datas = config.datas || [];
        var crossing = config.crossing || false;
        var xRot = config.xRot || null;
        var yRot = config.yRot || null;
        var zRot = config.zRot || null;

        if (datas.length == 0) {
            datas.push({r: 30, z:0});
            datas.push({r: 45, z:20});
            datas.push({r: 30, z:40});
        }

        var nodes = [];
        var edges = [];
        var faces = [];

        const B = -5;
        const C = -95;

        for (let i=0, imax=datas.length; i<imax; i++) {
            let r = datas[i].r * scale;
            let z = datas[i].z * scale;
            let s = 0;
            for (let ang=0; ang<=360; ang+= 36) {
                let a_rad = ang * DEG_TO_RAD;
                let x = r * cos(a_rad);
                let y = r * sin(a_rad);

                let b_rad = (ang+B) * DEG_TO_RAD;
                let cb = cos(b_rad);
                let sb = sin(b_rad);

                let c_rad = (ang+C) * DEG_TO_RAD;
                let cc = cos(c_rad);
                let sc = sin(c_rad);

                let x1 = x * cb + z * sb;
                let y1 = y;
                let z1 = -x * sb + z * cb;

                let x2 = x1;
                let y2 = y1 * cc - z1 * sc;
                let z2 = y1 * sc + z1 * cc;

                let level_node = nodes.length;
                nodes[level_node] = [x1, y1, z1];
                nodes[level_node+1] = [x2, y2, z2];
                edges.push([level_node, level_node+1]);

                x2 = x2 + 160;
                y2 = 100 - y2;
            }
        }

        rotateZ3D(zRot, nodes);
        rotateY3D(yRot, nodes);
        rotateX3D(xRot, nodes);

        let mesh = generateMesh(edges, crossing);

        return {
            points: nodes.map(item => { return { x: item[0], y: item[1], z:item[2] }}),
            edges: edges.map(item => { return { a: item[0], b: item[1] }}),
            polygons: mesh
        }
    }

    /**
     * Diamond generator
     * @param config.scale
     * @param config.datas
     * @param config.xRot
     * @param config.yRot
     * @param config.zRot
     */
    function generateTube(config) {
        var scale = config.scale || 1;
        var datas = config.datas || [];
        var facets = config.facets || 10;
        var xRot = config.xRot || null;
        var yRot = config.yRot || null;
        var zRot = config.zRot || null;

        if (datas.length == 0) {
            // shape by default if not defined
            datas.push({r: 30, z:0});
            datas.push({r: 45, z:20});
            datas.push({r: 30, z:40});
        }

        var nodes = [];
        var edges = [];
        var faces = [];

        var points = [];
        var step = 360 / facets;

        for (let i=0, imax=datas.length; i<imax; i++) {
            let r = datas[i].r * scale;
            let z = datas[i].z * scale;
            points[i] = [];

            for (let j=0; j<= facets; j++) {
                let ang = (j * step) * DEG_TO_RAD;
                let x = r * cos(ang);
                let y = r * sin(ang);

                let level_node = nodes.length;
                nodes[level_node] = [x, y, z];

                points[i].push(level_node);

                if (j > 0) {
                    // edges on the current circle
                    edges.push([level_node-1, level_node]);
                }
            }

            if (i > 0) {
                for (let k=0, kmax=points[i].length; k<kmax; k++) {
                    let point1 = points[i][k];
                    let point2 = points[i-1][k];
                    edges.push([point1, point2]);
                    if (k > 0) {
                        let pointp1 = points[i][k-1];
                        let pointp2 = points[i-1][k-1];
                        faces.push([point1, point2, pointp2, pointp1]);
                    }
                }

            }
        }

        rotateZ3D(zRot, nodes);
        rotateY3D(yRot, nodes);
        rotateX3D(xRot, nodes);

        return {
            points: nodes.map(item => { return { x: item[0], y: item[1], z:item[2] }}),
            edges: edges.map(item => { return { a: item[0], b: item[1] }}),
            polygons: faces
        }
    }

    /**
     * Split an array in blocks of arrays
     * @param arr
     * @param len
     * @param dispatch
     * @returns {*[]}
     */
    function chunk (arr, len, dispatch = true) {
        var chunks = [],
            i = 0,
            n = arr.length;
        while (i < n) {
            chunks.push(arr.slice(i, i += len));
        }

        if (chunks.length > len && dispatch) {
            let num_dispatch = 0;
            chunks[chunks.length - 1].forEach(item => {
                chunks[num_dispatch].push(item);
                num_dispatch++;
            });
            chunks[chunks.length - 1] = [];
        }

        return chunks.filter(function (el) {
            return el.length > 0;
        });
    }

    /**
     * RadialGradientBitmap generator
     * TODO : not tested :(
     * @param config.size
     * @param config.innerColour
     * @param config.outerColour
     */
    function generateRadialGradientBitmap(config) {
        var size, innerColour, outerColour;
        size = config.size || 100;
        innerColour = config.innerColour || '#fafa6e';
        outerColour = config.outerColour || '#2A4858';

        var buffer = document.createElement("canvas");
        var width = size << 1;
        buffer.height = width;
        buffer.width = width;
        var ctx = buffer.getContext("2d");
        var radgrad = ctx.createRadialGradient(size, size, size >> 1, size, size, size);
        radgrad.addColorStop(0, innerColour);
        radgrad.addColorStop(1, outerColour);
        ctx.fillStyle = radgrad;
        ctx.fillRect(0, 0, width, width);
        var img = new Image();
        img.src = buffer.toDataURL("image/png");
        return img
    }

    /**
     * Private function for AJAX loading of OBJ files
     * synchronuous loading (not the best practice, but easier for an introduction to coding)
     * @param config.url
     */
    function getOBJFileSync(config) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", config.url, false);
        xhr.send(null);
        if (xhr.responseText.trim() === "") {
            console.error('NOT OBJ FILE');
            return false;
        } else {
            return xhr.responseText.trim();
        }
    }

    /**
     * Import 3D obj files (synchronuous AJAX loading)
     * see the function import3dObjAsync for a better practice (with asynchronuous loading)
     * @param config.scale
     * @param config.xRot
     * @param config.yRot
     * @param config.zRot
     */
    function import3dObjSync(config) {
        var scale = config.scale || 1;
        var xRot = config.xRot || null;
        var yRot = config.yRot || null;
        var zRot = config.zRot || null;

        var vertex = [],
            faces = [],
            uvs = [];
        var re = /\s+/;

        var minx, miny, minz, maxx, maxy, maxz;
        minx = miny = minz = maxx = maxy = maxz = 0;

        var data = getOBJFileSync(config);
        if (data == false) {
            return;
        }
        var lines = data.split("\n");

        for (let i = 0, imax=lines.length; i < imax; i++) {
            let line = lines[i].split(re);
            switch (line[0]) {
                case "v":
                    var x = parseFloat(line[1]) * scale,
                        y = parseFloat(line[2]) * scale,
                        z = parseFloat(line[3]) * scale;
                    vertex.push({
                        x: x,
                        y: y,
                        z: z
                    });
                    if (x < minx) {
                        minx = x
                    } else {
                        if (x > maxx) {
                            maxx = x
                        }
                    }
                    if (y < miny) {
                        miny = y
                    } else {
                        if (y > maxy) {
                            maxy = y
                        }
                    }
                    if (z < minz) {
                        minz = z
                    } else {
                        if (z > maxz) {
                            maxz = z
                        }
                    }
                    break;
                case "vt":
                    var u = parseFloat(line[1]),
                        v = parseFloat(line[2]);
                    uvs.push([u, v]);
                    break;
                case "f":
                    line.splice(0, 1);
                    var vertices = [],
                        uvcoords = [];
                    for (var j = 0, vindex, vps; j < line.length; j++) {
                        vindex = line[config.reorder ? line.length - j - 1 : j];
                        if (vindex.length !== 0) {
                            vps = vindex.split("/");
                            vertices.push(parseInt(vps[0]) - 1);
                            if (vps.length > 1 && vindex.indexOf("//") === -1) {
                                var uv = parseInt(vps[1]) - 1;
                                if (uvs.length > uv) {
                                    uvcoords.push(uvs[uv][0], uvs[uv][1])
                                }
                            }
                        }
                    }
                    faces.push(vertices);
                    if (uvcoords.length !== 0) {
                        poly.uvs = uvcoords
                    }
                    break
            }
        }
        if (config.center) {
            var cdispx = (minx + maxx) / 2,
                cdispy = (miny + maxy) / 2,
                cdispz = (minz + maxz) / 2;
            for (var i = 0; i < vertex.length; i++) {
                vertex[i].x -= cdispx;
                vertex[i].y -= cdispy;
                vertex[i].z -= cdispz
            }
        }
        if (config.scaleTo) {
            var sizex = maxx - minx,
                sizey = maxy - miny,
                sizez = maxz - minz;
            var scalefactor = 0;
            if (sizey > sizex) {
                if (sizez > sizey) {
                    scalefactor = 1 / (sizez / config.scaleTo)
                } else {
                    scalefactor = 1 / (sizey / config.scaleTo)
                }
            } else {
                if (sizez > sizex) {
                    scalefactor = 1 / (sizez / config.scaleTo)
                } else {
                    scalefactor = 1 / (sizex / config.scaleTo)
                }
            }
            for (let i = 0, imax=vertex.length; i < imax; i++) {
                vertex[i].x *= scalefactor;
                vertex[i].y *= scalefactor;
                vertex[i].z *= scalefactor
            }
        }
        rotateZ3D(zRot, vertex, true);
        rotateY3D(yRot, vertex, true);
        rotateX3D(xRot, vertex, true);

        return {
            points: vertex,
            polygons: faces
        }
    }

    /**
     * Import 3D obj files (asynchronuous AJAX loading)
     * see the function import3dObjAsync for a better practice (with asynchronuous loading)
     * @param config ({url:'http...', scaleTo:200, reorder:false, center:true})
     * @param config.xRot
     * @param config.yRot
     * @param config.zRot
     * @param fnc (callback for drawing the object)
     */
    function import3dObjAsync(config, fnc) {

        fetch(config.url)
            .then(function(response) { return response.text(); })
            .then(function(data) {
                var scale = config.scale || 1;
                var xRot = config.xRot || null;
                var yRot = config.yRot || null;
                var zRot = config.zRot || null;

                var vertex = [],
                    faces = [],
                    uvs = [];
                var re = /\s+/;

                var minx, miny, minz, maxx, maxy, maxz;
                minx = miny = minz = maxx = maxy = maxz = 0;

                var lines = data.split("\n");

                for (let i = 0, imax=lines.length; i < imax; i++) {
                    let line = lines[i].split(re);
                    switch (line[0]) {
                        case "v":
                            var x = parseFloat(line[1]) * scale,
                                y = parseFloat(line[2]) * scale,
                                z = parseFloat(line[3]) * scale;
                            vertex.push({
                                x: x,
                                y: y,
                                z: z
                            });
                            if (x < minx) {
                                minx = x
                            } else {
                                if (x > maxx) {
                                    maxx = x
                                }
                            }
                            if (y < miny) {
                                miny = y
                            } else {
                                if (y > maxy) {
                                    maxy = y
                                }
                            }
                            if (z < minz) {
                                minz = z
                            } else {
                                if (z > maxz) {
                                    maxz = z
                                }
                            }
                            break;
                        case "vt":
                            var u = parseFloat(line[1]),
                                v = parseFloat(line[2]);
                            uvs.push([u, v]);
                            break;
                        case "f":
                            line.splice(0, 1);
                            var vertices = [],
                                uvcoords = [];
                            for (var j = 0, vindex, vps; j < line.length; j++) {
                                vindex = line[config.reorder ? line.length - j - 1 : j];
                                if (vindex.length !== 0) {
                                    vps = vindex.split("/");
                                    vertices.push(parseInt(vps[0]) - 1);
                                    if (vps.length > 1 && vindex.indexOf("//") === -1) {
                                        var uv = parseInt(vps[1]) - 1;
                                        if (uvs.length > uv) {
                                            uvcoords.push(uvs[uv][0], uvs[uv][1])
                                        }
                                    }
                                }
                            }
                            faces.push(vertices);
                            break
                    }
                }
                if (config.center) {
                    var cdispx = (minx + maxx) / 2,
                        cdispy = (miny + maxy) / 2,
                        cdispz = (minz + maxz) / 2;
                    for (var i = 0; i < vertex.length; i++) {
                        vertex[i].x -= cdispx;
                        vertex[i].y -= cdispy;
                        vertex[i].z -= cdispz
                    }
                }
                if (config.scaleTo) {
                    var sizex = maxx - minx,
                        sizey = maxy - miny,
                        sizez = maxz - minz;
                    var scalefactor = 0;
                    if (sizey > sizex) {
                        if (sizez > sizey) {
                            scalefactor = 1 / (sizez / config.scaleTo)
                        } else {
                            scalefactor = 1 / (sizey / config.scaleTo)
                        }
                    } else {
                        if (sizez > sizex) {
                            scalefactor = 1 / (sizez / config.scaleTo)
                        } else {
                            scalefactor = 1 / (sizex / config.scaleTo)
                        }
                    }
                    for (let i = 0, imax=vertex.length; i < imax; i++) {
                        vertex[i].x *= scalefactor;
                        vertex[i].y *= scalefactor;
                        vertex[i].z *= scalefactor
                    }
                }
                rotateZ3D(zRot, vertex, true);
                rotateY3D(yRot, vertex, true);
                rotateX3D(xRot, vertex, true);
                fnc({
                    points: vertex,
                    polygons: faces
                });
            })
    }

    /**
     * Menger Sponge Fractal Generator
     * Adaptation of an algorithm of Frido VerWeij : https://librayRot.fridoverweij.com
     * @param config.x
     * @param config.y
     * @param config.z
     * @param config.r
     * @param config.level
     * @param config.maxLevel
     * @param config.ref  (zdog object master)
     */
    function spongeGenerator(config) {
        var x, y, z, r, level, objmaster, maxLevel;
        x = config.x;
        y = config.y;
        z = config.z;
        r = config.r;
        level = config.level;
        maxLevel = config.maxLevel || 2;
        objmaster = config.ref;
        if (level > 0 && level <= maxLevel && level <= 3) {
            let newR = r/3;
            let pos = [];
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    for (let k = -1; k < 2; k++) {
                        // Of the mid boxes always at least 2 coordinates are 0. Thus for those not to be drawn boxes: sum <= 1.
                        // Inspired by: The Coding Train: Coding Challenge #2: Menger Sponge Fractal, https://youtu.be/LG8ZK-rRkXo
                        let sum = abs(i) + abs(j)+ abs(k);
                        if (sum > 1) {
                            let t = pos.length;
                            pos[t] = { x:x+i*newR, y:y+j*newR, z:z+k*newR };
                            if (level === maxLevel) {
                                new Zdog.Box({
                                    addTo: objmaster,
                                    width: newR,
                                    height: newR,
                                    depth: newR,
                                    translate: {x:pos[t].x, y:pos[t].y, z:pos[t].z},
                                    stroke: false,
                                    color: '#C25', // default face color
                                    leftFace: '#EA0',
                                    rightFace: '#E62',
                                    topFace: '#ED0',
                                    bottomFace: '#636',
                                });
                            }
                        }
                    }
                }
            }
            // recursion
            let nextLevel = level + 1;
            for (let t=0, tmax=pos.length; t < tmax; t++) {
                spongeGenerator({x:pos[t].x, y:pos[t].y, z:pos[t].z, r:newR, level:nextLevel, maxLevel: maxLevel, ref: objmaster});
            }
        }
    }

    /**
     * Menger Flake Fractal Generator
     * Adaptation of an algorithm of Frido VerWeij : https://librayRot.fridoverweij.com
     * @param config.x
     * @param config.y
     * @param config.z
     * @param config.r
     * @param config.level
     * @param config.maxLevel
     * @param config.ref  (zdog object master)
     */
    function flakeGenerator(config) {
        var x, y, z, r, level, objmaster, maxLevel;
        x = config.x;
        y = config.y;
        z = config.z;
        r = config.r;
        level = config.level;
        maxLevel = config.maxLevel || 3;
        objmaster = config.ref;

        if (level > 0 && level <= maxLevel && level <= 4) {
            let newR = r/3;
            let pos = [];
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    for (let k = -1; k < 2; k++) {
                        // Of the mid boxes always at least 2 coordinates are 0. Thus for those not to be drawn boxes: sum <= 1.
                        // Inspired by: The Coding Train: Coding Challenge #2: Menger Sponge Fractal, https://youtu.be/LG8ZK-rRkXo
                        let sum = Math.abs(i) + Math.abs(j)+ Math.abs(k);
                        if (sum <= 1) {
                            let t = pos.length;
                            pos[t] = { x:x+i*newR, y:y+j*newR, z:z+k*newR };
                            if (level === maxLevel) {
                                new Zdog.Box({
                                    addTo: objmaster,
                                    width: newR,
                                    height: newR,
                                    depth: newR,
                                    translate: {x:pos[t].x, y:pos[t].y, z:pos[t].z},
                                    stroke: false,
                                    color: '#C25', // default face color
                                    leftFace: '#EA0',
                                    rightFace: '#E62',
                                    topFace: '#ED0',
                                    bottomFace: '#636',
                                });
                            }
                        }
                    }
                }
            }
            // recursion
            var nextLevel = level + 1;
            for (let t=0, tmax=pos.length; t < tmax; t++) {
                flakeGenerator({x:pos[t].x, y:pos[t].y, z:pos[t].z, r:newR, level:nextLevel, maxLevel:maxLevel, ref: objmaster});
            }
        }
    }

    /**
     * Grid generator with Triangle strip algorithm
     */
    function gridTriangleStrip(config) {
        var cols = config.cols || 4;
        var rows = config.rows || 3;
        var RCvertices = 2*cols*(rows-1);
        var TSvertices = 2*cols*(rows-1)+2*(rows-2);
        var j=0;
        var trianglestrip = [];
        for(let i = 1; i <= RCvertices; i += 2){
            trianglestrip[ j ] = (1 + i)/2;
            trianglestrip[ j+1 ] = (cols*2 + i + 1) / 2;
            if( trianglestrip[ j+1 ] % cols == 0) {
                if( trianglestrip[ j+1 ] != cols && trianglestrip[ j+1 ] != cols*rows ){
                    trianglestrip[ j+2 ] = trianglestrip[ j+1 ];
                    trianglestrip[ j+3 ] = (1 + i + 2) / 2;
                    j += 2;
                }
            }
            j += 2;
        }
        return trianglestrip;
    }

    /**
     * Custom shape
     * @param config
     * @returns {{polygons: Array, edges: {a: *, b: *}[], points: {x: *, y: *, z: *}[]}}
     */
    function customShape(config) {
        var scale = config.scale || 1;
        var xRot = config.xRot || null;
        var yRot = config.yRot || null;
        var zRot = config.zRot || null;
        var rendrMode = config.rendrMode || 1;   // 1=triangle strip standard ; 2=triangle strip buggy but pretty
        var rendrParts = config.rendrParts || 3;  // 1=Top ; 2=Bottom ; 3=Both

        var count = config.pjs_count || 5;
        var radius = config.pjs_radius || 5;
        var twist = config.pjs_twist || 2;
        var hcount = config.pjs_hcount || 1.5;
        var phase = config.pjs_phase || 2;
        var hradius = config.pjs_hradius || 5;

        var max_tri_strips = config.max_tri_strips || 30;
        var max_vertices = config.max_vertices || 72;

        var nodes = [];
        var edges = [];
        var faces = [];

        var vertx = [];
        var verty = [];

        var topShape = [];

        function getR( a, h) {
            return  radius * sin( degToRad(a) * count + ( h / 15 )* twist)
                + sin(degToRad(3.6 * h) * hcount + phase)
                * hradius + 40;
        }

        for ( let h = 0; h < max_tri_strips; h++) {
            vertx[h] = [];
            verty[h] = [];
            for ( let a = 0; a < max_vertices; a++) {
                let r = getR( a * 5.0, h * 5.0 );
                vertx[h][a] = cos( degToRad( a * 5.0 )) * r;
                verty[h][a] = sin( degToRad( a * 5.0 )) * r;
            }
        }
        let coef_h = 3.2;
        if (rendrMode == 1) {
            coef_h = 2.65;
        }
        for ( let h = 1, hmax = max_tri_strips-1; h < hmax; h++) {
            for ( let a = 0; a <= max_vertices; a++ ) {
                let aa = a % max_vertices;
                topShape.push({x:vertx[h][aa], y:h*5.0*coef_h, z:verty[h][aa]});
                topShape.push({x:vertx[h-1][aa], y:(h-1)*5.0*coef_h, z:verty[h-1][aa]});
                if (rendrMode == 1) {
                  topShape.push({x:vertx[h+1][aa], y:(h+1)*5.0*coef_h, z:verty[h+1][aa]});
                }
            }
        }

        //console.log("topShape.length => ",topShape.length, topShape);

        // generate the top part only, or both parts
        if (rendrParts == 1 || rendrParts == 3) {
            if (rendrMode == 2) {
                let grid = gridTriangleStrip({cols: 1, rows: topShape.length / 3.0});
                //console.log("grid.length => ", grid.length, grid);

                let tmpfaces = chunk(grid, 3, false);
                //console.log(tmpfaces);

                tmpfaces.forEach(tmpface => {
                    let node0 = topShape[tmpface[0]];
                    nodes.push({x: node0.x, y: node0.y, z: node0.z});
                    let id0 = nodes.length - 1;

                    let node1 = topShape[tmpface[1]];
                    nodes.push({x: node1.x, y: node1.y, z: node1.z});
                    let id1 = nodes.length - 1;

                    let node2 = topShape[tmpface[2]];
                    let id2 = 0;
                    if (node2 != undefined) {
                        nodes.push({x: node2.x, y: node2.y, z: node2.z});
                        id2 = nodes.length - 1;
                    }
                    let face = [id0, id1, id2];
                    faces.push(face);
                });
            } else {
                let grid = gridTriangleStrip({cols: max_vertices, rows: max_tri_strips});
                //console.log("grid.length => ", grid.length, grid);

                let face = [];
                grid.forEach(item => {
                    let node = topShape[item];
                    nodes.push({x: node.x, y: node.y, z: node.z});
                    let id = nodes.length - 1;
                    face.push(id);
                    if (face.length == 3) {
                        faces.push(face);
                        face = [];
                    }
                });
            }
        }

        // generate the bottom part only, or both parts
        if (rendrParts == 2 || rendrParts == 3) {
            // bottom of the shape (grid triangle fan algorithm)
            let h = max_tri_strips - 1;
            nodes.push({x: 0, y: h * 5, z: 0});
            let pos_bottom_ref = nodes.length - 1;
            let pos_bottom_inc = pos_bottom_ref;

            for (let a = 0; a <= max_vertices; a++) {
                let aa = a % max_vertices;
                pos_bottom_inc++;
                nodes[pos_bottom_inc] = {x: vertx[h][aa], y: h * 5, z: verty[h][aa]};
                //edges.push([pos_bottom_ref, pos_bottom_inc]);
                if (a > 0) {
                    faces.push([pos_bottom_ref, pos_bottom_inc, pos_bottom_inc - 1]);
                }
            }
        }

        //console.log(faces);

        //  rotateZ3D(zRot, nodes);
        //  rotateY3D(yRot, nodes);
        //  rotateX3D(xRot, nodes);

        return {
            points: nodes.map(item => { return { x: item.x, y: item.y, z:item.z }}),
            edges: edges.map(item => { return { a: item[0], b: item[1] }}),
            polygons: faces
        }
    }
    /**
     * Rotate shape around the z-axis
     *  If parameter xyz == true
     *     Then work with explicit x, y and z properties of each node
     *     Else work with no explicit x, y, z coordinates (stored on position 0, 1, 2 of an array)
     * @param theta (angle)
     * @param nodes (array)
     * @param xyz (boolean, false by default)
     */
    function rotateZ3D(theta, nodes, xyz=false) {
        if (theta == null || theta == undefined) return;
        theta = theta * DEG_TO_RAD;
        var sinTheta = sin(theta);
        var cosTheta = cos(theta);

        if (xyz == true) {
            for (let n = 0, nmax = nodes.length; n < nmax; n++) {
                let node = nodes[n];
                let x = node.x;
                let y = node.y;
                node.x = x * cosTheta - y * sinTheta;
                node.y = y * cosTheta + x * sinTheta;
            }
        } else {
            for (let n = 0, nmax = nodes.length; n < nmax; n++) {
                let node = nodes[n];
                let x = node[0];
                let y = node[1];
                node[0] = x * cosTheta - y * sinTheta;
                node[1] = y * cosTheta + x * sinTheta;
            }
        }
    }

    /**
     * Rotate shape around the y-axis
     *  If parameter xyz == true
     *     Then work with explicit x, y and z properties of each node
     *     Else work with no explicit x, y, z coordinates (stored on position 0, 1, 2 of an array)
     * @param theta (angle)
     * @param nodes (array)
     * @param xyz (boolean, false by default)
     */
    function rotateY3D(theta, nodes, xyz=false) {
        if (theta == null || theta == undefined) return;
        theta = theta * DEG_TO_RAD;
        var sinTheta = sin(-theta);
        var cosTheta = cos(-theta);

        if (xyz == true) {
            for (let n = 0, nmax = nodes.length; n < nmax; n++) {
                let node = nodes[n];
                let x = node.x;
                let z = node.z;
                node.x = x * cosTheta - z * sinTheta;
                node.z = z * cosTheta + x * sinTheta;
            }
        } else {
            for (let n = 0, nmax = nodes.length; n < nmax; n++) {
                let node = nodes[n];
                let x = node[0];
                let z = node[2];
                node[0] = x * cosTheta - z * sinTheta;
                node[2] = z * cosTheta + x * sinTheta;
            }
        }
    }

    /**
     * Rotate shape around the x-axis
     *  If parameter xyz == true
     *     Then work with explicit x, y and z properties of each node
     *     Else work with no explicit x, y, z coordinates (stored on position 0, 1, 2 of an array)
     * @param theta (angle)
     * @param nodes (array)
     * @param xyz (boolean, false by default)
     */
    function rotateX3D(theta, nodes, xyz=false) {
        if (theta == null || theta == undefined) return;
        theta = theta * DEG_TO_RAD;
        var sinTheta = sin(-theta);
        var cosTheta = cos(-theta);
        if (xyz == true) {
            for (let n = 0, nmax = nodes.length; n < nmax; n++) {
                let node = nodes[n];
                let y = node.y;
                let z = node.z;
                node.y = y * cosTheta - z * sinTheta;
                node.z = z * cosTheta + y * sinTheta;
            }
        } else {
            for (let n = 0, nmax = nodes.length; n < nmax; n++) {
                let node = nodes[n];
                let y = node[1];
                let z = node[2];
                node[1] = y * cosTheta - z * sinTheta;
                node[2] = z * cosTheta + y * sinTheta;
            }
        }
    }

    function loadImage (asset) {
        return new Promise((resolve) => {
            let img = new Image();
            img.setAttribute('data-name', asset.name);
            img.crossOrigin = "Anonymous";
            img.onload = () => resolve(img);
            img.src = asset.path;
        })
    }

    function loadImages (assets) {
        let pics = [];
        assets.forEach((item) => {
            pics.push(loadImage(item));
        });
        return Promise.all(pics);
    }

    /**
     * getGeneratorsList - get the list of shapes available
     * @returns {*[]}
     */
    function getGeneratorsList() {
        return [
            {name: "cube", fn:"generateCube", default:{scale:200, xRot:50, yRot:40, zRot:45}},
            {name: "sphere1", fn:"generateSphere1", default:{scale:200, lats:20, longs:20}},
            {name: "sphere2", fn:"generateSphere2", default:{radius:200}},
            {name: "icosahedron", fn:"generateIcosahedron", default:{scale:200}},
            {name: "icosahedron2", fn:"generateIcosahedron2", default:{scale:30}},
            {name: "dodecahedron (pretty bug)", fn:"generateDodecahedron", default:{scale:30}},
            {name: "tetrahedron", fn:"generateTetrahedron", default:{scale:200, xRot:50, yRot:40, zRot:10}},
            {name: "pyramid", fn:"generatePyramid", default:{scale:200}},
            {name: "cylinder1", fn:"generateCylinder1", default:{radius:50, length:200, strips:30, gradient_color:1}},
            {name: "cylinder2", fn:"generateCylinder2", default:{radius:50, length:200, xRot:50, yRot:40, zRot:10, gradient_color:2}},
            {name: "cuboid1", fn:"generateCuboid1", default:{xScale:200, yScale:60, zScale:100, xRot:50, yRot:40, zRot:45}},
            {name: "cuboid2", fn:"generateCuboid2", default:{xLength:200, yLength:60, zLength:100, xRot:50, yRot:40, zRot:10, crossing:true}},
            {name: "cone1", fn:"generateCone", default:{radius:100, height:200, xRot:50, yRot:40, zRot:10, scale:1, gradient_color:1}},
            {name: "cone2", fn:"generateCone", default:{radius:100, height:200, xRot:50, yRot:40, zRot:10, scale:1, gradient_color:2}},
            {name: "conicalFrustum", fn:"generateConicalFrustum", default:{xRot:50, yRot:40, zRot:10, scale:1, crossing:false, gradient_color:2}},
            {name: "tube", fn:"generateTube", default:{xRot:50, yRot:40, zRot:10, scale:3, facets:40, datas:[{r: 30, z:0}, {r: 40, z:40}]}},
            {name: "diamond", fn:"generateTube", default:{xRot:50, yRot:40, zRot:10, scale:5, datas:[{r: 30, z:0}, {r: 45, z:20}, {r: 30, z:40}]}},
            {name: "doubleDiamond", fn:"generateTube", default:{xRot:50, yRot:40, zRot:10, scale:5, datas:[{r: 30, z:0}, {r: 45, z:20}, {r: 30, z:40}, {r: 45, z:60}, {r: 20, z:80}]}},
            {name: "calyx", fn:"generateTube", default:{xRot:50, yRot:40, zRot:10, scale:3, datas:[{r: 30, z:0}, {r: 45, z:20}, {r: 30, z:40}, {r: 20, z:50}, {r: 10, z:60}, {r: 10, z:100}, {r: 45, z:110}]}},
            {name: "calyx2", fn:"generateTube", default:{xRot:50, yRot:40, zRot:10, scale:3, facets:40, datas:[{r: 30, z:0}, {r: 45, z:20}, {r: 30, z:40}, {r: 20, z:50}, {r: 10, z:60}, {r: 10, z:100}, {r: 45, z:110}]}},
            {name: "strangeFruit1", fn:"generateStrangeFruit", default:{xRot:50, yRot:40, zRot:10, scale:5, crossing:false}},
            {name: "strangeFruit2", fn:"generateStrangeFruit", default:{xRot:50, yRot:40, zRot:10, scale:5, crossing:true}},
            {name: "equilibrium", fn:"generateEquilibrium", default:{xRot:50, yRot:40, zRot:10, scale:20}},

        ]
    }

    /**
     * getGeneratorsList2 - get the list of shapes available (more interesting with
     * @returns {*[]}
     */
    function getGeneratorsList2() {
        return [
            {name: "cube", fn:"generateCube", default:{scale:200, xRot:50, yRot:40, zRot:45}},
            {name: "icosahedron", fn:"generateIcosahedron", default:{scale:200}},
            {name: "icosahedron2", fn:"generateIcosahedron2", default:{scale:30}},
            {name: "dodecahedron (pretty bug)", fn:"generateDodecahedron", default:{scale:30}},
            {name: "tetrahedron", fn:"generateTetrahedron", default:{scale:200, xRot:50, yRot:40, zRot:10}},
            {name: "pyramid", fn:"generatePyramid", default:{scale:200}},
            {name: "cuboid1", fn:"generateCuboid1", default:{xScale:200, yScale:60, zScale:100, xRot:50, yRot:40, zRot:45}},
            {name: "cuboid2", fn:"generateCuboid2", default:{xLength:200, yLength:60, zLength:100, xRot:50, yRot:40, zRot:10, crossing:true}},
            {name: "conicalFrustum", fn:"generateConicalFrustum", default:{xRot:50, yRot:40, zRot:10, scale:3, crossing:false, gradient_color:2}},
            {name: "tube", fn:"generateTube", default:{xRot:50, yRot:40, zRot:10, scale:4, facets:40, datas:[{r: 30, z:0}, {r: 40, z:40}]}},
            {name: "diamond", fn:"generateTube", default:{xRot:50, yRot:40, zRot:10, scale:5, datas:[{r: 30, z:0}, {r: 45, z:20}, {r: 30, z:40}]}},
            {name: "doubleDiamond", fn:"generateTube", default:{xRot:50, yRot:40, zRot:10, scale:5, datas:[{r: 30, z:0}, {r: 45, z:20}, {r: 30, z:40}, {r: 45, z:60}, {r: 20, z:80}]}},
            {name: "calyx", fn:"generateTube", default:{xRot:50, yRot:40, zRot:10, scale:3, datas:[{r: 30, z:0}, {r: 45, z:20}, {r: 30, z:40}, {r: 20, z:50}, {r: 10, z:60}, {r: 10, z:100}, {r: 45, z:110}]}},
            {name: "calyx2", fn:"generateTube", default:{xRot:50, yRot:40, zRot:10, scale:3, facets:40, datas:[{r: 30, z:0}, {r: 45, z:20}, {r: 30, z:40}, {r: 20, z:50}, {r: 10, z:60}, {r: 10, z:100}, {r: 45, z:110}]}},
            {name: "equilibrium", fn:"generateEquilibrium", default:{xRot:50, yRot:40, zRot:10, scale:20}},

        ]
    }

    /**
     * Example with a mix of five 3D objects
     * largely inspired by : https://library.fridoverweij.com/codelab/3d_wireframe/index.html
     * @returns {*[]}
     */
    function getAssemblyObject01() {
        return [
            {name: "cuboid2a", fn:"generateCuboid2", default:{xCenter:0, yCenter:0, zCenter:0, xLength:200, yLength:10, zLength:100, xRot:0, yRot:0, zRot:0, crossing:false}},
            {name: "cylinder2a", fn:"generateCylinder2", default:{xCenter:0, yCenter:-110, zCenter:0, radius:50, length:200, xRot:0, yRot:0, zRot:0}},
            {name: "sphere2", fn:"generateSphere2", default:{xCenter:0, yCenter:-210, zCenter:0, radius:50}},
            {name: "cylinder2b", fn:"generateCylinder2", default:{xCenter:-210, yCenter:-100, zCenter:0, radius:50, length:200, xRot:0, yRot:0, zRot:90}},
            {name: "cuboid2b", fn:"generateCuboid2", default:{xCenter:210, yCenter:-150, zCenter:0, xLength:10, yLength:160, zLength:100, xRot:0, yRot:0, zRot:0, crossing:true}},
        ]
    }

    /**
     * Balance generator
     * @param config.scale
     * @param config.xRot
     * @param config.yRot
     * @param config.zRot
     */
    function generateEquilibrium(config) {
        var s = config.scale || 1;
        var xRot = config.xRot || null;
        var yRot = config.yRot || null;
        var zRot = config.zRot || null;

        var tmpnodes = [{ x: 5, y: 10, z: 0},
            { x: 7, y: 10, z: 3},
            { x: 5, y: 12, z: 3},
            { x: 3, y: 10, z: 3},
            { x: 5, y: 8, z: 3},
            { x: 5, y: 10, z: 5.6},
            { x: 6, y: 1, z: 3.8},
            { x: 6, y: 22, z: 8},
            { x: 4, y: 22, z: 8},
            { x: 4, y: 1, z: 3.8},
            { x: 5, y: 2, z: 4},
            { x: 7, y: 2, z: 9},
            { x: 5, y: 4, z: 9},
            { x: 3, y: 2, z: 9},
            { x: 5, y: 0, z: 9},
            { x: 7, y: 21, z: 8},
            { x: 7, y: 23, z: 8},
            { x: 3, y: 23, z: 8},
            { x: 3, y: 21, z: 8},
            { x: 7, y: 21, z: 12},
            { x: 7, y: 23, z: 12},
            { x: 3, y: 23, z: 12},
            { x: 3, y: 21, z: 12},
            { x: 8, y: 7, z: 0},
            { x: 8, y: 13, z: 0},
            { x: 2, y: 13, z: 0},
            { x: 2, y: 7, z: 0}
        ];

        var nodes = tmpnodes.map(item=> {
            return {x: item.x * s, y: item.y * s, z: item.z * s}
        });


        rotateZ3D(zRot, nodes, true);
        rotateY3D(yRot, nodes, true);
        rotateX3D(xRot, nodes, true);

        var tmppolygons = [];
        tmppolygons[0] = [[1, 5, 4],
            [4, 3, 1],
            [2, 5, 1],
            [1, 3, 2],
            [6, 5, 2],
            [2, 3, 6],
            [6, 3, 4],
            [4, 5, 6]];
        tmppolygons[1] = [[7, 8, 9, 10],
            [10, 9, 8, 7],
            [12, 13, 14, 15]];
        tmppolygons[2] = [[11, 12, 15],
            [11, 13, 12],
            [11, 14, 13],
            [11, 15, 14]];
        tmppolygons[3] = [[16, 17, 21, 20],
            [20, 23, 19, 16],
            [16, 19, 18, 17],
            [17, 18, 22, 21],
            [21, 22, 23, 20],
            [23, 22, 18, 19],
            [24, 25, 26, 27],
            [27, 26, 25, 24]];

        var polygons = [];
        var edges = [];
        tmppolygons.forEach(series=>{

            series.forEach(items=>{
                let poly = [];
                items.forEach(item => {
                    poly.push(item - 1);
                })
                polygons.push(poly);
            });

            for (let i=0, imax=polygons.length; i<imax; i++) {
                let a = polygons[i];
                let b = polygons[i+1];
                edges.push({a:a, b:b });
            }
        });
        console.log({
            points: nodes,
            edges: edges,
            polygons: polygons
        })
        return {
            points: nodes,
            edges: edges,
            polygons: polygons
        }
    }

    /**
     * Example with 8 cubes linked by 12 bars
     * largely inspired by : https://library.fridoverweij.com/codelab/3d_wireframe/index.html
     * @returns {*[]}
     */
    function getEightCubesLinked() {
        var size = 3;
        var scale = 10;
        var trans = 80;
        var mesh = [
            {name: "cuboid3-1", fn:"generateCuboid3", default:{size:size, scale:scale}},
            {name: "cuboid3-2", fn:"generateCuboid3", default:{size:size, scale:scale, yTranslate:trans}},
            {name: "cuboid3-3", fn:"generateCuboid3", default:{size:size, scale:scale, xTranslate:trans, yTranslate:trans}},
            {name: "cuboid3-4", fn:"generateCuboid3", default:{size:size, scale:scale, xTranslate:trans}},
            {name: "cuboid3-5", fn:"generateCuboid3", default:{size:size, scale:scale, zTranslate:trans}},
            {name: "cuboid3-6", fn:"generateCuboid3", default:{size:size, scale:scale, yTranslate:trans, zTranslate:trans}},
            {name: "cuboid3-7", fn:"generateCuboid3", default:{size:size, scale:scale, xTranslate:trans, yTranslate:trans, zTranslate:trans}},
            {name: "cuboid3-8", fn:"generateCuboid3", default:{size:size, scale:scale, xTranslate:trans, zTranslate:trans}},
        ];

        var decalage = 8;

        /* 4 bars on first direction */

        let data1 = [{x:1, y:3, z:1}, {x:2, y:3, z:1}, {x:2, y:3, z:2}, {x:1, y:3, z:2},
            {x:1, y:8, z:1}, {x:2, y:8, z:1}, {x:2, y:8, z:2}, {x:1, y:8, z:2}];

        mesh.push({name: "cuboid4-1-1", fn:"generateCuboid4", default:{nodes:data1, scale:scale}});

        let data2 = data1.map(item => {
            return {x: item.x+decalage, y: item.y, z:item.z};
        })

        mesh.push({name: "cuboid4-1-2", fn:"generateCuboid4", default:{nodes:data2, scale:scale}});

        let data3 = data1.map(item => {
            return {x: item.x, y: item.y, z:item.z+decalage};
        })

        mesh.push({name: "cuboid4-1-3", fn:"generateCuboid4", default:{nodes:data3, scale:scale}});

        let data4 = data1.map(item => {
            return {x: item.x+decalage, y: item.y, z:item.z+decalage};
        })

        mesh.push({name: "cuboid4-1-4", fn:"generateCuboid4", default:{nodes:data4, scale:scale}});

        /* 4 bars on second direction */

        let data5 = [{x:8, y:1, z:1}, {x:8, y:2, z:1}, {x:8, y:2, z:2}, {x:8, y:1, z:2},
            {x:3, y:1, z:1}, {x:3, y:2, z:1}, {x:3, y:2, z:2}, {x:3, y:1, z:2}];

        mesh.push({name: "cuboid4-2-1", fn:"generateCuboid4", default:{nodes:data5, scale:scale}});

        let data6 = data5.map(item => {
            return {x: item.x, y: item.y+decalage, z:item.z};
        })

        mesh.push({name: "cuboid4-2-2", fn:"generateCuboid4", default:{nodes:data6, scale:scale}});

        let data7 = data5.map(item => {
            return {x: item.x, y: item.y, z:item.z+decalage};
        })

        mesh.push({name: "cuboid4-2-3", fn:"generateCuboid4", default:{nodes:data7, scale:scale}});

        let data8 = data5.map(item => {
            return {x: item.x, y: item.y+decalage, z:item.z+decalage};
        })

        mesh.push({name: "cuboid4-2-4", fn:"generateCuboid4", default:{nodes:data8, scale:scale}});

        /* 4 bars on third direction */

        let data9 = [{x:10, y:1, z:3}, {x:10, y:2, z:3}, {x:9, y:2, z:3}, {x:9, y:1, z:3},
            {x:10, y:1, z:8}, {x:10, y:2, z:8}, {x:9, y:2, z:8}, {x:9, y:1, z:8}];

        mesh.push({name: "cuboid4-3-1", fn:"generateCuboid4", default:{nodes:data9, scale:scale}});

        let data10 = data9.map(item => {
            return {x: item.x-decalage, y: item.y, z:item.z};
        })

        mesh.push({name: "cuboid4-3-2", fn:"generateCuboid4", default:{nodes:data10, scale:scale}});

        let data11 = data9.map(item => {
            return {x: item.x-decalage, y: item.y+decalage, z:item.z};
        })

        mesh.push({name: "cuboid4-3-3", fn:"generateCuboid4", default:{nodes:data11, scale:scale}});

        let data12 = data9.map(item => {
            return {x: item.x, y: item.y+decalage, z:item.z};
        })

        mesh.push({name: "cuboid4-3-4", fn:"generateCuboid4", default:{nodes:data12, scale:scale}});

        return mesh;
    }

    // public functions and constants (items not declared here are private)
    return {
        generateCube: generateCube,
        generateSphere1: generateSphere1,
        generateIcosahedron: generateIcosahedron,
        generatePyramid: generatePyramid,
        generateCylinder1: generateCylinder1,
        generateCuboid1: generateCuboid1,
        generateRadialGradientBitmap: generateRadialGradientBitmap,
        import3dObjSync: import3dObjSync,
        import3dObjAsync: import3dObjAsync,
        getGeneratorsList: getGeneratorsList,
        getGeneratorsList2: getGeneratorsList2,
        spongeGenerator: spongeGenerator,
        flakeGenerator: flakeGenerator,
        generateSphere2: generateSphere2,
        generateCylinder2: generateCylinder2,
        generateCuboid2: generateCuboid2,
        generateCuboid3: generateCuboid3,
        generateCuboid4: generateCuboid4,
        generateCuboid5: generateCuboid5,
        generateCone: generateCone,
        generateTetrahedron: generateTetrahedron,
        generateConicalFrustum: generateConicalFrustum,
        generateStrangeFruit:generateStrangeFruit,
        generateTube: generateTube,
        rotateX3D: rotateX3D,
        rotateY3D: rotateY3D,
        rotateZ3D: rotateZ3D,
        loadImages: loadImages,
        loadImage: loadImage,
        getAssemblyObject01:getAssemblyObject01,
        customShape: customShape,
        getEightCubesLinked: getEightCubesLinked,
        generateEquilibrium: generateEquilibrium,
        generateIcosahedron2: generateIcosahedron2,
        generateDodecahedron: generateDodecahedron,
        excavateShape: excavateShape
    };
})();
