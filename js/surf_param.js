/*          SURFACES OF PARAMETRIC EQUATIONS
* ---------------------------------------------------
* This program draws 3D surfaces deended by equations
*     x = f(u,v), y = g(u,v), z = h(u,v)
*
* Algorithms inspired by the book :
* "Graphisme dans le plan et dans l'espace en Turbo Pascal"
*   By R. Dony, ed MASSON Paris 1990
*
* Rewritten for Javascript by Gregory Jarrige
*  MIT License
* ---------------------------------------------------
*   Surface Types:
*      Ellipsoid, Sphere, Torus, Hyperboloïd, Cone,
*      Pseudo-sphere, Axial (Hélicoïde), Catenoïd, ...
*
*******************************************************/

var parametricalSurfaces = (function () {
    "use strict";

    const cos = Math.cos;
    const sin = Math.sin;
    const PI = Math.PI;
    const tanh = Math.tanh;
    const cosh = Math.cosh;
    const sinh = Math.sinh;

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
    let edges  = [];
    let polys  = [];
    let curpoly = -1;

    surface_types.push({
        id: 0,
        name: 'Ellipsoid',
        params: {A:6.0, B:3.0, C:2.0},
        u: {begin:-PI/2, end:PI/2, dist:0.2},
        v: {begin:-PI, end:PI, dist:0.2},
        fx: (u, v)=>A*cos(u)*cos(v),
        fy: (u, v)=>B*cos(u)*sin(v),
        fz: (u, v)=>C*sin(u),
        scale: DEFAULT_SCALE
    });
    surface_types.push({
        id: 1,
        name: 'Sphere 1',
        params: {A:4.0, B:4.0, C:4.5},
        u: {begin:-PI/2, end:PI/2, dist:0.2},
        v: {begin:-PI, end:PI, dist:0.2},
        fx: (u, v)=>A*cos(u)*cos(v),
        fy: (u, v)=>B*cos(u)*sin(v),
        fz: (u, v)=>C*sin(u),
        scale: DEFAULT_SCALE
    });
    surface_types.push({
        id: 2,
        name: 'Sphere 2 (truncated)',
        params: {A:4.0, B:4.0, C:4.5},
        u: {begin:-PI/2, end:1, dist:0.2},
        v: {begin:-PI, end:1, dist:0.2},
        fx: (u, v)=>A*cos(u)*cos(v),
        fy: (u, v)=>B*cos(u)*sin(v),
        fz: (u, v)=>C*sin(u),
        scale: DEFAULT_SCALE
    });
    surface_types.push({
        id: 3,
        name: 'Sphere 3 (truncated)',
        params: {A:4.0, B:4.0, C:4.5},
        u: {begin:-PI/3, end:0, dist:0.2},
        v: {begin:-PI, end:0, dist:0.2},
        fx: (u, v)=>A*cos(u)*cos(v),
        fy: (u, v)=>B*cos(u)*sin(v),
        fz: (u, v)=>C*sin(u),
        scale: DEFAULT_SCALE
    });

    surface_types.push({
        id: 4,
        name: 'Torus 1',
        params: {A:6.0, B:3.0, C:3.0},
        u: {begin:-PI, end:PI, dist:0.4},
        v: {begin:-PI, end:PI, dist:0.2},
        fx: (u, v)=>(A+B*cos(u))*cos(v),
        fy: (u, v)=>(A+B*cos(u))*sin(v),
        fz: (u, v)=>C*sin(u),
        scale: DEFAULT_SCALE / 2
    });
    surface_types.push({
        id: 5,
        name: 'Torus 2 (tire)',
        params: {A:6.0, B:3.0, C:3.0},
        u: {begin:-PI/2, end:PI/2, dist:0.2},
        v: {begin:-PI, end:PI, dist:0.2},
        fx: (u, v)=>(A+B*cos(u))*cos(v),
        fy: (u, v)=>(A+B*cos(u))*sin(v),
        fz: (u, v)=>C*sin(u),
        scale: DEFAULT_SCALE / 2
    });
    surface_types.push({
        id: 6,
        name: 'Torus 3 (flattened)',
        params: {A:6.0, B:3.0, C:3.0},
        u: {begin:-PI, end:PI, dist:0.4},
        v: {begin:-PI, end:PI, dist:0.2},
        fx: (u, v)=>(A+B*cos(u))*cos(v),
        fy: (u, v)=>(A+B*cos(u))*sin(v),
        fz: (u, v)=>B*sin(v),
        scale: DEFAULT_SCALE / 2
    });
    surface_types.push({
        id: 7,
        name: 'Hyperboloid',
        params: {A:1.0, B:1.0, C:1.0},
        u: {begin:-PI/2, end:PI/2, dist:0.2},
        v: {begin:-PI, end:PI, dist:0.2},
        fx: (u, v)=>u,
        fy: (u, v)=>v,
        fz: (u, v)=>u*u-v*v,
        scale: DEFAULT_SCALE
    });
    surface_types.push({
        id: 8,
        name: 'Cone',
        params: {A:PI/6, B:1.0, C:1.0},
        u: {begin:-1, end:2.6, dist:0.2},
        v: {begin:-2, end:0, dist:0.2},
        fx: (u, v)=> v * cos(u) * sin(A),
        fy: (u, v)=> v * sin(u) * sin(A),
        fz: (u, v)=> v * cos(A),
        scale: DEFAULT_SCALE * 4
    });

    surface_types.push({
        id: 9,
        name: 'Bi-horn',
        params: {A:1.0, B:1.0, C:1.0},
        u: {begin:-PI, end:PI, dist:0.4},
        v: {begin:-PI, end:PI, dist:0.2},
        fx: (u, v)=> (2 - cos(v)) * cos(u),
        fy: (u, v)=> (2 - sin(v)) * cos(u),
        fz: (u, v)=> sin(u),
        scale: DEFAULT_SCALE * 1.5
    });

    surface_types.push({
        id: 10,
        name: 'Pseudo-sphere 1',
        params: {A:1.0, B:1.0, C:1.0},
        u: {begin:-PI, end:PI, dist:0.2},
        v: {begin:-3, end:3, dist:0.2},
        fx: (u, v)=> cos(u) / cosh(v),
        fy: (u, v)=> sin(u) / cosh(v),
        fz: (u, v)=> v - tanh(v),
        scale: DEFAULT_SCALE * 2
    });

    surface_types.push({
        id: 11,
        name: 'Pseudo-sphere 2 (half)',
        params: {A:1.0, B:1.0, C:1.0},
        u: {begin:-PI, end:PI, dist:0.2},
        v: {begin:0, end:4, dist:0.2},
        fx: (u, v)=> cos(u) / cosh(v),
        fy: (u, v)=> sin(u) / cosh(v),
        fz: (u, v)=> v - tanh(v),
        scale: DEFAULT_SCALE * 2
    });

    surface_types.push({
        id: 12,
        name: 'Helicoid 1',
        params: {A:PI/2, B:PI/2, C:PI/2},
        u: {begin:-PI, end:PI, dist:0.2},
        v: {begin:-PI, end:PI, dist:0.2},
        fx: (u, v)=> cos(A) * cos(v) * cosh(u) + sin(A) * sin(v) * sinh(u),
        fy: (u, v)=> cos(B) * sin(v) * cosh(u) - sin(B) * cos(v) * sinh(u),
        fz: (u, v)=> cos(C) * u + sin(C) * v,
        scale: DEFAULT_SCALE / 2
    });

    surface_types.push({
        id: 13,
        name: 'Helicoid 2',
        params: {A:PI/2, B:PI, C:PI/2},
        u: {begin:-PI, end:PI, dist:0.2},
        v: {begin:-PI, end:PI, dist:0.2},
        fx: (u, v)=> cos(A) * cos(v) * cosh(u) + sin(A) * sin(v) * sinh(u),
        fy: (u, v)=> cos(B) * sin(v) * cosh(u) - sin(B) * cos(v) * sinh(u),
        fz: (u, v)=> cos(C) * u + sin(C) * v,
        scale: DEFAULT_SCALE / 2
    });

    surface_types.push({
        id: 14,
        name: 'Katenoid',
        params: {A:6.0, B:6.0, C:6.0},
        u: {begin:-PI, end:PI, dist:0.2},
        v: {begin:-PI, end:PI, dist:0.2},
        fx: (u, v)=> cos(A) * cos(v) * cosh(u) + sin(A) * sin(v) * sinh(u),
        fy: (u, v)=> cos(B) * sin(v) * cosh(u) - sin(B) * cos(v) * sinh(u),
        fz: (u, v)=> cos(C) * u + sin(C) * v,
        scale: DEFAULT_SCALE / 2
    });

    surface_types.push({
        id: 15,
        name: 'Plücker\'s conoid',
        params: {A:6.0, B:6.0, C:6.0},
        u: {begin:-PI, end:PI, dist:0.2},
        v: {begin:-PI, end:PI, dist:0.2},
        fx: (u, v)=>A * cos(v),
        fy: (u, v)=>B * sin(v),
        fz: (u, v)=>C * cos(4 * v),
        scale: DEFAULT_SCALE / 2
    });

    surface_types.push({
        id: 16,
        name: 'Milk carton (in french "Berlingot")',
        params: {A:1.0, B:2, C:0.0},
        u: {begin:-PI, end:PI, dist:0.2},
        v: {begin:-PI, end:PI, dist:0.2},
        fx: (u, v)=> B * A * (1 + u) * cos(v),
        fy: (u, v)=> B * A * (1 - u) * sin(v),
        fz: (u, v)=> A * u,
        scale: DEFAULT_SCALE / 2
    });

    surface_types.push({
        id: 17,
        name: 'Möbius surface',
        params: {A:6.0, B:6.0, C:0.0},
        u: {begin:-PI, end:PI, dist:0.2},
        v: {begin:-PI, end:PI, dist:0.2},
        fx: (u, v)=>(A + u * cos(v/2)) * cos(v),
        fy: (u, v)=>(B + u * cos(v/2)) * sin(v),
        fz: (u, v)=>(C + u * sin(v/2)),
        scale: DEFAULT_SCALE / 2
    });

    function setSurface(shape_name) {
        var current_type = -1;
        for (let i=0, imax=surface_types.length; i<imax; i++) {
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

    function curvesInU() {
        let surface = surface_types[current_surface_type];
        points = [];
        polys  = [];
        curpoly = -1;
        let x,y,z;
        let u = surface.u.begin;
        while (u <= surface.u.end) {
            let v = surface.v.begin;
            x = FX(u,v);
            y = FY(u,v);
            z = FZ(u,v);

            moveXYZ(x,y,z);
            while (v <= surface.v.end) {
                x = FX(u,v);
                y = FY(u,v);
                z = FZ(u,v);
                drawXYZ(x,y,z);
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
        polys  = [];
        curpoly = -1;
        let x,y,z;

        let v = surface.v.begin;
        while (v <= surface.v.end) {
            let u = surface.u.begin;
            x = FX(u,v);
            y = FY(u,v);
            z = FZ(u,v);

            moveXYZ(x,y,z);
            while (u <= surface.u.end) {
                x = FX(u,v);
                y = FY(u,v);
                z = FZ(u,v);
                drawXYZ(x,y,z);
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
        points.push({x:x, y:y, z:z});
        last_point = points.length;
        curpoly ++;
        polys[curpoly] = [];
        polys[curpoly].push(last_point);
    }

    function drawXYZ(x, y, z) {
        points.push({x:x, y:y, z:z});
        var new_point = points.length;
        edges.push({a:last_point, b:new_point});
        polys[curpoly].push(new_point);
        last_point = new_point;
    }

    // Default values initialized with the first surface of the list (Ellipsoid)
    setSurface(surface_types[current_surface_type].name);

    // Declare here public functions and constants (the items not declared here are private)
    return {
        curvesInU: curvesInU,
        curvesInV: curvesInV,
        getInfos: getInfos,
        getList: getList,
        setSurface: setSurface,
        getDefaultScale: getDefaultScale
    };
})();
