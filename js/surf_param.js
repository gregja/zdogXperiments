/*          SURFACES OF PARAMETRIC EQUATIONS
* ---------------------------------------------------
* This program draws 3D surfaces deended by equations
*     x = f(u,v), y = g(u,v), z = h(u,v)
*
* Algorithms largely inspired by the book :
* "Graphisme dans le plan et dans l'espace en Turbo Pascal"
*   By R. Dony, ed MASSON Paris 1990
* ---------------------------------------------------
*   Surface Type: 1. Ellipsoid
*                 2. Sphere
*                 3. Torus
*                 4. Hyperboloid
*
*******************************************************/

var parametricSurfaces = (function () {
    "use strict";

    const cos = Math.cos;
    const sin = Math.sin;
    const PI = Math.PI;

    var current_surface_type = 0;
    var current_surface_name = '';

    var A, B, C;
    var FX = (u, v) => false;
    var FY = (u, v) => false;
    var FZ = (u, v) => false;

    var last_point = 0;

    var surface_types = [];
    surface_types.push({
        id: 0,
        name: 'Ellipsoid',
        params: {A:6.0, B:3.0, C:2.0},
        u: {begin:-PI/2, end:PI/2, dist:0.2},
        v: {begin:-PI, end:PI, dist:0.2},
        fx: (u, v)=>A*cos(u)*cos(v),
        fy: (u, v)=>B*cos(u)*sin(v),
        fz: (u, v)=>C*sin(u),
    });
    surface_types.push({
        id: 1,
        name: 'Sphere',
        params: {A:4.0, B:4.0, C:4.5},
        u: {begin:-PI/2, end:PI/2, dist:0.2},
        v: {begin:-PI, end:PI, dist:0.2},
        fx: (u, v)=>A*cos(u)*cos(v),
        fy: (u, v)=>B*cos(u)*sin(v),
        fz: (u, v)=>C*sin(u),
    });
    surface_types.push({
        id: 2,
        name: 'Torus',
        params: {A:6.0, B:3.0, C:3.0},
        u: {begin:-PI/2, end:PI/2, dist:0.2},
        v: {begin:-PI, end:PI, dist:0.2},
        fx: (u, v)=>(A+B*cos(u))*cos(v),
        fy: (u, v)=>(A+B*cos(u))*sin(v),
        fz: (u, v)=>C*sin(u),
    });
    surface_types.push({
        id: 3,
        name: 'Hyperboloid',
        params: {A:1.0, B:1.0, C:1.0},
        u: {begin:-PI/2, end:PI/2, dist:0.2},
        v: {begin:-PI, end:PI, dist:0.2},
        fx: (u, v)=>u,
        fy: (u, v)=>v,
        fz: (u, v)=>u*u-v*v,
    });

    function setSurface(shape_name) {
        console.log(shape_name);
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
            current_surface_name = surface.name;
            A = surface.params.A;
            B = surface.params.B;
            C = surface.params.C;

            FX = surface.fx;
            FY = surface.fy;
            FZ = surface.fz;
        } else {
            console.warn(`surface ID (${current_type}) not found - ignored`);
        }
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
            C: C
        }
    }

    function getList() {
        return surface_types.map(item => item.name)
    }

    var points = [];
    var edges  = [];
    var polys  = [];
    var curpoly = -1;

    setSurface(surface_types[current_surface_type].name);

    function courbesEnU() {
        let surface = surface_types[current_surface_type];
        points = [];
        polys  = [];
        curpoly = -1;
        var x,y,z;
        var u = surface.u.begin;
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

    function courbesEnV() {
        let surface = surface_types[current_surface_type];
        points = [];
        polys  = [];
        curpoly = -1;
        var x,y,z;

        var v = surface.v.begin;
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


    // Declare here public functions and constants (the items not declared here are private)
    return {
        courbesEnU: courbesEnU,
        courbesEnV: courbesEnV,
        getInfos: getInfos,
        getList: getList,
        setSurface: setSurface
    };
})();
