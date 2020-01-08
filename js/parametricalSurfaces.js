/*          SURFACES OF PARAMETRIC EQUATIONS
* ---------------------------------------------------
* This script draws 3D surfaces defined by equations like
*     x = f(u,v), y = g(u,v), z = h(u,v)
*
* The first version of this JS script was inspired by a program of the book :
* "Graphisme dans le plan et dans l'espace en Turbo Pascal", by R. Dony, ed. MASSON Paris 1990
*
* I progressively enrich it adding some new parametrical function found on internet and in other books.
*
* Author: Gregory Jarrige
* Version : 2020-01-08-A
* MIT License
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
        cos, sin, PI, tan, tanh, cosh, sinh, sqrt, pow, abs,
        sign, max, floor, log, exp, asin, acos
    } = Math;

    const TAU = PI * 2;
    const TWO_TAU = TAU * 2;
    const HALF_PI = PI / 2;

    const DEG_TO_RAD = PI / 180;

    const degToRad = angle => angle * DEG_TO_RAD;
    const radToDeg = angle => angle * ( 180 / PI );

    const cos2 = (x) => pow(cos(x), 2);

    // function power taken on http://www.generative-gestaltung.de/2/
    const power = (b, e) => {
        if (b >= 0 || floor(e) == e) {
            return pow(b, e);
        } else {
            return -pow(-b, e);
        }
    };

    const square = (x) => x * x;

    const mod2 = (a, b) => {
        var c = a % b;
        return c > 0 ? c : (c + b);
    };

    const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

    const easeInQuad = (t, b, c, d) => c*(t/=d)*t + b;

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
    let ROTATION = {};
    let REFER = {};
    let LIMITS = {};

    let last_point = 0;

    let surface_types = [];

    let points = [];
    let edges = [];
    let polys = [];
    let curpoly = -1;

    surface_types.push({
        id: 0,
        name: 'Ellipsoid',
        list:1,
        params: {A: 6.0, B: 3.0, C: 2.0},
        u: {begin: -PI / 2, end: PI / 2, step: 0.2},
        v: {begin: -PI, end: PI, step: 0.2},
        fx: (u, v) => A * cos(u) * cos(v),
        fy: (u, v) => B * cos(u) * sin(v),
        fz: (u, v) => C * sin(u),
        scale: DEFAULT_SCALE
    });
    surface_types.push({
        id: 1,
        name: 'Sphere 1',
        list:1,
        params: {A: 4.0, B: 4.0, C: 4.5},
        u: {begin: -PI / 2, end: PI / 2, step: 0.2},
        v: {begin: -PI, end: PI, step: 0.2},
        fx: (u, v) => A * cos(u) * cos(v),
        fy: (u, v) => B * cos(u) * sin(v),
        fz: (u, v) => C * sin(u),
        scale: DEFAULT_SCALE
    });
    surface_types.push({
        id: 2,
        name: 'Sphere 1 (truncated)',
        list:1,
        params: {A: 4.0, B: 4.0, C: 4.5},
        u: {begin: -PI / 2, end: 1, step: 0.2},
        v: {begin: -PI, end: 1, step: 0.2},
        fx: (u, v) => A * cos(u) * cos(v),
        fy: (u, v) => B * cos(u) * sin(v),
        fz: (u, v) => C * sin(u),
        scale: DEFAULT_SCALE
    });
    surface_types.push({
        id: 3,
        name: 'Sphere 2',
        list:1,
        params: {A: 2.0, B: 1.0},
        u: {begin: -PI / 2, end: PI / 2, step: 0.2},
        v: {begin: -PI, end: PI, step: 0.2},
        fx: (u, v) => A * (sin(v) * sin(u)),
        fy: (u, v) => A * (B * cos(v)),
        fz: (u, v) => A * (sin(v) * cos(u)),
        scale: DEFAULT_SCALE * 2
    });

    surface_types.push({
        id: 4,
        name: 'Torus 1',
        list:1,
        params: {A: 6.0, B: 3.0, C: 3.0},
        u: {begin: -PI, end: PI, step: 0.4},
        v: {begin: -PI, end: PI, step: 0.2},
        fx: (u, v) => (A + B * cos(u)) * cos(v),
        fy: (u, v) => (A + B * cos(u)) * sin(v),
        fz: (u, v) => C * sin(u),
        scale: DEFAULT_SCALE / 2
    });
    surface_types.push({
        id: 5,
        name: 'Torus 2 (tire)',
        list:1,
        params: {A: 6.0, B: 3.0, C: 3.0},
        u: {begin: -PI / 2, end: PI / 2, step: 0.2},
        v: {begin: -PI, end: PI, step: 0.2},
        fx: (u, v) => (A + B * cos(u)) * cos(v),
        fy: (u, v) => (A + B * cos(u)) * sin(v),
        fz: (u, v) => C * sin(u),
        scale: DEFAULT_SCALE / 2
    });
    surface_types.push({
        id: 6,
        name: 'Torus 3 (flattened)',
        list:1,
        params: {A: 6.0, B: 3.0, C: 3.0},
        u: {begin: -PI, end: PI, step: 0.4},
        v: {begin: -PI, end: PI, step: 0.2},
        fx: (u, v) => (A + B * cos(u)) * cos(v),
        fy: (u, v) => (A + B * cos(u)) * sin(v),
        fz: (u, v) => B * sin(v),
        scale: DEFAULT_SCALE / 2
    });
    surface_types.push({
        id: 7,
        name: 'Hyperboloid',
        list:1,
        params: {A: 1.0, B: 1.0, C: 1.0},
        u: {begin: -PI / 2, end: PI / 2, step: 0.2},
        v: {begin: -PI, end: PI, step: 0.2},
        fx: (u, v) => u,
        fy: (u, v) => v,
        fz: (u, v) => u * u - v * v,
        scale: DEFAULT_SCALE
    });
    surface_types.push({
        id: 8,
        name: 'Cone',
        list:1,
        params: {A: PI / 6, B: 1.0, C: 1.0},
        u: {begin: -1, end: 2.6, step: 0.2},
        v: {begin: -2, end: 0, step: 0.2},
        fx: (u, v) => v * cos(u) * sin(A),
        fy: (u, v) => v * sin(u) * sin(A),
        fz: (u, v) => v * cos(A),
        scale: DEFAULT_SCALE * 4
    });

    surface_types.push({
        id: 9,
        name: 'Bi-horn',
        list:1,
        params: {A: 1.0, B: 1.0, C: 1.0},
        u: {begin: -PI, end: PI, step: 0.1},
        v: {begin: -PI, end: PI, step: 0.1},
        fx: (u, v) => (2 - cos(v)) * cos(u),
        fy: (u, v) => (2 - sin(v)) * cos(u),
        fz: (u, v) => sin(u),
        scale: DEFAULT_SCALE * 2
    });

    surface_types.push({
        id: 10,
        name: 'Pseudo-sphere 1',
        list:1,
        params: {A: 1.0, B: 1.0, C: 1.0},
        u: {begin: -PI, end: PI, step: 0.1},
        v: {begin: -3, end: 3, step: 0.1},
        fx: (u, v) => cos(u) / cosh(v),
        fy: (u, v) => sin(u) / cosh(v),
        fz: (u, v) => v - tanh(v),
        scale: DEFAULT_SCALE * 3
    });

    surface_types.push({
        id: 11,
        name: 'Pseudo-sphere 2 (half)',
        list:1,
        params: {A: 1.0, B: 1.0, C: 1.0},
        u: {begin: -PI, end: PI, step: 0.2},
        v: {begin: 0, end: 4, step: 0.2},
        fx: (u, v) => cos(u) / cosh(v),
        fy: (u, v) => sin(u) / cosh(v),
        fz: (u, v) => v - tanh(v),
        scale: DEFAULT_SCALE * 3
    });

    surface_types.push({
        id: 12,
        name: 'Helicoid 1',
        list:1,
        params: {A: PI / 2, B: PI / 2, C: PI / 2},
        u: {begin: -PI, end: PI, step: 0.2},
        v: {begin: -PI, end: PI, step: 0.2},
        fx: (u, v) => cos(A) * cos(v) * cosh(u) + sin(A) * sin(v) * sinh(u),
        fy: (u, v) => cos(B) * sin(v) * cosh(u) - sin(B) * cos(v) * sinh(u),
        fz: (u, v) => cos(C) * u + sin(C) * v,
        scale: DEFAULT_SCALE / 2
    });

    surface_types.push({
        id: 13,
        name: 'Helicoid 2',
        list:1,
        params: {A: PI / 2, B: PI, C: PI / 2},
        u: {begin: -PI, end: PI, step: 0.2},
        v: {begin: -PI, end: PI, step: 0.2},
        fx: (u, v) => cos(A) * cos(v) * cosh(u) + sin(A) * sin(v) * sinh(u),
        fy: (u, v) => cos(B) * sin(v) * cosh(u) - sin(B) * cos(v) * sinh(u),
        fz: (u, v) => cos(C) * u + sin(C) * v,
        scale: DEFAULT_SCALE / 2
    });

    surface_types.push({
        id: 14,
        name: 'Katenoid',
        list:1,
        params: {A: 6.0, B: 6.0, C: 6.0},
        u: {begin: -PI, end: PI, step: 0.2},
        v: {begin: -PI, end: PI, step: 0.2},
        fx: (u, v) => cos(A) * cos(v) * cosh(u) + sin(A) * sin(v) * sinh(u),
        fy: (u, v) => cos(B) * sin(v) * cosh(u) - sin(B) * cos(v) * sinh(u),
        fz: (u, v) => cos(C) * u + sin(C) * v,
        scale: DEFAULT_SCALE / 2
    });
    /*
        surface_types.push({
            id: 15,
            name: 'Plücker\'s conoid',
            list:1,
            params: {A: 6.0, B: 6.0, C: 6.0},
            u: {begin: -PI, end: PI, step: 0.2},
            v: {begin: -PI, end: PI, step: 0.2},
            fx: (u, v) => A * cos(v),
            fy: (u, v) => B * sin(v),
            fz: (u, v) => C * cos(4 * v),
            scale: DEFAULT_SCALE / 2
        });
    */
    surface_types.push({
        id: 15,
        name: 'Milk carton (in french "Berlingot")',
        list:1,
        params: {A: 1.0, B: 2},
        u: {begin: -PI, end: PI, step: 0.2},
        v: {begin: -PI, end: PI, step: 0.2},
        fx: (u, v) => B * A * (1 + u) * cos(v),
        fy: (u, v) => B * A * (1 - u) * sin(v),
        fz: (u, v) => A * u,
        scale: DEFAULT_SCALE / 2
    });

    surface_types.push({
        id: 16,
        name: 'Möbius ribbon v1',
        list:2,
        params: {A: 6.0, B: 6.0, C: 0.0},
        u: {begin: -PI, end: PI, step: 0.2},
        v: {begin: -PI, end: PI, step: 0.2},
        fx: (u, v) => (A + u * cos(v / 2)) * cos(v),
        fy: (u, v) => (B + u * cos(v / 2)) * sin(v),
        fz: (u, v) => (C + u * sin(v / 2)),
        scale: DEFAULT_SCALE / 2
    });

    surface_types.push({
        id: 17,
        name: 'Möbius ribbon v2',
        list:2,
        params: {},
        u: {begin: 0, end: 8 * PI, step: .2},
        v: {begin: -2, end: 2, step: .2},
        fx: (u, v) => sin(u) * (-2 + v * sin(u / 2)),
        fy: (u, v) => cos(u) * (-2 + v * sin(u / 2)),
        fz: (u, v) => v * cos(u / 2),
        scale: DEFAULT_SCALE
    });

    surface_types.push({
        id: 18,
        name: 'Klein bottle',
        link: "https://blender.stackexchange.com/questions/18955/modelling-a-klein-bottle",
        list:2,
        params: {},
        u: {begin: 0, end: PI, step: 0.05},
        v: {begin: 0, end: TAU, step: 0.1},
        fx: (u, v) => -2 / 15 * cos(u) * (3 * cos(v) - 30 * sin(u) +
            90 * cos(u) ** 4 * sin(u) - 60 * cos(u) ** 6 * sin(u) +
            5 * cos(u) * cos(v) * sin(u)),
        fy: (u, v) => -1 / 15 * sin(u) * (3 * cos(v) - 3 * cos(u) ** 2
            * cos(v) - 48 * cos(u) ** 4 * cos(v) + 48 * cos(u) ** 6
            * cos(v) - 60 * sin(u) + 5 * cos(u) * cos(v) * sin(u) - 5
            * cos(u) ** 3 * cos(v) * sin(u) - 80 * cos(u) ** 5 * cos(v)
            * sin(u) + 80 * cos(u) ** 7 * cos(v) * sin(u)),
        fz: (u, v) => 2 / 15 * (3 + 5 * cos(u) * sin(u)) * sin(v),
        scale: DEFAULT_SCALE * 2
    });

    surface_types.push({
        id: 19,
        name: 'Limpet Torus',
        link: "http://paulbourke.net/geometry/toroidal/",
        list:2,
        params: {A: 2.0},
        u: {begin: -PI, end: PI, step: 0.1},
        v: {begin: -PI, end: PI, step: 0.1},
        fx: (u, v) => cos(u) / (sqrt(A) + sin(v)),
        fy: (u, v) => sin(u) / (sqrt(A) + sin(v)),
        fz: (u, v) => 1 / (sqrt(A) + cos(v)),
        scale: DEFAULT_SCALE * 1.5
    });

    surface_types.push({
        id: 20,
        name: 'Torus Figure 8 by Paul Bourke',
        link: "http://paulbourke.net/geometry/toroidal/",
        list:2,
        params: {A: pow(2, 1 / 4)},
        u: {begin: -PI, end: PI, step: 0.1},
        v: {begin: -PI, end: PI, step: 0.1},
        fx: (u, v) => cos(u) * (A + sin(v) * cos(u) - sin(2 * v) * sin(u) / 2),
        fy: (u, v) => sin(u) * (A + sin(v) * cos(u) - sin(2 * v) * sin(u) / 2),
        fz: (u, v) => sin(u) * sin(v) + cos(u) * sin(2 * v) / 2,
        scale: DEFAULT_SCALE * 2
    });

    surface_types.push({
        id: 21,
        name: 'Torus by Roger Bagula',
        link: "http://paulbourke.net/geometry/toroidal/",
        list:2,
        params: {A: pow(2, 1 / 4)},
        u: {begin: -PI, end: PI, step: 0.1},
        v: {begin: -PI, end: PI, step: 0.1},
        fx: (u, v) => cos(u) * (A + cos(v)),
        fy: (u, v) => sin(u) * (A + sin(v)),
        fz: (u, v) => sqrt(pow((u / PI), 2) + pow((v / PI), 2)),
        scale: DEFAULT_SCALE * 2
    });

    surface_types.push({
        id: 22,
        name: 'Saddle torus by Roger Bagula',
        link: "http://paulbourke.net/geometry/toroidal/",
        list:2,
        params: {
            A: 2, B: 3,
            C: (s) => 1 - cos2(s) - cos2(s + TAU / B)
        },
        u: {begin: 0, end: TAU, step: 0.1},
        v: {begin: 0, end: TAU, step: 0.1},
        fx: (u, v) => (A + cos(u)) * cos(v),
        fy: (u, v) => (A + cos(u + TAU / B)) * cos(v + TAU / B),
        fz: (u, v) => (A + sign(C(u)) * sqrt(abs(C(u)))) * sign(C(v)) * sqrt(abs(C(v))),
        scale: DEFAULT_SCALE * 2
    });

    surface_types.push({
        id: 23,
        name: 'Triaxial Hexatorus',
        link: "http://paulbourke.net/geometry/toroidal/",
        list:2,
        params: {A: 2, B: 3},
        u: {begin: 0, end: TAU, step: 0.1},
        v: {begin: 0, end: TAU, step: 0.1},
        fx: (u, v) => sin(u) / (sqrt(A) + cos(v)),
        fy: (u, v) => sin(u + TAU / B) / (sqrt(2) + cos(v + TAU / B)),
        fz: (u, v) => cos(u - TAU / B) / (sqrt(2) + cos(v - TAU / B)),
        scale: DEFAULT_SCALE * 2
    });

    surface_types.push({
        id: 24,
        name: 'Triaxial Tritorus',
        link: "http://paulbourke.net/geometry/toroidal/",
        list:2,
        params: {A: 1, B: 3},
        u: {begin: -PI, end: PI, step: 0.1},
        v: {begin: -PI, end: PI, step: 0.1},
        fx: (u, v) => sin(u) * (A + cos(v)),
        fy: (u, v) => sin(u + TAU / B) * (1 + cos(v + TAU / B)),
        fz: (u, v) => sin(u + TWO_TAU / B) * (1 + cos(v + TWO_TAU / B)),
        scale: DEFAULT_SCALE * 2
    });

    surface_types.push({
        id: 25,
        name: 'Bow Curve By Paul Bourke',
        link: "http://paulbourke.net/geometry/toroidal/",
        list:2,
        params: {A: .7},
        u: {begin: 0, end: 1, step: 0.05},
        v: {begin: 0, end: 1, step: 0.01},
        fx: (u, v) => (2 + A * sin(TAU * u)) * sin(TWO_TAU * v),
        fy: (u, v) => (2 + A * sin(TAU * u)) * cos(TWO_TAU * v),
        fz: (u, v) => A * cos(TAU * u) + 3 * cos(TAU * v),
        scale: DEFAULT_SCALE
    });

    surface_types.push({
        id: 26,
        name: 'Simple grid',
        list:3,
        params: {},
        u: {begin: -10, end: 10, step: .5},
        v: {begin: -10, end: 10, step: .5},
        fx: (u, v) => u,
        fy: (u, v) => v,
        fz: (u, v) => 0,
        scale: DEFAULT_SCALE,
        rotation: {y: TAU/8 }
    });

    surface_types.push({
        id: 27,
        name: 'Wave',
        list:3,
        params: {},
        u: {begin: -10, end: 10, step: .5},
        v: {begin: -10, end: 10, step: .5},
        fx: (u, v) => u,
        fy: (u, v) => v,
        fz: (u, v) => cos(sqrt(u * u + v * v)),
        scale: DEFAULT_SCALE
    });

    surface_types.push({
        id: 28,
        name: 'Weird wave',
        list:3,
        params: {},
        u: {begin: -10, end: 10, step: .5},
        v: {begin: -10, end: 10, step: .5},
        fx: (u, v) => .75 * v,
        fy: (u, v) => sin(u) * v,
        fz: (u, v) => cos(u) * cos(v),
        scale: DEFAULT_SCALE
    });

    surface_types.push({
        id: 29,
        name: 'Shell(1)',
        list:2,
        params: {A: .5, B: 1, C: 2, D: 3},
        u: {begin: -10, end: 10, step: .5},
        v: {begin: -10, end: 10, step: .5},
        fx: (u, v) => B * (1 - (u / TAU)) * cos(A * u) * (1 + cos(v)) + C * cos(A * u),
        fy: (u, v) => B * (1 - (u / TAU)) * sin(A * u) * (1 + cos(v)) + C * sin(A * u),
        fz: (u, v) => D * (u / TAU) + A * (1 - (u / TAU)) * sin(v),
        scale: DEFAULT_SCALE
    });

    surface_types.push({
        id: 30,
        name: 'Shell(2)',
        list:2,
        params: {A: 2, B: 0.5, C: .1, D: 1.5},
        u: {begin: -10, end: 10, step: .5},
        v: {begin: -10, end: 10, step: .5},
        fx: (u, v) => B * (1 - (u / TAU)) * cos(A * u) * (1 + cos(v)) + C * cos(A * u),
        fy: (u, v) => B * (1 - (u / TAU)) * sin(A * u) * (1 + cos(v)) + C * sin(A * u),
        fz: (u, v) => D * (u / TAU) + A * (1 - (u / TAU)) * sin(v),
        scale: DEFAULT_SCALE
    });

    surface_types.push({
        id: 31,
        name: 'Paraboloid',
        list:2,
        params: {A: PI},
        u: {begin: -10, end: 10, step: .5},
        v: {begin: -10, end: 10, step: .5},
        fx: (u, v) => power((v / A), 0.5) * sin(u),
        fy: (u, v) => v,
        fz: (u, v) => power((v / A), 0.5) * cos(u),
        scale: DEFAULT_SCALE
    });

    surface_types.push({
        id: 320,
        name: 'SteinbachScrew(1)',
        list:2,
        params: {A: .9},
        u: {begin: -3, end: 3, step: .5},
        v: {begin: -PI, end: PI, step: .1},
        fx: (u, v) => u * cos(v),
        fy: (u, v) => u * sin(A * v),
        fz: (u, v) => v * cos(u),
        scale: DEFAULT_SCALE
    });

    surface_types.push({
        id: 321,
        name: 'SteinbachScrew(2)',
        list:2,
        params: {},
        u: {begin: -10, end: 10, step: .5},
        v: {begin: -10, end: 10, step: .5},
        fx: (u, v) => u * cos(v),
        fy: (u, v) => u * sin(v),
        fz: (u, v) => v * cos(u),
        scale: DEFAULT_SCALE / 2
    });

    surface_types.push({
        id: 33,
        name: 'Corkscrew',
        list:2,
        params: {},
        u: {begin: -10, end: 10, step: .5},
        v: {begin: -10, end: 10, step: .5},
        fx: (u, v) => cos(u) * cos(v),
        fy: (u, v) => sin(u) * cos(v),
        fz: (u, v) => sin(v) + u,
        scale: DEFAULT_SCALE
    });

    surface_types.push({
        id: 34,
        name: 'Trianguloid',
        list:2,
        params: {A: .5},
        u: {begin: -10, end: 10, step: .5},
        v: {begin: -10, end: 10, step: .5},
        fx: (u, v) => 0.75 * (sin(3 * u) * 2 / (2 + cos(v))),
        fy: (u, v) => 0.75 * ((sin(u) + 2 * A * sin(2 * u)) * 2 / (2 + cos(v + TAU))),
        fz: (u, v) => 0.75 * ((cos(u) - 2 * A * cos(2 * u)) * (2 + cos(v)) * ((2 + cos(v + TAU / 3)) * 0.25)),
        scale: DEFAULT_SCALE * 2
    });

    surface_types.push({
        id: 35,
        name: 'Kidney',
        list:2,
        params: {A: .1},
        u: {begin: -10, end: 10, step: .5},
        v: {begin: -10, end: 10, step: .5},
        fxyz: (u, v) => {
            u /= 2;
            let x = cos(u) * (A * 3 * cos(v) - cos(3 * v));
            let y = sin(u) * (A * 3 * cos(v) - cos(3 * v));
            let z = 3 * sin(v) - sin(3 * v);
            return {x: x, y: y, z: z};
        },
        scale: DEFAULT_SCALE * 2
    });

    surface_types.push({
        id: 36,
        name: 'Maeders Owl',
        list:2,
        params: {A: .1},
        u: {begin: -10, end: 10, step: .5},
        v: {begin: -10, end: 10, step: .5},
        fx: (u, v) => 0.4 * (v * cos(u) - 0.5 * A * power(v, 2) * cos(2 * u)),
        fy: (u, v) => 0.4 * (-v * sin(u) - 0.5 * A * power(v, 2) * sin(2 * u)),
        fz: (u, v) => 0.4 * (4 * power(v, 1.5) * cos(3 * u / 2) / 3),
        scale: DEFAULT_SCALE
    });

    surface_types.push({
        id: 37,
        name: 'Astroidal ellipsoid',
        list:2,
        params: {A: .5},
        u: {begin: -10, end: 10, step: .5},  // begin: -1, end: 1, step: .1
        v: {begin: -10, end: 10, step: .5},  // begin: -1, end: 1, step: .1
        fxyz: (u, v) => {
            u /= 2;
            let x = 3 * power(cos(u) * cos(v), 3 * A);
            let y = 3 * power(sin(u) * cos(v), 3 * A);
            let z = 3 * power(sin(v), 3 * A);
            return {x: x, y: y, z: z};
        },
        scale: DEFAULT_SCALE
    });

    surface_types.push({
        id: 38,
        name: 'Lemniscate',
        list:2,
        params: {A: 1.5},
        u: {begin: -PI, end: PI, step: .1},
        v: {begin: -PI, end: PI, step: .1},
        fxyz: (u, v) => {
            u /= 2;
            let cosvSqrtAbsSin2u = cos(v) * sqrt(abs(sin(2 * A * u)));
            let x = cosvSqrtAbsSin2u * sin(u);
            let y = cosvSqrtAbsSin2u * sin(u);
            let z = 3 * (power(x, 2) - power(y, 2) + 2 * x * y * power(tan(v), 2));
            x *= 3;
            y *= 3;
            return {x: x, y: y, z: z};
        },
        scale: DEFAULT_SCALE
    });

    surface_types.push({
        id: 39,
        name: 'Mollusc-shell',
        link: "https://echarts.apache.org/examples/en/editor.html?c=surface-mollusc-shell&gl=1",
        list:2,
        params: {A: 1.16, B: 1, C: 2},
        u: {begin: -PI, end: PI, step: PI / 40},
        v: {begin: -15, end: 6, step: .21},
        fxyz: (u, v) => {
            let x = pow(A, v) * cos(v) * (B + cos(u));
            let y = -pow(A, v) * sin(v) * (B + cos(u));
            let z = -C * pow(A, v) * (B + sin(u));
            return {x: x, y: y, z: z};
        },
        scale: DEFAULT_SCALE
    });

    surface_types.push({
        id: 40,
        name: 'Great spring',
        link: "https://echarts.apache.org/examples/en/editor.html?c=line3d-orthographic&gl=1",
        list:2,
        params: {A: 0.25, B: 75, C: 2.0},
        u: {begin: 0, end: 1, step: 1},
        v: {begin: 0, end: 25, step: 0.01},
        fxyz: (u, v) => {
            let x = (1 + A * cos(B * v)) * cos(v);
            // let x = (1 + A * cos(B * u)) * cos(u);  résultats intéressants avec (u) au lieu de (v), à étudier
            let y = (1 + A * cos(B * v)) * sin(v);
            let z = v + C * sin(B * v);
            return {x: x, y: y, z: z};
        },
        scale: DEFAULT_SCALE
    });

    surface_types.push({
        id: 41,
        name: 'Sphere 3',
        link: "https://echarts.apache.org/examples/en/editor.html?c=sphere-parametric-surface&gl=1",
        list:3,
        params: {},
        u: {begin: -PI, end: PI, step: PI / 40},
        v: {begin: 0, end: PI, step: PI / 40},
        fxyz: (u, v) => {
            let x = sin(v) * sin(u);
            let y = sin(v) * cos(u);
            let z = cos(v);
            return {x: x, y: y, z: z};
        },
        scale: DEFAULT_SCALE * 4
    });

    surface_types.push({
        id: 42,
        name: 'Weird creature',
        link: "https://echarts.apache.org/examples/en/editor.html?c=metal-surface&gl=1",
        list:2,
        params: {A: 0.4},
        u: {begin: -13.2, end: 13.2, step: 0.4},  // begin: -1, end: 1, step: .1
        v: {begin: -37.4, end: 37.4, step: 0.4},  // begin: -1, end: 1, step: .1
        fxyz: (u, v) => {
            let r = 1 - A * A;
            let w = sqrt(r);
            let x_denom = A * (pow(w * cosh(A * u), 2) + A * pow(sin(w * v), 2))
            let x = -u + (2 * r * cosh(A * u) * sinh(A * u) / x_denom);
            let y_denom = A * (pow(w * cosh(A * u), 2) + A * pow(sin(w * v), 2))
            let y = 2 * w * cosh(A * u) * (-(w * cos(v) * cos(w * v)) - (sin(v) * sin(w * v))) / y_denom;
            let z_denom = A * (pow(w * cosh(A * u), 2) + A * pow(sin(w * v), 2))
            let z = 2 * w * cosh(A * u) * (-(w * sin(v) * cos(w * v)) + (cos(v) * sin(w * v))) / z_denom
            return {x: x, y: y, z: z};
        },
        scale: DEFAULT_SCALE
    });

    surface_types.push({
        id: 43,
        name: 'Rose',
        list:2,
        link: "https://echarts.apache.org/examples/en/editor.html?c=parametric-surface-rose&gl=1",
        params: {},
        u: {begin: 0, end: 1, step: 1 / 24},
        v: {begin: -(20 / 9) * PI, end: 15 * PI, step: ((15 * PI) - (-(20 / 9) * PI)) / 575},
        fxyz: (u, v) => {
            let x = ((x1, theta) => {
                let phi = (PI / 2) * exp(-theta / (8 * PI));
                let y1 = 1.9565284531299512 * square(x1) * square(1.2768869870150188 * x1 - 1) * sin(phi);
                let X = 1 - square(1.25 * square(1 - mod2((3.6 * theta), (2 * PI)) / PI) - 0.25) / 2;
                let r = X * (x1 * sin(phi) + y1 * cos(phi));
                return r * sin(theta);
            })(u, v);
            let y = ((x1, theta) => {
                let phi = (PI / 2) * exp(-theta / (8 * PI));
                let y1 = 1.9565284531299512 * square(x1) * square(1.2768869870150188 * x1 - 1) * sin(phi);
                let X = 1 - square(1.25 * square(1 - mod2((3.6 * theta), (2 * PI)) / PI) - 0.25) / 2;
                let r = X * (x1 * sin(phi) + y1 * cos(phi));
                return r * cos(theta);
            })(u, v);
            let z = ((x1, theta) => {
                let phi = (PI / 2) * exp(-theta / (8 * PI));
                let y1 = 1.9565284531299512 * square(x1) * square(1.2768869870150188 * x1 - 1) * sin(phi);
                let X = 1 - square(1.25 * square(1 - mod2((3.6 * theta), (2 * PI)) / PI) - 0.25) / 2;
                let r = X * (x1 * sin(phi) + y1 * cos(phi));
                return X * (x1 * cos(phi) - y1 * sin(phi));
            })(u, v);
            /*
            if (x1 == 0) {
              x1 = x;
            }*/
            return {x: x, y: y, z: z};
        },
        scale: DEFAULT_SCALE * 4
    });

    surface_types.push({
        id: 44,
        name: 'Boy surface',
        list:2,
        link: "http://mathcurve.com/surfaces/boy/boy.shtml",
        comment: "algorithm identical to roman surface, but with A=1",
        params: {A: 1, B: sqrt(2)},
        u: {begin: 0, end: 1, step: .1},
        v: {begin: 0, end: TAU, step: .1},
        fxyz: (u, v) => {
            let fk = (u, v) => {
                return cos(u) / (B - A * sin(2 * u) * sin(3 * v));
            };
            let x = fk(u, v) * (cos(u) * cos(2 * v) + B * sin(u) * cos(v));
            let y = fk(u, v) * (cos(u) * sin(2 * v) - B * sin(u) * sin(v));
            let z = 3 * fk(u, v) * (cos(u));
            return {x: x, y: y, z: z};
        },
        scale: DEFAULT_SCALE * 4
    });

    surface_types.push({
        id: 45,
        name: 'Roman surface',
        list:2,
        link: "http://mathcurve.com/surfaces/romaine/romaine.shtml",
        comment: "algorithm identical to boy surface, but with A=0",
        params: {A: 0, B: sqrt(2)},
        u: {begin: 0, end: 1, step: .1},
        v: {begin: 0, end: TAU, step: .1},
        fxyz: (u, v) => {
            let fk = (u, v) => {
                return cos(u) / (B - A * sin(2 * u) * sin(3 * v));
            };
            let x = fk(u, v) * (cos(u) * cos(2 * v) + B * sin(u) * cos(v));
            let y = fk(u, v) * (cos(u) * sin(2 * v) - B * sin(u) * sin(v));
            let z = 3 * fk(u, v) * (cos(u));
            return {x: x, y: y, z: z};
        },
        scale: DEFAULT_SCALE * 4
    });

    surface_types.push({
        id: 46,
        name: 'Morin surface',
        list:2,
        link: "http://mathcurve.com/surfaces/morin/morin.shtml",
        comment: "try with A = 4 and C = 4 => funny shape",
        params: {A: 1, B: sqrt(2), C: 5},
        u: {begin: 0, end: 1, step: .1},
        v: {begin: 0, end: TAU, step: .1},
        fxyz: (u, v) => {
            let fk = (u, v) => {
                return cos(u) / (B - A * sin(2 * u) * sin(C * v));
            };
            let tmp = 2/(C-1);
            let x = fk(u, v) * (tmp * cos(u) * cos((C-1) * v) + B * sin(u) * cos(v));
            let y = fk(u, v) * (tmp * cos(u) * sin((C-1) * v) - B * sin(u) * sin(v));
            let z = fk(u, v) * cos(u);
            return {x: x, y: y, z: z};
        },
        scale: DEFAULT_SCALE * 4
    });

    surface_types.push({
        id: 49,
        name: 'Surface of Scherk',
        list:2,
        comment: 'algorithm adapted from Tangente Magazine Hors Série n° 70, page 7',
        link: "http://tangente-mag.com/numero.php?id=167",
        params: {},
        u: {begin: -HALF_PI +.1, end: HALF_PI-.1, step: .1},
        v: {begin: -HALF_PI +.1, end: HALF_PI-.1, step: .1},
        fx: (u, v) => u,
        fy: (u, v) => v,
        fz: (u, v) => log(cos(u) / cos(v)),
        scale: 100,
        rotation: {x: TAU/8 }
    });

    surface_types.push({
        id: 50,
        name: 'Basket',
        comment: 'algorithm adapted from Tangente Magazine Hors Série n° 70, page 13',
        link: "http://tangente-mag.com/numero.php?id=167",
        list:2,
        params: {A: .1},
        u: {begin: -TAU, end: TAU, step: .5},
        v: {begin: -TAU, end: TAU, step: .1},
        fxyz: (u, v) => {
            let fta = (t, a) => {
                return (PI / 2 - a) * cos(t);
            };
            let gta = (t, a) => {
                return t / 2 + a * sin(2 * t);
            };
            let x = cos(fta(u, A)) * cos(gta(v, A));
            let y = cos(fta(u, A)) * sin(gta(v, A));
            let z = sin(fta(v, A));
            return {x: x, y: y, z: z};
        },
        scale: DEFAULT_SCALE * 4
    });

    surface_types.push({
        id: 51,
        name: 'Basket (pretty bug 1)',
        comment: 'algorithm adapted from Tangente Magazine Hors Série n° 70, page 13 (version with a bug)',
        list:2,
        params: {A: .1},
        u: {begin: -TAU, end: TAU, step: .5},
        v: {begin: -TAU, end: TAU, step: .1},
        fxyz: (u, v) => {
            let fta = (t, a) => {
                return (PI / 2 - a) * cos(t);
            };
            let gta = (t, a) => {
                return t / 2 + a * sin(2 * t);
            };
            let x = cos(fta(u, A)) * cos(gta(u, A));
            let y = cos(fta(v, A)) * sin(gta(v, A));
            let z = sin(fta(u, A));
            return {x: x, y: y, z: z};
        },
        scale: DEFAULT_SCALE * 4
    });

    surface_types.push({
        id: 52,
        name: 'Basket (pretty bug 2)',
        comment: 'algorithm adapted from Tangente Magazine Hors Série n° 70, page 13 (version with a bug)',
        list:2,
        params: {A: .1},
        u: {begin: -TAU, end: TAU, step: .5},
        v: {begin: -TAU, end: TAU, step: .1},
        fxyz: (u, v) => {
            let fta = (t, a) => {
                return (PI / 2 - a) * cos(t);
            };
            let gta = (t, a) => {
                return t / 2 + a * sin(2 * t);
            };
            let x = cos(fta(v, A)) * cos(gta(v, A));
            let y = cos(fta(u, A)) * sin(gta(u, A));
            let z = sin(gta(v, A));
            return {x: x, y: y, z: z};
        },
        scale: DEFAULT_SCALE * 4
    });

    surface_types.push({
        id: 60,
        name: 'Doughnut',
        list:3,
        comment: 'adapted from the book "Graphismes sur IBM PC", de Gabriel Cuellar, Eyrolle 1987',
        params: {A:30, B:60, C:100},
        u: {begin: -80, end: 70, step: 3},
        v: {begin: -100, end: 100, step: 10},
        fxyz: (u, v) => {
            let fnc = (x, y) => {
                let z = 0;
                let yt = y * .7;
                let d = sqrt(x*x+yt*yt);
                if (d < A || d > B) {
                    z = C;
                } else {
                    let d1 = abs(45 - d);
                    z = C - 1.5 * sqrt(225 - d1 * d1);
                }
                return z;
            };
            return {x: u, y: v, z: -fnc(u, v)};
        },
        scale: 3,
        rotation: {x: TAU/8 }
    });

    surface_types.push({
        id: 61,
        name: 'Doughnut with inclined plane',
        list:3,
        comment: 'adapted from the book "Graphismes sur IBM PC", de Gabriel Cuellar, Eyrolle 1987',
        params: {A:30, B:60, C:100},
        u: {begin: -80, end: 70, step: 3},
        v: {begin: -100, end: 100, step: 10},
        fxyz: (u, v) => {
            let fnc = (x, y) => {
                let z = 0;
                let yt = y * .7;
                let d = sqrt(x*x+yt*yt);
                if (d < A || d > B) {
                    z = C + y;
                } else {
                    let d1 = abs(45 - d);
                    z = C - 1.5 * sqrt(225 - d1 * d1);
                }
                return z;
            };
            return {x: u, y: v, z: -fnc(u, v)};
        },
        scale: 3,
        rotation: {x: TAU/8 }
    });


    surface_types.push({
        id: 62,
        name: 'Volcano',
        list:3,
        comment: 'adapted from the book "Graphismes sur IBM PC", de Gabriel Cuellar, Eyrolle 1987',
        params: {A:30, B:80, C:55},
        u: {begin: -100, end: 100, step: 5},
        v: {begin: -100, end: 100, step: 5},
        fxyz: (u, v) => {
            let fnc = (x, y) => {
                let z = 0;
                let tx = x * 2;
                let d = sqrt(tx*tx+y*y);

                if (d < A || d > B) {
                    z = 0;
                } else {
                    z = A - abs(C - d);
                }

                return z;
            };
            return {x: u, y: v, z: fnc(u, v)};
        },
        scale: 3,
        rotation: {x: TAU/8 }
    });

    surface_types.push({
        id: 63,
        name: 'A Letter',
        list:3,
        comment: 'adapted from the book "Graphismes sur IBM PC", de Gabriel Cuellar, Eyrolle 1987',
        params: {A:3.333},
        u: {begin: -20, end: 130, step: 5},
        v: {begin: 0, end: 200, step: 5},
        fxyz: (u, v) => {
            let fnc = (x, y) => {
                let z = y * .1;
                let xt = x * .1;
                let yt = (y + 120) * .06;

                if (xt < 0 || xt > 10) {
                    return z;
                }
                if ((xt < -A * (yt-10)+10 ) || (xt < A * (yt-10)-16.66666 )) {
                    return z;
                }
                if ((xt < -A * (yt-10)+16.66666 ) || (xt < A * (yt-10)-10 ) || (xt > 6 && xt < 8)) {
                    z = -20;
                }
                return z;
            };
            return {x: u, y: v, z: -fnc(u, v)};
        },
        scale: 3,
        rotation: {x: TAU/8 }
    });

    surface_types.push({
        id: 64,
        name: 'Cone 2',
        list:3,
        comment: 'adapted from the book "Graphismes sur IBM PC", de Gabriel Cuellar, Eyrolle 1987',
        params: {A:90},
        u: {begin: -100, end: 100, step: 5},
        v: {begin: -100, end: 100, step: 5},
        fxyz: (u, v) => {
            let fnc = (x, y) => {
                let z = 0;
                let d = sqrt(x*x+y*y);
                if (d < A) {
                    z = d - A;
                }
                return z;
            };
            return {x: u, y: v, z: -fnc(u, v)};
        },
        scale: 3,
        rotation: {x: TAU/8 }
    });

    surface_types.push({
        id: 65,
        name: 'Aztec Pyramid',
        list:3,
        comment: 'adapted from the book "Graphismes sur IBM PC", de Gabriel Cuellar, Eyrolle 1987',
        params: {A:90},
        u: {begin: -100, end: 100, step: 5},
        v: {begin: -100, end: 100, step: 5},
        fxyz: (u, v) => {
            let fnc = (x, y) => {
                let z = y * .1;
                let d = sqrt(x*x+y*y);
                if (d <= A) {
                    z = 10 * floor(d/10)-A;
                }
                return z;
            };
            return {x: u, y: v, z: -fnc(u, v)};
        },
        scale: 3,
        rotation: {x: TAU/8 }
    });

    surface_types.push({
        id: 66,
        name: 'Lovecraft\'s Castle',
        list:3,
        comment: 'adapted from the book "Graphismes sur IBM PC", de Gabriel Cuellar, Eyrolle 1987',
        params: {A:80},
        u: {begin: -100, end: 100, step: 5},
        v: {begin: -100, end: 100, step: 1},
        fxyz: (u, v) => {
            let fnc = (x, y) => {
                let xt = 20*(x/20);
                let yt = 10*(y/10);
                let z = y * .2;
                let d = sqrt(xt*xt+yt*yt);
                d = 18 * floor(d/18);
                if (d > A) {
                    return z;
                }
                let zt = d - A;
                if (zt < z) {
                    return zt;
                }
                return z;
            };
            return {x: u, y: v, z: -fnc(u, v)};
        },
        scale: 3,
        rotation: {x: TAU/8 }
    });

    surface_types.push({
        id: 67,
        name: 'Cross',
        list:3,
        comment: 'adapted from the book "Graphismes sur IBM PC", de Gabriel Cuellar, Eyrolle 1987',
        params: {A:80, B:30},
        u: {begin: -100, end: 100, step: 5},
        v: {begin: -100, end: 100, step: 5},
        fxyz: (u, v) => {
            let fnc = (x, y) => {
                let z = 100;
                if (x < -A || x > A) {
                    return z;
                }
                if (y > -B && y < B) {
                    return 85;
                }
                if (y < -A || y > A) {
                    return z;
                }
                if (x > -B && x < B) {
                    return 85;
                }
                return z;
            };
            return {x: u, y: v, z: -fnc(u, v)};
        },
        scale: 3,
        rotation: {x: TAU/8 }
    });

    surface_types.push({
        id: 68,
        name: 'Box or Table ?',
        list:3,
        comment: 'derived from "Cross" plus an "easing" function',
        params: {A:80, B:30},
        u: {begin: -100, end: 100, step: 10},
        v: {begin: -100, end: 100, step: 10},
        fxyz: (u, v) => {
            let fnc = (x, y) => {
                let z = 100;
                if (x < -A || x > A) {
                    return easeInQuad(x, -A, A, A*2);
                }
                if (y > -B && y < B) {
                    return easeInQuad(y, -B, B, B*2);
                }
                if (y < -A || y > A) {
                    return easeInQuad(y, -A, A, A*2);
                }
                if (x > -B && x < B) {
                    return easeInQuad(x, -B, B, B*2);
                }
                return z;
            };
            return {x: u, y: v, z: -fnc(u, v)};
        },
        scale: 3,
        rotation: {x: TAU/8 }
    });

    surface_types.push({
        id: 69,
        name: 'Tore - Variation 1',
        list:3,
        comment: 'adaptated from the book "Mathématiques et Graphismes", de Gérald Grandpierre et Gérald Cotté, PSI 1985',
        params: {A:1, B:0},
        u: {begin: -2, end: 2, step: .04},
        v: {begin: -2, end: 2, step: .04},
        fxyz: (u, v) => {
            let fc = (x,y) => {
                let xc = 0.4;
                let yc = 0.4;
                let rc = 0.9;
                return (square(x)+square(y)-1)*(square(x-xc)+square(y-yc)-square(rc)) ;
            };
            let d = sqrt(B*B-4*A*fc(u,v));
            return {x: u, y: v, z: d};
        },
        scale: 400,
        rotation: {x: TAU/8 }
    });

    surface_types.push({
        id: 70,
        name: 'Tore - Variation 2',
        list:3,
        comment: 'adaptated from the book "Mathématiques et Graphismes", de Gérald Grandpierre et Gérald Cotté, PSI 1985',
        params: {A:1, B:0},
        u: {begin: -2, end: 2, step: .04},
        v: {begin: -2, end: 2, step: .04},
        fxyz: (u, v) => {
            let fc = (x,y) => {
                let tmp = x*x+y*y;
                return (tmp-1)*(tmp-.81)*(tmp-.36)*(tmp-.04);
            };
            let d = sqrt(B*B-4*A*fc(u,v));
            return {x: u, y: v, z: d};
        },
        scale: 400,
        rotation: {x: TAU/8 }
    });

    /**
     * Set parameters for the current parametrical surface
     * @param shape_name
     * @returns {{fx: (string|null), fy: (string|null), fxyz: (string|null), fz: (string|null), refer: {}, rotation: {}, name: string, scale: number, id: number, params: *[], limits: {}}}
     */
    function setSurface(shape_name) {
        console.log(shape_name);
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
            A = surface.params.A || null;
            B = surface.params.B || null;
            C = surface.params.C || null;
            D = surface.params.D || null;
            SCALE = surface.scale || 1;
            ROTATION = surface.rotation || {};
            REFER = {};
            LIMITS = {u:surface.u, v:surface.v};
            if (surface.hasOwnProperty('comment')) {
                REFER.comment = surface.comment;
            }
            if (surface.hasOwnProperty('link')) {
                REFER.link = surface.link;
            }

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

    /**
     * Extract parameter for exporting it
     * @param paramkey
     * @param paramval
     * @returns {{}}
     */
    function extractParam(paramkey, paramval) {
        var output = {};
        if (typeof paramval === 'function') {
            if (paramval.toString) {
                output[paramkey] = paramval.toString();
            } else {
                output[paramkey] = "function embedded (visible with Firefox)";
            }
        } else {
            output[paramkey] = paramval;
        }
        return output;
    }

    /**
     * Get datas from the current parametrical surface (to export it)
     * @returns {{fx: (string|null), fy: (string|null), fxyz: (string|null), fz: (string|null), refer: {}, rotation: {}, name: string, scale: number, id: number, params: [], limits: {}}}
     */
    function getInfos() {
        let params = [];
        if (A != null) {
            params.push(extractParam('A', A));
        }
        if (B != null) {
            params.push(extractParam('B', B));
        }
        if (C != null) {
            params.push(extractParam('C', C));
        }
        if (D != null) {
            params.push(extractParam('D', D));
        }
        return {
            id: current_surface_type,
            name: current_surface_name,
            fx: (typeof FX === "function" && FX.toString) ? "fx "+ FX.toString() : null,
            fy: (typeof FY === "function" && FY.toString) ? "fy "+ FY.toString() : null,
            fz: (typeof FZ === "function" && FZ.toString) ? "fz "+ FZ.toString() : null,
            fxyz: (typeof FXYZ === "function" && FXYZ.toString) ? "fxyz "+ FXYZ.toString() : null,
            params: params,
            limits: LIMITS,
            scale: SCALE,
            rotation: ROTATION,
            refer: REFER
        }
    }

    function getDefaultScale() {
        return DEFAULT_SCALE;
    }

    /**
     * Get the list of parametrical surfaces (with an optional filter on the property "list")
     * @param numlist
     * @returns {unknown[]}
     */
    function getList(numlist=null) {
        if (numlist == null) {
            return surface_types.map(item => item.name).sort();
        } else {
            return surface_types.filter(item => item.list == numlist).map(item => item.name).sort();
        }
    }

    function getRndItemFromList(numlist=null) {
        let list = getList(numlist);
        let rnd_item = getRandomInt(list.length);
        return list[rnd_item];
    }

    /**
     * curvesInMesh
     * @param render_mode (1=draw one facet on two; 2=draw all facets)
     * @returns {{polygons: Array, edges: Array, points: Array}}
     */
    function curvesInMesh(render_mode = 1) {
        let surface = surface_types[current_surface_type];

        points = [];
        edges = [];
        polys = [];

        let tmpPoints = [];

        // first step : precalculation of coordinates and storage in a temporary array (with two entries)
        let v = surface.v.begin;
        let vmax = surface.v.end + (surface.v.step / 2);
        let umax = surface.u.end + (surface.u.step / 2);
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
                u += surface.u.step;
                iu++;
            }
            v += surface.v.step;
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
        for (let iv = 0, ivmax = vCount - 1, iumax = uCount - 1; iv < ivmax; iv++) {
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
                v = v + surface.v.step;
            }
            u = u + surface.u.step;
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
                u = u + surface.u.step;
            }
            v = v + surface.v.step;
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
        getDefaultScale: getDefaultScale,
        getRndItemFromList: getRndItemFromList
    };
})();
