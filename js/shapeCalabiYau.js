/*
 * Some functions of this small toolbox are largely inspired by the project Phoria.js of Kevin Roast
 *    => http://www.kevs3d.co.uk/dev/phoria/
 * Cone, Cylinder2, Sphere2, Cuboid2 are largely inspired by algorithms of Frido Verweij
 *    => https://librayRot.fridoverweij.com/codelab/
 * Mollusc shell, great creature, great sphere and a beautiful rose
 *    => https://echarts.apache.org/examples/en/editor.html
 * Functions rotateX3D, rotateXYD and rotateZ3D largely inspired by the tutorial of Peter Collingridge
 *    https://petercollingridge.appspot.com/3D-tutorial/rotating-objects
 */

var shapeCalabiYau = (function (math) {
    "use strict";

    const {
        cos, sin, PI
    } = Math;

    const TAU = PI * 2;
    const DEG_TO_RAD = PI / 180;
    const RAD_TO_DEG = 180 / PI;

    const degToRad = angle => angle * DEG_TO_RAD;
    const radToDeg = angle => angle * RAD_TO_DEG;

    var obj3d = {};

    // https://github.com/d3/d3-array/blob/master/src/range.js
    function range (start, stop, step) {
        start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

        var i = -1,
            n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
            trange = new Array(n);

        while (++i < n) {
            trange[i] = start + i * step;
        }
        return trange;
    }

    // https://github.com/d3/d3-array/blob/master/src/cross.js
    function cross (...values) {
        function length(array) {
            return array.length | 0;
        }

        function empty(length) {
            return !(length > 0);
        }

        function arrayify(values) {
            return typeof values !== "object" || "length" in values ? values : Array.from(values);
        }

        function reducer(reduce) {
            return values => reduce(...values);
        }
        const reduce = typeof values[values.length - 1] === "function" && reducer(values.pop());
        values = values.map(arrayify);
        const lengths = values.map(length);
        const j = values.length - 1;
        const index = new Array(j + 1).fill(0);
        const product = [];
        if (j < 0 || lengths.some(empty)) return product;
        while (true) {
            product.push(index.map((j, i) => values[i][j]));
            let i = j;
            while (++index[i] === lengths[i]) {
                if (i === 0) return reduce ? product.map(reduce) : product;
                index[i--] = 0;
            }
        }
    }

    // Make a Plane mesh with Normal Material
    function addNormalRect(v1, v2, v3, v4) {
        obj3d.points.push(v1);
        let a = obj3d.points.length - 1;
        obj3d.points.push(v2);
        let b = obj3d.points.length - 1;
        obj3d.points.push(v3);
        let c = obj3d.points.length - 1;
        obj3d.points.push(v4);
        let d = obj3d.points.length - 1;

        obj3d.polygons.push([a, b, c, d]);
        obj3d.edges.push({a:a, b:b});
        obj3d.edges.push({a:b, b:c});
        obj3d.edges.push({a:c, b:d});
        obj3d.edges.push({a:d, b:a});
    }

    function addCalabiYau (exponent, projection) {
        function coordinate(x, y, n, k1, k2, projection) {
            const z1 = math.multiply(
                math.exp(math.complex(0, 2*PI*k1/n)),
                math.pow(math.cos(math.complex(x, y)), 2/n)
            );
            const z2 = math.multiply(
                math.exp(math.complex(0, 2*PI*k2/n)),
                math.pow(math.sin(math.complex(x, y)), 2/n)
            );
            return {x:z1.re, y:z2.re, z:z1.im*math.cos(projection) + z2.im*math.sin(projection) };
        }

        const dx = PI/10;
        const dy = PI/10;
        cross(range(exponent), range(exponent)).forEach(k => {
            range(0, PI/2, dx).forEach(x => {
                range(-PI/2, PI/2, dy).forEach(y => {
                    const data = [
                        {"x": x,    "y": y   },
                        {"x": x+dx, "y": y   },
                        {"x": x+dx, "y": y+dy},
                        {"x": x,    "y": y+dy},
                    ];
                    addNormalRect(
                        ...data.map(d => coordinate(d.x, d.y, exponent, k[0], k[1], projection))
                    );
                });
            });
        })
    };

    /**
     *
     * @param shape_params
     */
    function generateShape(shape_params={}) {
        obj3d.points = [];
        obj3d.edges = [];
        obj3d.polygons = [];

        var exponent = shape_params.exponent || 6;
        var projection = shape_params.projection || 3;
        var disorder = shape_params.disorder || 0;

        addCalabiYau(exponent, projection, disorder);

        if (disorder != 0) {
            obj3d.points.forEach(node => {
                let theta = disorder*Math.random();

                let sinTheta = sin(theta);
                let cosTheta = cos(theta);

                node.x = node.x * cosTheta - node.y * sinTheta;
                node.y = node.y * cosTheta + node.x * sinTheta;
                node.z = node.z * cosTheta + node.x * sinTheta;
            });
        }

        return obj3d;

    }

    // public functions and constants (items not declared here are private)
    return {
        generateShape: generateShape
    };
})(math);
