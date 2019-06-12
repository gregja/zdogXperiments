// Some functions of this small toolbox are largely inspired by Phoria.js
//    => http://www.kevs3d.co.uk/dev/phoria/
var shapes3dToolbox = (function () {
    "use strict";

    // shortcuts to Math Functions
    const abs = Math.abs;
    const sin = Math.sin;
    const cos = Math.cos;
    const tan = Math.tan;
    const sqrt = Math.sqrt;
	const PI = Math.PI;

    /**
     * Cube generator
     * @param config.scale
     */
    function generateCube(config) {
        var s = config.scale || 1;
        return {
            points: [{
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
            }],
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
     */
    function generatePyramid(config) {
        var s = config.scale || 1;
        return {
            points: [{
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
            }],
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
     * Icosahedron generator
     * @param config.scale
     */
    function generateIcosahedron(config) {
        var s = config.scale || 1;
        var t = (1 + sqrt(5)) / 2,
            tau = (t / sqrt(1 + t * t)) * s,
            one = (1 / sqrt(1 + t * t)) * s;
        return {
            points: [{
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
            }],
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
     * Cylinder generator
     * @param config.radius
     * @param config.length
     * @param config.strips
     */
    function generateCylinder(config) {
        var radius, length, strips;
        radius = config.radius || 50;
        length = config.length || 100;
        strips = config.strips || 5;
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
        return {
            points: points,
            edges: edges,
            polygons: polygons
        }
    }

    /**
     * Cuboid generator
     * @param config.scalex
     * @param config.scaley
     * @param config.scalez
     */
    function generateCuboid(config) {
        var scalex = config.scalex || 1,
            scaley = config.scaley || 1,
            scalez = config.scalez || 1;
        return {
            points: [{
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
            }],
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
     * Sphere generator
     * @param scale (default value : 100)
     * @param lats (default value : 20)
     * @param longs (default value : 20)
     * @param generateUVs (default value : false)
     */
    function generateSphere(config) {
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
     */
    function import3dObjSync(config) {
        var vertex = [],
            faces = [],
            uvs = [];
        var re = /\s+/;
        var scale = config.scale || 1;
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
        return {
            points: vertex,
            polygons: faces
        }
    }

    /**
     * Import 3D obj files (asynchronuous AJAX loading)
     * see the function import3dObjAsync for a better practice (with asynchronuous loading)
     * @param config ({url:'http...', scaleTo:200, reorder:false, center:true})
     * @param fnc (callback for drawing the object)
     */
    function import3dObjAsync(config, fnc) {

        fetch(config.url)
          .then(function(response) { return response.text(); })
          .then(function(data) {

              var vertex = [],
                  faces = [],
                  uvs = [];
              var re = /\s+/;
              var scale = config.scale || 1;
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
              fnc({
                  points: vertex,
                  polygons: faces
              });
          })
    }

    function getGeneratorsList() {
        return [
            {name: "cube", fn:"generateCube", default:{scale:100}},
            {name: "sphere", fn:"generateSphere", default:{scale:100, lats:20, longs:20}},
            {name: "icosahedron", fn:"generateIcosahedron", default:{scale:100}},
            {name: "pyramid", fn:"generatePyramid", default:{scale:100}},
            {name: "cylinder", fn:"generateCylinder", default:{radius:50, length:100, strips:5}},
            {name: "cuboid", fn:"generateCuboid", default:{scalex:50, scaley:30, scalez:100}}
          ]
        }


    /**
     * Menger Sponge Fractal Generator
     * Adaptation of an algorithm of Frido VerWeij : https://library.fridoverweij.com
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
     * Adaptation of an algorithm of Frido VerWeij : https://library.fridoverweij.com
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

    // public functions and constants (items not declared here are private)
    return {
        generateCube: generateCube,
        generateSphere: generateSphere,
        generateIcosahedron: generateIcosahedron,
        generatePyramid: generatePyramid,
        generateCylinder: generateCylinder,
        generateCuboid: generateCuboid,
        generateRadialGradientBitmap: generateRadialGradientBitmap,
        import3dObjSync: import3dObjSync,
        import3dObjAsync: import3dObjAsync,
        getGeneratorsList: getGeneratorsList,
        spongeGenerator: spongeGenerator,
        flakeGenerator: flakeGenerator
      };
})();
