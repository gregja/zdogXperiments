/*
 * Some functions of this small toolbox are largely inspired by the project Phoria.js of Kevin Roast
 *    => http://www.kevs3d.co.uk/dev/phoria/
 * Cone, Cylinder2, Sphere2, Cuboid2 are largely inspired by algorithms of Frido Verweij
 *    => https://librayRot.fridoverweij.com/codelab/
 * Functions rotateX3D, rotateXYD and rotateZ3D largely inspired by the tutorial of Peter Collingridge
 *    https://petercollingridge.appspot.com/3D-tutorial/rotating-objects
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
    const PI_180 = PI / 180;

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
     * Cone generator
     * @param config.scale
     * @param config.xRot
     * @param config.yRot
     * @param config.zRot
     */
    function generateCone(config) {
        var s = config.scale || 1;
        var xRot = config.xRot || null;
        var yRot = config.yRot || null;
        var zRot = config.zRot || null;

        var r = config.r || 100;
        var h = config.h || 200;
        var dAlpha = 0.1;

        var nodes = [];
        var edges = [];
        var faces = [];

        //creating nodes
        var alpha = 0;
        nodes[0] = [0,-h/2,0];
        var i = 1;
        var limit = TAU + dAlpha;
        while (alpha <= limit) {
            var x = r * cos(alpha) * s;
            var z = r * sin(alpha) * s;
            nodes[i] = [x, h/2, z];
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
        var inc = 2 * PI / strips;
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
     * @param config.r
     * @param config.h
     * @param config.xRot
     * @param config.yRot
     * @param config.zRot
     * @returns {{polygons: Array, edges: {a: *, b: *}[], points: {x: *, y: *, z: *}[]}}
     */
    function generateCylinder2(config) {
        // xCenter,yCenter,zCenter,r,h,xRot,yRot,zRot
        var xCenter = config.xCenter || 0;
        var yCenter = config.yCenter || 0;
        var zCenter = config.zCenter || 0;
        var r = config.r || 100;
        var h = config.h || 200;
        var xRot = config.xRot || null;
        var yRot = config.yRot || null;
        var zRot = config.zRot || null;
        var dAlpha = 0.1;
        // creating the nodes
        var nodes = [];
        var alpha = 0;
        var i = 0;
        var mid_h = h/2;
        while (alpha <= 2 * PI + dAlpha) {
            let x = r*cos(alpha) + xCenter;
            let z = r*sin(alpha) + zCenter;
            nodes[i] = [x, yCenter + mid_h, z];
            nodes[i+1] = [x, yCenter - mid_h, z];
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

        let mesh = generateMesh(edges);

        return {
            points: nodes.map(item => { return { x: item[0], y: item[1], z:item[2] }}),
            edges: edges.map(item => { return { a: item[0], b: item[1] }}),
            polygons: mesh
        }
    }

    /**
     * Cuboid generator version 1
     * @param config.scalex
     * @param config.scaley
     * @param config.scalez
     * @param config.xRot
     * @param config.yRot
     * @param config.zRot
     */
    function generateCuboid1(config) {
        var scalex = config.scalex || 1,
            scaley = config.scaley || 1,
            scalez = config.scalez || 1;

        var xRot = config.xRot || null;
        var yRot = config.yRot || null;
        var zRot = config.zRot || null;

        var nodes = [{
            x: -1 * scalex,
            y: 1 * scaley,
            z: -1 * scalez
        }, {
            x: 1 * scalex,
            y: 1 * scaley,
            z: -1 * scalez
        }, {
            x: 1 * scalex,
            y: -1 * scaley,
            z: -1 * scalez
        }, {
            x: -1 * scalex,
            y: -1 * scaley,
            z: -1 * scalez
        }, {
            x: -1 * scalex,
            y: 1 * scaley,
            z: 1 * scalez
        }, {
            x: 1 * scalex,
            y: 1 * scaley,
            z: 1 * scalez
        }, {
            x: 1 * scalex,
            y: -1 * scaley,
            z: 1 * scalez
        }, {
            x: -1 * scalex,
            y: -1 * scaley,
            z: 1 * scalez
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
     * @returns {{polygons: Array, edges: {a: *, b: *}[], points: {x: *, y: *, z: *}[]}}
     */
    function generateCuboid2(config) {
        var xCenter = config.xCenter || 0;
        var yCenter = config.yCenter || 0;
        var zCenter = config.zCenter || 0;
        var xLength = config.xLength || 100;
        var yLength = config.yLength || 20;
        var zLength = config.zLength || 50;

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

        let mesh = generateMesh(edges);

        return {
            points: nodes.map(item => { return { x: item[0], y: item[1], z:item[2] }}),
            edges: edges.map(item => { return { a: item[0], b: item[1] }}),
            polygons: mesh
        }
    }

    /**
     * Generate a mesh from an array of edges
     * @param edges
     * @returns {Array}
     */
    function generateMesh(edges) {
        let polys = [];
        for (let i=0, imax = edges.length; i<imax; i+=2) {
            let edge1 = edges[i];
            let edge2 = edges[i+1];
            if (edge2 != undefined) {
                polys.push([edge1[0], edge1[1], edge2[0], edge2[1]]);
            }
        }
        return polys;
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
                var phi = longNumber * 2 * PI / longs;
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
        var r = config.r || 100;

        var yIncr = 5;
        var angleIncr = 0.3;
        var nodes = [];
        var edges = [];

        var j = 0;
        var nLo = 0; // number of lines of longitude
        var nLa = 0; // number of lines of latitude

        // create nodes and lines of latitude of half sphere
        for ( let y1 = r; y1 >= 0; y1 -= yIncr ) {
            let r_this = sqrt(pow(r,2) - pow(y1,2));
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
        for ( let y1 = -yIncr; y1 >= -r; y1 -= yIncr ) {
            let r_this = sqrt(pow(r,2) - pow(y1,2));
            let i = true;
            for ( let angle = 0; angle < TAU; angle += angleIncr ) {
                var x = cos(angle) * r_this + xCenter;
                var z = sin(angle) * r_this + zCenter;
                var y = y1 + yCenter;
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

        let mesh = generateMesh(edges);

        return {
            points: nodes.map(item => { return { x: item[0], y: item[1], z:item[2] }}),
            edges: edges.map(item => { return { a: item[0], b: item[1] }}),
            polygons: mesh
        }
    };

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
              rotateZ3D(zRot, nodes, true);
              rotateY3D(yRot, nodes, true);
              rotateX3D(xRot, nodes, true);
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
        theta = theta * PI_180;
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
        theta = theta * PI_180;
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
        theta = theta * PI_180;
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

    /**
     * getGeneratorsList - get the list of shapes available
     * @returns {*[]}
     */
    function getGeneratorsList() {
        return [
            {name: "cube", fn:"generateCube", default:{scale:100}},
            {name: "sphere1", fn:"generateSphere1", default:{scale:200, lats:20, longs:20}},
            {name: "sphere2", fn:"generateSphere2", default:{r:200}},
            {name: "icosahedron", fn:"generateIcosahedron", default:{scale:100}},
            {name: "pyramid", fn:"generatePyramid", default:{scale:100}},
            {name: "cylinder1", fn:"generateCylinder1", default:{radius:50, length:200, strips:30}},
            {name: "cylinder2", fn:"generateCylinder2", default:{r:100, h:200, xRot:50, yRot:40, zRot:10}},
            {name: "cuboid1", fn:"generateCuboid1", default:{scalex:100, scaley:30, scalez:50, xRot:50, yRot:40, zRot:45}},
            {name: "cuboid2", fn:"generateCuboid2", default:{xRot:50, yRot:40, zRot:10}},
            {name: "cone", fn:"generateCone", default:{xRot:50, yRot:40, zRot:10, scale:1}},
        ]
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
        spongeGenerator: spongeGenerator,
        flakeGenerator: flakeGenerator,
        generateSphere2: generateSphere2,
        generateCylinder2: generateCylinder2,
        generateCuboid2: generateCuboid2,
        generateCone: generateCone,
        rotateX3D: rotateX3D,
        rotateY3D: rotateY3D,
        rotateZ3D: rotateZ3D
      };
})();
