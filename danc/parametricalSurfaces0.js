/*          SURFACES OF PARAMETRIC EQUATIONS
* ---------------------------------------------------
* This script draws 3D surfaces deended by equations
*     x = f(u,v), y = g(u,v), z = h(u,v)
*
* JS script inspired by a Pascal program excerpt from the book :
* "Graphisme dans le plan et dans l'espace en Turbo Pascal"
*   By R. Dony, ed. MASSON Paris 1990
*
* Rewritten for Javascript by Gregory Jarrige
*  MIT License
* ---------------------------------------------------
*   Surface Types:
*      Ellipsoid, Sphere, Torus, Hyperboloïd, Cone,
*      Pseudo-sphere, Axial (Hélicoïde), Catenoïd,
*      Möbius surface, Klein bottle, ...
*
*******************************************************/

var parametricalSurfaces = (function () {
    "use strict";

    const {
        cos, sin, PI, tanh, cosh, sinh, sqrt, pow, abs, sign, max
    } = Math;

    const TAU = PI * 2;
    const TWO_TAU = TAU * 2;

    const cos2 = (x) => pow(cos(x), 2);

    // function constrain taken on P5.js
    const constrain = function (n, low, high) {
        return max(Math.min(n, high), low);
    };

    // function map taken on P5.js
    const map = (n, start1, stop1, start2, stop2, withinBounds) => {
        var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
        if (!withinBounds) {
            return newval;
        }
        if (start2 < stop2) {
            return constrain(newval, start2, stop2);
        } else {
            return constrain(newval, stop2, start2);
        }
    };

    /**
     * Split an array in blocks of arrays
     * @param arr
     * @param len
     * @param dispatch
     * @returns {*[]}
     */
    const chunk = (arr, len, dispatch = true) => {
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

    let current_surface_type = 0;
    let current_surface_name = '';

    const DEFAULT_SCALE = 50;

    // Values for the current surface (setted by the call of the "setSurface" function)
    let A, B, C;
    let FX = (u, v) => false;
    let FY = (u, v) => false;
    let FZ = (u, v) => false;
    let SCALE = DEFAULT_SCALE;

    let last_point = 0;

    let surface_types = [];

    let points = [];
    let edges = [];
    let polys = [];
    let curpoly = -1;

    surface_types.push({
        id: 0,
        name: 'Ellipsoid',
        params: {A: 6.0, B: 3.0, C: 2.0},
        u: {begin: -PI / 2, end: PI / 2, dist: 0.2},
        v: {begin: -PI, end: PI, dist: 0.2},
        fx: (u, v) => A * cos(u) * cos(v),
        fy: (u, v) => B * cos(u) * sin(v),
        fz: (u, v) => C * sin(u),
        scale: DEFAULT_SCALE
    });
    surface_types.push({
        id: 1,
        name: 'Sphere 1',
        params: {A: 4.0, B: 4.0, C: 4.5},
        u: {begin: -PI / 2, end: PI / 2, dist: 0.2},
        v: {begin: -PI, end: PI, dist: 0.2},
        fx: (u, v) => A * cos(u) * cos(v),
        fy: (u, v) => B * cos(u) * sin(v),
        fz: (u, v) => C * sin(u),
        scale: DEFAULT_SCALE
    });
    surface_types.push({
        id: 2,
        name: 'Sphere 2 (truncated)',
        params: {A: 4.0, B: 4.0, C: 4.5},
        u: {begin: -PI / 2, end: 1, dist: 0.2},
        v: {begin: -PI, end: 1, dist: 0.2},
        fx: (u, v) => A * cos(u) * cos(v),
        fy: (u, v) => B * cos(u) * sin(v),
        fz: (u, v) => C * sin(u),
        scale: DEFAULT_SCALE
    });
    surface_types.push({
        id: 3,
        name: 'Sphere 3 (truncated)',
        params: {A: 4.0, B: 4.0, C: 4.5},
        u: {begin: -PI / 3, end: 0, dist: 0.2},
        v: {begin: -PI, end: 0, dist: 0.2},
        fx: (u, v) => A * cos(u) * cos(v),
        fy: (u, v) => B * cos(u) * sin(v),
        fz: (u, v) => C * sin(u),
        scale: DEFAULT_SCALE
    });

    surface_types.push({
        id: 4,
        name: 'Torus 1',
        params: {A: 6.0, B: 3.0, C: 3.0},
        u: {begin: -PI, end: PI, dist: 0.4},
        v: {begin: -PI, end: PI, dist: 0.2},
        fx: (u, v) => (A + B * cos(u)) * cos(v),
        fy: (u, v) => (A + B * cos(u)) * sin(v),
        fz: (u, v) => C * sin(u),
        scale: DEFAULT_SCALE / 2
    });
    surface_types.push({
        id: 5,
        name: 'Torus 2 (tire)',
        params: {A: 6.0, B: 3.0, C: 3.0},
        u: {begin: -PI / 2, end: PI / 2, dist: 0.2},
        v: {begin: -PI, end: PI, dist: 0.2},
        fx: (u, v) => (A + B * cos(u)) * cos(v),
        fy: (u, v) => (A + B * cos(u)) * sin(v),
        fz: (u, v) => C * sin(u),
        scale: DEFAULT_SCALE / 2
    });
    surface_types.push({
        id: 6,
        name: 'Torus 3 (flattened)',
        params: {A: 6.0, B: 3.0, C: 3.0},
        u: {begin: -PI, end: PI, dist: 0.4},
        v: {begin: -PI, end: PI, dist: 0.2},
        fx: (u, v) => (A + B * cos(u)) * cos(v),
        fy: (u, v) => (A + B * cos(u)) * sin(v),
        fz: (u, v) => B * sin(v),
        scale: DEFAULT_SCALE / 2
    });
    surface_types.push({
        id: 7,
        name: 'Hyperboloid',
        params: {A: 1.0, B: 1.0, C: 1.0},
        u: {begin: -PI / 2, end: PI / 2, dist: 0.2},
        v: {begin: -PI, end: PI, dist: 0.2},
        fx: (u, v) => u,
        fy: (u, v) => v,
        fz: (u, v) => u * u - v * v,
        scale: DEFAULT_SCALE
    });
    surface_types.push({
        id: 8,
        name: 'Cone',
        params: {A: PI / 6, B: 1.0, C: 1.0},
        u: {begin: -1, end: 2.6, dist: 0.2},
        v: {begin: -2, end: 0, dist: 0.2},
        fx: (u, v) => v * cos(u) * sin(A),
        fy: (u, v) => v * sin(u) * sin(A),
        fz: (u, v) => v * cos(A),
        scale: DEFAULT_SCALE * 4
    });

    surface_types.push({
        id: 9,
        name: 'Bi-horn',
        params: {A: 1.0, B: 1.0, C: 1.0},
        u: {begin: -PI, end: PI, dist: 0.1},
        v: {begin: -PI, end: PI, dist: 0.1},
        fx: (u, v) => (2 - cos(v)) * cos(u),
        fy: (u, v) => (2 - sin(v)) * cos(u),
        fz: (u, v) => sin(u),
        scale: DEFAULT_SCALE * 2
    });

    surface_types.push({
        id: 10,
        name: 'Pseudo-sphere 1',
        params: {A: 1.0, B: 1.0, C: 1.0},
        u: {begin: -PI, end: PI, dist: 0.1},
        v: {begin: -3, end: 3, dist: 0.1},
        fx: (u, v) => cos(u) / cosh(v),
        fy: (u, v) => sin(u) / cosh(v),
        fz: (u, v) => v - tanh(v),
        scale: DEFAULT_SCALE * 3
    });

    surface_types.push({
        id: 11,
        name: 'Pseudo-sphere 2 (half)',
        params: {A: 1.0, B: 1.0, C: 1.0},
        u: {begin: -PI, end: PI, dist: 0.2},
        v: {begin: 0, end: 4, dist: 0.2},
        fx: (u, v) => cos(u) / cosh(v),
        fy: (u, v) => sin(u) / cosh(v),
        fz: (u, v) => v - tanh(v),
        scale: DEFAULT_SCALE * 3
    });

    surface_types.push({
        id: 12,
        name: 'Helicoid 1',
        params: {A: PI / 2, B: PI / 2, C: PI / 2},
        u: {begin: -PI, end: PI, dist: 0.2},
        v: {begin: -PI, end: PI, dist: 0.2},
        fx: (u, v) => cos(A) * cos(v) * cosh(u) + sin(A) * sin(v) * sinh(u),
        fy: (u, v) => cos(B) * sin(v) * cosh(u) - sin(B) * cos(v) * sinh(u),
        fz: (u, v) => cos(C) * u + sin(C) * v,
        scale: DEFAULT_SCALE / 2
    });

    surface_types.push({
        id: 13,
        name: 'Helicoid 2',
        params: {A: PI / 2, B: PI, C: PI / 2},
        u: {begin: -PI, end: PI, dist: 0.2},
        v: {begin: -PI, end: PI, dist: 0.2},
        fx: (u, v) => cos(A) * cos(v) * cosh(u) + sin(A) * sin(v) * sinh(u),
        fy: (u, v) => cos(B) * sin(v) * cosh(u) - sin(B) * cos(v) * sinh(u),
        fz: (u, v) => cos(C) * u + sin(C) * v,
        scale: DEFAULT_SCALE / 2
    });

    surface_types.push({
        id: 14,
        name: 'Katenoid',
        params: {A: 6.0, B: 6.0, C: 6.0},
        u: {begin: -PI, end: PI, dist: 0.2},
        v: {begin: -PI, end: PI, dist: 0.2},
        fx: (u, v) => cos(A) * cos(v) * cosh(u) + sin(A) * sin(v) * sinh(u),
        fy: (u, v) => cos(B) * sin(v) * cosh(u) - sin(B) * cos(v) * sinh(u),
        fz: (u, v) => cos(C) * u + sin(C) * v,
        scale: DEFAULT_SCALE / 2
    });

    surface_types.push({
        id: 15,
        name: 'Plücker\'s conoid',
        params: {A: 6.0, B: 6.0, C: 6.0},
        u: {begin: -PI, end: PI, dist: 0.2},
        v: {begin: -PI, end: PI, dist: 0.2},
        fx: (u, v) => A * cos(v),
        fy: (u, v) => B * sin(v),
        fz: (u, v) => C * cos(4 * v),
        scale: DEFAULT_SCALE / 2
    });

    surface_types.push({
        id: 16,
        name: 'Milk carton (in french "Berlingot")',
        params: {A: 1.0, B: 2, C: 0.0},
        u: {begin: -PI, end: PI, dist: 0.2},
        v: {begin: -PI, end: PI, dist: 0.2},
        fx: (u, v) => B * A * (1 + u) * cos(v),
        fy: (u, v) => B * A * (1 - u) * sin(v),
        fz: (u, v) => A * u,
        scale: DEFAULT_SCALE / 2
    });

    surface_types.push({
        id: 17,
        name: 'Möbius surface',
        params: {A: 6.0, B: 6.0, C: 0.0},
        u: {begin: -PI, end: PI, dist: 0.2},
        v: {begin: -PI, end: PI, dist: 0.2},
        fx: (u, v) => (A + u * cos(v / 2)) * cos(v),
        fy: (u, v) => (B + u * cos(v / 2)) * sin(v),
        fz: (u, v) => (C + u * sin(v / 2)),
        scale: DEFAULT_SCALE / 2
    });

    // https://blender.stackexchange.com/questions/18955/modelling-a-klein-bottle
    surface_types.push({
        id: 18,
        name: 'Klein bottle',
        params: {A: 0.0, B: 0.0, C: 0.0},
        u: {begin: 0, end: PI, dist: 0.05},
        v: {begin: 0, end: TAU, dist: 0.1},
        fx: (u, v) => -2 / 15 * cos(u) * (3 * cos(v) - 30 * sin(u) + 90 * cos(u) ** 4 * sin(u) - 60 * cos(u) ** 6 * sin(u) + 5 * cos(u) * cos(v) * sin(u)),
        fy: (u, v) => -1 / 15 * sin(u) * (3 * cos(v) - 3 * cos(u) ** 2 * cos(v) - 48 * cos(u) ** 4 * cos(v) + 48 * cos(u) ** 6 * cos(v) - 60 * sin(u) + 5 * cos(u) * cos(v) * sin(u) - 5 * cos(u) ** 3 * cos(v) * sin(u) - 80 * cos(u) ** 5 * cos(v) * sin(u) + 80 * cos(u) ** 7 * cos(v) * sin(u)),
        fz: (u, v) => 2 / 15 * (3 + 5 * cos(u) * sin(u)) * sin(v),
        scale: DEFAULT_SCALE * 2
    });

    // http://paulbourke.net/geometry/toroidal/
    surface_types.push({
        id: 19,
        name: 'Limpet Torus',
        params: {A: 2.0, B: 0.0, C: 0.0},
        u: {begin: -PI, end: PI, dist: 0.1},
        v: {begin: -PI, end: PI, dist: 0.1},
        fx: (u, v) => cos(u) / (sqrt(A) + sin(v)),
        fy: (u, v) => sin(u) / (sqrt(A) + sin(v)),
        fz: (u, v) => 1 / (sqrt(A) + cos(v)),
        scale: DEFAULT_SCALE * 1.5
    });

    // http://paulbourke.net/geometry/toroidal/
    surface_types.push({
        id: 20,
        name: 'Figure 8 Torus by Paul Bourke',
        params: {A: 0, B: 0, C: pow(2, 1 / 4)},
        u: {begin: -PI, end: PI, dist: 0.1},
        v: {begin: -PI, end: PI, dist: 0.1},
        fx: (u, v) => cos(u) * (C + sin(v) * cos(u) - sin(2 * v) * sin(u) / 2),
        fy: (u, v) => sin(u) * (C + sin(v) * cos(u) - sin(2 * v) * sin(u) / 2),
        fz: (u, v) => sin(u) * sin(v) + cos(u) * sin(2 * v) / 2,
        scale: DEFAULT_SCALE * 2
    });

    // http://paulbourke.net/geometry/toroidal/
    surface_types.push({
        id: 21,
        name: 'Torus by Roger Bagula',
        params: {A: pow(2, 1 / 4), B: 0, C: 0},
        u: {begin: -PI, end: PI, dist: 0.1},
        v: {begin: -PI, end: PI, dist: 0.1},
        fx: (u, v) => cos(u) * (A + cos(v)),
        fy: (u, v) => sin(u) * (A + sin(v)),
        fz: (u, v) => sqrt(pow((u / PI), 2) + pow((v / PI), 2)),
        scale: DEFAULT_SCALE * 2
    });

    // http://paulbourke.net/geometry/toroidal/
    surface_types.push({
        id: 22,
        name: 'Saddle torus by Roger Bagula',
        params: {
            A: 2, B: 3,
            C: (s) => 1 - cos2(s) - cos2(s + TAU / B)
        },
        u: {begin: 0, end: TAU, dist: 0.1},
        v: {begin: 0, end: TAU, dist: 0.1},
        fx: (u, v) => (A + cos(u)) * cos(v),
        fy: (u, v) => (A + cos(u + TAU / B)) * cos(v + TAU / B),
        fz: (u, v) => (A + sign(C(u)) * sqrt(abs(C(u)))) * sign(C(v)) * sqrt(abs(C(v))),
        scale: DEFAULT_SCALE * 2
    });

    // http://paulbourke.net/geometry/toroidal/
    surface_types.push({
        id: 23,
        name: 'Triaxial Hexatorus',
        params: {A: 2, B: 3, C: 0},
        u: {begin: 0, end: TAU, dist: 0.1},
        v: {begin: 0, end: TAU, dist: 0.1},
        fx: (u, v) => sin(u) / (sqrt(A) + cos(v)),
        fy: (u, v) => sin(u + TAU / B) / (sqrt(2) + cos(v + TAU / B)),
        fz: (u, v) => cos(u - TAU / B) / (sqrt(2) + cos(v - TAU / B)),
        scale: DEFAULT_SCALE * 2
    });

    // http://paulbourke.net/geometry/toroidal/
    surface_types.push({
        id: 24,
        name: 'Triaxial Tritorus',
        params: {A: 1, B: 3, C: 0},
        u: {begin: -PI, end: PI, dist: 0.1},
        v: {begin: -PI, end: PI, dist: 0.1},
        fx: (u, v) => sin(u) * (A + cos(v)),
        fy: (u, v) => sin(u + TAU / B) * (1 + cos(v + TAU / B)),
        fz: (u, v) => sin(u + TWO_TAU / B) * (1 + cos(v + TWO_TAU / B)),
        scale: DEFAULT_SCALE * 2
    });

    // http://paulbourke.net/geometry/toroidal/
    surface_types.push({
        id: 25,
        name: 'Bow Curve By Paul Bourke',
        params: {A: .7, B: 0, C: 0},
        u: {begin: 0, end: 1, dist: 0.05},
        v: {begin: 0, end: 1, dist: 0.01},
        fx: (u, v) => (2 + A * sin(TAU * u)) * sin(TWO_TAU * v),
        fy: (u, v) => (2 + A * sin(TAU * u)) * cos(TWO_TAU * v),
        fz: (u, v) => A * cos(TAU * u) + 3 * cos(TAU * v),
        scale: DEFAULT_SCALE
    });

    surface_types.push({
        id: 26,
        name: 'grid',
        params: {A: 0, B: 0, C: 0},
        u: {begin: -10, end: 10, dist: .5},
        v: {begin: -10, end: 10, dist: .5},
        fx: (u, v) => u,
        fy: (u, v) => v,
        fz: (u, v) => 0,
        scale: DEFAULT_SCALE
    });

    surface_types.push({
        id: 27,
        name: 'wave1',
        params: {A: 0, B: 0, C: 0},
        u: {begin: -10, end: 10, dist: .5},
        v: {begin: -10, end: 10, dist: .5},
        fx: (u, v) => u,
        fy: (u, v) => v,
        fz: (u, v) => cos(sqrt(u * u + v * v)),
        scale: DEFAULT_SCALE
    });

    surface_types.push({
        id: 28,
        name: 'wave2',
        params: {A: 0, B: 0, C: 0},
        u: {begin: -10, end: 10, dist: .5},
        v: {begin: -10, end: 10, dist: .5},
        fx: (u, v) => .75 * v,
        fy: (u, v) => sin(u) * v,
        fz: (u, v) => cos(u) * cos(v),
        scale: DEFAULT_SCALE
    });

    surface_types.push({
        id: 29,
        name: 'wave3',
        params: {A: 0, B: 0, C: 0},
        u: {begin: 0, end: 50, dist: .5},
        v: {begin: -10, end: 10, dist: .5},
        fx: (u, v) => .75 * v,
        fy: (u, v) => sin(u) * v,
        fz: (u, v) => cos(u) * cos(v),
        scale: DEFAULT_SCALE
    });

    function setSurface(shape_name) {
        var current_type = -1;
        for (let i = 0, imax = surface_types.length; i < imax; i++) {
            let item = surface_types[i];
            if (item.name == shape_name) {
                current_type = i;
                break;
            }
        }
        if (current_type != -1) {
            let surface = surface_types[current_type];
            current_surface_type = current_type;
            current_surface_name = surface.name;
            A = surface.params.A;
            B = surface.params.B;
            C = surface.params.C;
            SCALE = surface.scale;
            FX = surface.fx;
            FY = surface.fy;
            FZ = surface.fz;
        } else {
            console.warn(`surface ID (${current_type}) not found - ignored`);
        }
        return getInfos();
    }

    function getInfos() {
        return {
            id: current_surface_type,
            name: current_surface_name,
            fx: FX.toString(),
            fy: FY.toString(),
            fz: FZ.toString(),
            A: A,
            B: B,
            C: C,
            scale: SCALE
        }
    }

    function getDefaultScale() {
        return DEFAULT_SCALE;
    }

    function getList() {
        return surface_types.map(item => item.name)
    }

    /**
     * Experimental function (not finalized)
     */
    function curvesInMesh() {
        let surface = surface_types[current_surface_type];

        let uMin = surface.u.begin;
        let uMax = surface.u.end;
        let uCount = (uMax - uMin) / surface.u.dist;

        let vMin = surface.u.begin;
        let vMax = surface.v.end;
        let vCount = (vMax - vMin) / surface.v.dist;
console.log({uCount, uMin, uMax, udist: surface.u.dist});
console.log({vCount, vMin, vMax, vdist: surface.v.dist});

/*
        if (vCount > uCount) {
            uCount = vCount;
        } else {
            vCount = uCount;
        }
*/
console.log({uCount, vCount});

        points = [];
        edges = [];
        polys = [];

        let tmpPoints = [];

        for (let iv = 0; iv <= vCount; iv++) {
            tmpPoints[iv] = [];
            for (let iu = 0; iu <= uCount; iu++) {
                let u = map(iu, 0, uCount, uMin, uMax);
                let v = map(iv, 0, vCount, vMin, vMax);

                let x = FX(u, v);
                let y = FY(u, v);
                let z = FZ(u, v);

                tmpPoints[iv][iu] = {adr: -1, coords: {x: x, y: y, z: z}};

                let point = tmpPoints[iv][iu];
                let numpoint = points.length;
                points[numpoint] = point.coords;
                point.adr = numpoint;
            }
        }
/*
        let v = surface.v.begin;
        let iv = 0;
        while (v <= surface.v.end) {
          let u = surface.u.begin;
          let iu = 0;
          tmpPoints[iv] = [];
          while (u <= surface.u.end) {
              let x = FX(u, v);
              let y = FY(u, v);
              let z = FZ(u, v);
              tmpPoints[iv][iu] = {adr: -1, coords: {x: x, y: y, z: z}};

              let point = tmpPoints[iv][iu];
              let numpoint = points.length;
              points[numpoint] = point.coords;
              point.adr = numpoint;

              u = u + surface.u.dist;
              iu++;
          }
          uCount = iu;
          v = v + surface.v.dist;
          iv++;
        }
        vCount = iv;

*/
console.log(tmpPoints);
        for (let iv = 0, ivmax=tmpPoints.length; iv < ivmax; iv++) {
            for (let iu = 0, iumax=tmpPoints[iv].length; iu < iumax; iu++) {
                let point_a = tmpPoints[iv][iu];
                let point_b = tmpPoints[iv + 1][iu];

                let point_c = tmpPoints[iv + 1][iu + 1];
                let point_d = tmpPoints[iv][iu + 1];

                //  edges.push({a: point_a.adr, b: point_b.adr});
                //  edges.push({a: point_b.adr, b: point_c.adr});
                //  edges.push({a: point_c.adr, b: point_d.adr});
                //  edges.push({a: point_a.adr, b: point_d.adr});
if (point_c != undefined)
                polys.push([point_a.adr, point_c.adr, point_b.adr, point_a.adr]);
                //polys.push([point_a.adr, point_d.adr, point_c.adr, point_a.adr]);
            }
        }

        return {
            points: points,
            edges: edges,
            polygons: polys
        }
    }

    function curvesInU() {
        let surface = surface_types[current_surface_type];
        points = [];
        edges = [];
        polys = [];
        curpoly = -1;
        let x, y, z;
        let u = surface.u.begin;
        while (u <= surface.u.end) {
            let v = surface.v.begin;
            x = FX(u, v);
            y = FY(u, v);
            z = FZ(u, v);

            moveXYZ(x, y, z);
            while (v <= surface.v.end) {
                x = FX(u, v);
                y = FY(u, v);
                z = FZ(u, v);
                drawXYZ(x, y, z);
                v = v + surface.v.dist;
            }
            u = u + surface.u.dist;
        }
        return {
            points: points,
            edges: edges,
            polygons: polys
        }
    }

    function curvesInV() {
        let surface = surface_types[current_surface_type];
        points = [];
        edges = [];
        polys = [];
        curpoly = -1;
        let x, y, z;

        let v = surface.v.begin;
        while (v <= surface.v.end) {
            let u = surface.u.begin;
            x = FX(u, v);
            y = FY(u, v);
            z = FZ(u, v);

            moveXYZ(x, y, z);
            while (u <= surface.u.end) {
                x = FX(u, v);
                y = FY(u, v);
                z = FZ(u, v);
                drawXYZ(x, y, z);
                u = u + surface.u.dist;
            }
            v = v + surface.v.dist;
        }
        return {
            points: points,
            edges: edges,
            polygons: polys
        }
    }

    function moveXYZ(x, y, z) {
        last_point = points.length;
        points[last_point] = {x: x, y: y, z: z};

        curpoly++;
        polys[curpoly] = [];
        polys[curpoly].push(last_point);
    }

    function drawXYZ(x, y, z) {
        let new_point = points.length;
        points[new_point] = {x: x, y: y, z: z};

        edges.push({a: last_point, b: new_point});
        polys[curpoly].push(new_point);
        last_point = new_point;
    }

    // Default values initialized with the first surface of the list (Ellipsoid)
    setSurface(surface_types[current_surface_type].name);

    // Declare here public functions and constants (the items not declared here are private)
    return {
        curvesInU: curvesInU,
        curvesInV: curvesInV,
        curvesInMesh: curvesInMesh,
        getInfos: getInfos,
        getList: getList,
        setSurface: setSurface,
        getDefaultScale: getDefaultScale
    };
})();
