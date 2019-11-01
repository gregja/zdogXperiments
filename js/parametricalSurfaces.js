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
        cos, sin, PI, tan, tanh, cosh, sinh, sqrt, pow, abs, sign, max, floor, log, exp
    } = Math;

    const TAU = PI * 2;
    const TWO_TAU = TAU * 2;
    const HALF_PI = PI / 2;

    const cos2 = (x) => pow(cos(x), 2);

    // function power taken on http://www.generative-gestaltung.de/2/
    const power = (b, e) => {
        if (b >= 0 || floor(e) == e) {
            return pow(b, e);
        }
        else {
            return -pow(-b, e);
        }
    };

    const square = function (x) {
        return x*x;
    }

    const mod2 = function (a, b) {
        var c = a % b;
        return c > 0 ? c : (c + b);
    }

    let current_surface_type = 0;
    let current_surface_name = '';

    const DEFAULT_SCALE = 50;

    // Values for the current surface (setted by the call of the "setSurface" function)
    let A, B, C, D;
    let FX = (u, v) => false;
    let FY = (u, v) => false;
    let FZ = (u, v) => false;
    let FXYZ = (u, v) => false;
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
        name: 'Sphere 1 (truncated)',
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
        name: 'Sphere 2',
        params: {A: 2.0, B: 1.0, C: 0},
        u: {begin: -PI / 2, end: PI / 2, dist: 0.2},
        v: {begin: -PI, end: PI, dist: 0.2},
        fx: (u, v) => A * (sin(v) * sin(u)),
        fy: (u, v) => A * (B * cos(v)),
        fz: (u, v) => A * (sin(v) * cos(u)),
        scale: DEFAULT_SCALE * 2
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
/*
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
*/
    surface_types.push({
        id: 15,
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
        id: 16,
        name: 'Möbius ribbon v1',
        params: {A: 6.0, B: 6.0, C: 0.0},
        u: {begin: -PI, end: PI, dist: 0.2},
        v: {begin: -PI, end: PI, dist: 0.2},
        fx: (u, v) => (A + u * cos(v / 2)) * cos(v),
        fy: (u, v) => (B + u * cos(v / 2)) * sin(v),
        fz: (u, v) => (C + u * sin(v / 2)),
        scale: DEFAULT_SCALE / 2
    });

    surface_types.push({
        id: 17,
        name: 'Möbius ribbon v2',
        params: {A: 1, B: 0, C: 0},
        u: {begin: 0, end: 8*PI, dist: .2},
        v: {begin: -2, end: 2, dist: .2},
        fx: (u, v) => sin(u)*(-2+v*sin(u/2)),
        fy: (u, v) => cos(u)*(-2+v*sin(u/2)),
        fz: (u, v) => v*cos(u/2),
        scale: DEFAULT_SCALE
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
        name: 'wave',
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
        name: 'complex wave',
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
        name: 'shell(1)',
        params: {A: .5, B: 1, C: 2, D:3},
        u: {begin: -10, end: 10, dist: .5},
        v: {begin: -10, end: 10, dist: .5},
        fx: (u, v) => B * (1 - (u / TAU)) * cos(A*u) * (1 + cos(v)) + C * cos(A*u),
        fy: (u, v) => B * (1 - (u / TAU)) * sin(A*u) * (1 + cos(v)) + C * sin(A*u),
        fz: (u, v) => D * (u / TAU) + A * (1 - (u / TAU)) * sin(v),
        scale: DEFAULT_SCALE
    });

    surface_types.push({
        id: 30,
        name: 'shell(2)',
        params: {A: 2, B: 0.5, C: .1, D:1.5},
        u: {begin: -10, end: 10, dist: .5},
        v: {begin: -10, end: 10, dist: .5},
        fx: (u, v) => B * (1 - (u / TAU)) * cos(A*u) * (1 + cos(v)) + C * cos(A*u),
        fy: (u, v) => B * (1 - (u / TAU)) * sin(A*u) * (1 + cos(v)) + C * sin(A*u),
        fz: (u, v) => D * (u / TAU) + A * (1 - (u / TAU)) * sin(v),
        scale: DEFAULT_SCALE
    });

    surface_types.push({
        id: 31,
        name: 'paraboloid',
        params: {A: PI, B: 0, C: 0},
        u: {begin: -10, end: 10, dist: .5},
        v: {begin: -10, end: 10, dist: .5},
        fx: (u, v) => power((v/A),0.5) * sin(u),
        fy: (u, v) => v,
        fz: (u, v) => power((v/A),0.5) * cos(u),
        scale: DEFAULT_SCALE
    });

    surface_types.push({
        id: 320,
        name: 'steinbachScrew(1)',
        params: {A: 1, B: 0, C: 0},
        u: {begin: -3, end: 3, dist: .5},
        v: {begin: -PI, end: PI, dist: .1},
        fx: (u, v) => u * cos(v),
        fy: (u, v) => u * sin(A * v),
        fz: (u, v) => v * cos(u),
        scale: DEFAULT_SCALE
    });

    surface_types.push({
        id: 321,
        name: 'steinbachScrew(2)',
        params: {A: 1, B: 0, C: 0},
        u: {begin: -10, end: 10, dist: .5},
        v: {begin: -10, end: 10, dist: .5},
        fx: (u, v) => u * cos(v),
        fy: (u, v) => u * sin(A * v),
        fz: (u, v) => v * cos(u),
        scale: DEFAULT_SCALE / 2
    });

    surface_types.push({
        id: 33,
        name: 'corkscrew',
        params: {A: 1, B: 0, C: 0},
        u: {begin: -10, end: 10, dist: .5},
        v: {begin: -10, end: 10, dist: .5},
        fx: (u, v) => cos(u) * cos(v),
        fy: (u, v) => sin(u) * cos(v),
        fz: (u, v) => sin(v) + A * u,
        scale: DEFAULT_SCALE
    });

    surface_types.push({
        id: 34,
        name: 'trianguloid',
        params: {A: .5, B: 0, C: 0},
        u: {begin: -10, end: 10, dist: .5},
        v: {begin: -10, end: 10, dist: .5},
        fx: (u, v) => 0.75 * (sin(3*u) * 2 / (2 + cos(v))),
        fy: (u, v) => 0.75 * ((sin(u) + 2 * A * sin(2*u)) * 2 / (2 + cos(v + TAU))),
        fz: (u, v) => 0.75 * ((cos(u) - 2 * A * cos(2*u)) * (2 + cos(v)) * ((2 + cos(v + TAU/3))*0.25)),
        scale: DEFAULT_SCALE * 2
    });

    surface_types.push({
        id: 35,
        name: 'kidney',
        params: {A: .1, B: 0, C: 0},
        u: {begin: -10, end: 10, dist: .5},
        v: {begin: -10, end: 10, dist: .5},
        fxyz: (u, v) => {
            u /= 2;
            let x = cos(u) * (A * 3 * cos(v) - cos(3 * v));
            let y = sin(u) * (A * 3 * cos(v) - cos(3 * v));
            let z = 3 * sin(v) - sin(3 * v);
            return {x:x, y:y, z:z};
        },
        scale: DEFAULT_SCALE * 2
    });

    surface_types.push({
        id: 36,
        name: 'maeders owl',
        params: {A: .1, B: 0, C: 0},
        u: {begin: -10, end: 10, dist: .5},
        v: {begin: -10, end: 10, dist: .5},
        fx: (u, v) => 0.4 * (v * cos(u) - 0.5*A * power(v,2) * cos(2 * u)),
        fy: (u, v) => 0.4 * (-v * sin(u) - 0.5*A * power(v,2) * sin(2 * u)),
        fz: (u, v) => 0.4 * (4 * power(v,1.5) * cos(3 * u / 2) / 3),
        scale: DEFAULT_SCALE
    });

    surface_types.push({
        id: 37,
        name: 'astroidal ellipsoid',
        params: {A: .5, B: 0, C: 0},
        u: {begin: -10, end: 10, dist: .5},  // begin: -1, end: 1, dist: .1
        v: {begin: -10, end: 10, dist: .5},  // begin: -1, end: 1, dist: .1
        fxyz: (u, v) => {
            u /= 2;
            let x = 3 * power(cos(u)*cos(v),3*A);
            let y = 3 * power(sin(u)*cos(v),3*A);
            let z = 3 * power(sin(v),3*A);
            return {x:x, y:y, z:z};
        },
        scale: DEFAULT_SCALE
    });

    surface_types.push({
        id: 38,
        name: 'lemniscate',
        params: {A: 1.5, B: 0, C: 0},
        u: {begin: -PI, end: PI, dist: .1},
        v: {begin: -PI, end: PI, dist: .1},
        fxyz: (u, v) => {
            u /= 2;
            let cosvSqrtAbsSin2u = cos(v) * sqrt(abs(sin(2 * A * u)));
            let x = cosvSqrtAbsSin2u * sin(u);
            let y = cosvSqrtAbsSin2u * sin(u);
            let z = 3 * (power(x,2) - power(y,2) + 2 * x * y * power(tan(v),2));
            x *= 3;
            y *= 3;
            return {x:x, y:y, z:z};
        },
        scale: DEFAULT_SCALE
    });
    
    // https://echarts.apache.org/examples/en/editor.html?c=surface-mollusc-shell&gl=1
    surface_types.push({
        id: 39,
        name: 'mollusc-shell',
        params: {A: 1.16, B: 1, C: 2},
        u: {begin: -PI, end: PI, dist: PI / 40},
        v: {begin: -15, end: 6, dist: .21},
        fxyz: (u, v) => {
            let x = pow(A, v) * cos(v) * (B + cos(u));
            let y = -pow(A, v) * sin(v) * (B + cos(u));
            let z = -C * pow(A, v) * (B + sin(u));
            return {x:x, y:y, z:z};
        },
        scale: DEFAULT_SCALE
    });

    // https://echarts.apache.org/examples/en/editor.html?c=line3d-orthographic&gl=1
    surface_types.push({
        id: 40,
        name: 'great spring',
        params: {A: 0.25, B: 75, C: 2.0},
        u: {begin: 0, end: 1, dist: 1},
        v: {begin: 0, end: 25, dist: 0.001},
        fxyz: (u, v) => {
            let x = (1 + A * cos(B * v)) * cos(v);
            // let x = (1 + A * cos(B * u)) * cos(u);  résultats intéressants avec (u) au lieu de (v), à étudier
            let y = (1 + A * cos(B * v)) * sin(v);
            let z = v + C * sin(B * v);
            return {x:x, y:y, z:z};
        },
        scale: DEFAULT_SCALE
    });

    // https://echarts.apache.org/examples/en/editor.html?c=sphere-parametric-surface&gl=1
    surface_types.push({
      id: 41,
      name: 'great sphere',
      params: {A: 0, B: 0, C: 0},
      u: {begin: -PI, end: PI, dist: PI / 40},
      v: {begin: 0, end: PI, dist: PI / 40},
      fxyz: (u, v) => {
          let x = sin(v) * sin(u);
          let y = sin(v) * cos(u);
          let z = cos(v);
          return {x:x, y:y, z:z};
      },
      scale: DEFAULT_SCALE * 4
  });

  // https://echarts.apache.org/examples/en/editor.html?c=metal-surface&gl=1
  surface_types.push({
      id: 42,
      name: 'great creature',
      params: {A: 0.4, B: 0, C: 0},
      u: {begin: -13.2, end: 13.2, dist: 0.4},  // begin: -1, end: 1, dist: .1
      v: {begin: -37.4, end: 37.4, dist: 0.4},  // begin: -1, end: 1, dist: .1
      fxyz: (u, v) => {
          let r = 1 - A * A;
          let w = sqrt(r);
          let x_denom = A * (pow(w * cosh(A * u), 2) + A * pow(sin(w * v), 2))
          let x = -u + (2 * r * cosh(A * u) * sinh(A * u) / x_denom);
          let y_denom = A * (pow(w * cosh(A * u), 2) + A * pow(sin(w * v), 2))
          let y = 2 * w * cosh(A * u) * (-(w * cos(v) * cos(w * v)) - (sin(v) * sin(w * v))) / y_denom;
          let z_denom = A * (pow(w * cosh(A * u), 2) + A * pow(sin(w * v), 2))
          let z = 2 * w * cosh(A * u) * (-(w * sin(v) * cos(w * v)) + (cos(v) * sin(w * v))) / z_denom
          return {x:x, y:y, z:z};
      },
      scale: DEFAULT_SCALE
    });

    // https://echarts.apache.org/examples/en/editor.html?c=parametric-surface-rose&gl=1
    surface_types.push({
      id: 43,
      name: 'Rose',
      params: {A: 0, B: 0, C: 0},
      u: {begin: 0, end: 1, dist: 1 / 24},
      v: {begin: -(20/9) * PI, end: 15 * PI, dist: ((15 * PI)- (-(20/9) * PI)) / 575},
      fxyz: (u, v, x1=0) => {
          let x = ((x1, theta) => {
              let phi = (PI/2)*exp(-theta/(8*PI));
              let y1 = 1.9565284531299512*square(x1)*square(1.2768869870150188*x1-1)*sin(phi);
              let X = 1-square(1.25*square(1-mod2((3.6*theta),(2*PI))/PI)-0.25)/2;
              let r = X*(x1*sin(phi)+y1*cos(phi));
              return r * sin(theta);
          })(u, v);
          let y = ((x1, theta) => {
              let phi = (PI/2)*exp(-theta/(8*PI));
              let y1 = 1.9565284531299512*square(x1)*square(1.2768869870150188*x1-1)*sin(phi);
              let X = 1-square(1.25*square(1-mod2((3.6*theta),(2*PI))/PI)-0.25)/2;
              let r = X*(x1*sin(phi)+y1*cos(phi));
              return r * cos(theta);
          })(u, v);
          let z = ((x1, theta) => {
              let phi = (PI/2)*exp(-theta/(8*PI));
              let y1 = 1.9565284531299512*square(x1)*square(1.2768869870150188*x1-1)*sin(phi);
              let X = 1-square(1.25*square(1-mod2((3.6*theta),(2*PI))/PI)-0.25)/2;
              let r = X*(x1*sin(phi)+y1*cos(phi));
              return X*(x1*cos(phi)-y1*sin(phi));
          })(u, v);
          if (x1 == 0) {
            x1 = x;
          }
          return {x:x, y:y, z:z};
      },
      scale: DEFAULT_SCALE * 4
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
            FX = null;
            FY = null;
            FZ = null;
            FXYZ = null;
            let surface = surface_types[current_type];
            current_surface_type = current_type;
            current_surface_name = surface.name;
            A = surface.params.A;
            B = surface.params.B;
            C = surface.params.C;
            D = surface.params.D || null;
            SCALE = surface.scale;
            if (typeof surface.fxyz === 'function') {
                FXYZ = surface.fxyz;
            } else {
                FX = surface.fx;
                FY = surface.fy;
                FZ = surface.fz;
            }
        } else {
            console.warn(`surface ID (${current_type}) not found - ignored`);
        }
        return getInfos();
    }

    function getInfos() {
        return {
            id: current_surface_type,
            name: current_surface_name,
            fx: (typeof FX === "function") ? FX.toString() : null,
            fy: (typeof FY === "function") ? FY.toString() : null,
            fz: (typeof FZ === "function") ? FZ.toString() : null,
            fxyz: (typeof FXYZ === "function") ? FXYZ.toString() : null,
            A: A,
            B: B,
            C: C,
            D: D,
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
     * curvesInMesh
     * @param render_mode (1=draw one facet on two; 2=draw all facets)
     * @returns {{polygons: Array, edges: Array, points: Array}}
     */
    function curvesInMesh(render_mode=1) {
        let surface = surface_types[current_surface_type];

        points = [];
        edges = [];
        polys = [];

        let tmpPoints = [];

        // first step : precalculation of coordinates and storage in a temporary array (with two entries)
        let v = surface.v.begin;
        let vmax = surface.v.end + (surface.v.dist/2);
        let umax = surface.u.end + (surface.u.dist/2);
        let iv = 0;
        while (v <= vmax) {
            tmpPoints[iv] = [];
            let u = surface.u.begin;
            let iu = 0;
            while (u <= umax) {
                let x, y, z;
                if (typeof FXYZ === "function") {
                    let res = FXYZ(u, v);
                    x = res.x;
                    y = res.y;
                    z = res.z;
                } else {
                    x = FX(u, v);
                    y = FY(u, v);
                    z = FZ(u, v);
                }
                tmpPoints[iv][iu] = {adr: -1, coords: {x: x, y: y, z: z}};
                u += surface.u.dist;
                iu++;
            }
            v += surface.v.dist;
            iv++;
        }

        let vCount = tmpPoints.length;
        let uCount = tmpPoints[0].length;

        // second step : feed the "points" array with property "adr" (address) for linking points in the third step
        for (let iv = 0; iv < vCount; iv++) {
            for (let iu = 0; iu < uCount; iu++) {
                let point = tmpPoints[iv][iu];

                let numpoint = points.length;
                points[numpoint] = point.coords;
                point.adr = numpoint;
            }
        }

        // third step : feed the "polygons" array
        for (let iv = 0, ivmax = vCount-1, iumax = uCount-1; iv < ivmax; iv++) {
            for (let iu = 0; iu < iumax; iu++) {
                let point_a = tmpPoints[iv][iu];
                let point_b = tmpPoints[iv + 1][iu];

                let point_c = tmpPoints[iv + 1][iu + 1];
                let point_d = tmpPoints[iv][iu + 1];

                polys.push([point_a.adr, point_c.adr, point_b.adr, point_a.adr]);
                if (render_mode == 2) {
                    polys.push([point_a.adr, point_d.adr, point_c.adr, point_a.adr]);
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
     * Draw the family of curves in U
     */
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

            if (typeof FXYZ === "function") {
                let res = FXYZ(u, v);
                x = res.x;
                y = res.y;
                z = res.z;
            } else {
                x = FX(u, v);
                y = FY(u, v);
                z = FZ(u, v);
            }
            moveXYZ(x, y, z);
            while (v <= surface.v.end) {
                if (typeof FXYZ === "function") {
                    let res = FXYZ(u, v);
                    x = res.x;
                    y = res.y;
                    z = res.z;
                } else {
                    x = FX(u, v);
                    y = FY(u, v);
                    z = FZ(u, v);
                }
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

    /**
     * Draw the family of curves in V
     */
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
            if (typeof FXYZ === "function") {
                let res = FXYZ(u, v);
                x = res.x;
                y = res.y;
                z = res.z;
            } else {
                x = FX(u, v);
                y = FY(u, v);
                z = FZ(u, v);
            }
            moveXYZ(x, y, z);
            while (u <= surface.u.end) {
                if (typeof FXYZ === "function") {
                    let res = FXYZ(u, v);
                    x = res.x;
                    y = res.y;
                    z = res.z;
                } else {
                    x = FX(u, v);
                    y = FY(u, v);
                    z = FZ(u, v);
                }
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
