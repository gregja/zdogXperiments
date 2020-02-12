/**
 * Adaptation for Zdog of a Segment class proposed by Keith Peters and Billy Lamberta in the book :
 *   "Foundation HTML5 Animation with JavaScript"
 */

class Segment3D {

    constructor(params) {
        this.x = params.x || 0;
        this.y = params.y || 0;
        this.z = params.z || 0;
        this.offset = params.offset || 0;
        this.width = params.width || 100;
        this.height = params.height || 20;
        this.vx = params.vx || 0;
        this.vy = params.vy || 0;
        this.rotation = params.rotation || 0;
        this.scaleX = params.scaleX || 1;
        this.scaleY = params.scaleY || 1;
        this.color = params.color || "#ffffff";
        this.outline = params.outline || "black";
        this.lineWidth = params.lineWidth || 1;
        this.depth = params.depth || 0;
        this.context = params.context || null;  // 2D canvas context OR Zdog parent node (not mandatory because it's possible to address it with the draw methods)

        this.diameter = params.diameter || Math.round(this.width / 100) ;
        if (this.diameter < 2) this.diameter = 2;

        this.points = [];
        this.edges = [];
        this.polygons = [];

        this.sideLimits = {
            side1:{
                begin:0,
                end:0
            },
            side2:{
                begin:0,
                end:0
            }
        };
    }

    generateOneSide(side) {
        let h = this.height,
            d = this.width + h, //top-right diagonal
            cr = h / 2,         //corner radius
            depth = this.depth / 2;  // depth (z position)

        if (side == 2) {
            depth = -depth;
        }

        this.sideLimits["side"+side].begin = this.points.length;

        /**
         * Generate Bezier Curbe
         * @param points
         * @param nbdiv
         * @returns {*}
         */
        const genBezierCurve = (points, nbdiv=10) => {
            if (points.length == 4) {
                // 4 reference points
                let curve = new Bezier(points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y);
                return curve.getLUT(nbdiv);
            } else {
                if (points.length == 3) {
                    // 3 reference points
                    let curve = new Bezier(points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y);
                    return curve.getLUT(nbdiv);
                } else {
                    console.warn('Weird Bezier curve : points.length = '+ points.length);
                    return [];
                }
            }
        };

        const isOdd = num => ((num % 2) != 0) ? true : false;
        const middle = (pointB, pointA) => {
            let x = pointA.x + ((pointB.x - pointA.x) / 2);
            let y = pointA.y + ((pointB.y - pointA.y) / 2);
            return {x:x, y:y};
        };

        this.points.push({ x: 0, y: -cr, z:depth });
        this.points.push({ x: d - 2 * cr, y: -cr, z:depth });

        this.edges.push({a: this.points.length-2, b:this.points.length-1});

        this.points.push({ x: d - 2 * cr, y: -cr + h, z:depth });
        this.points.push({ x:0, y:-cr + h, z:depth });

        this.edges.push({a: this.points.length-2, b:this.points.length-1});

        this.polygons.push([this.points.length-4, this.points.length-3, this.points.length-2, this.points.length-1]);

        let coords = [
            { x: d - 2 * cr, y: -cr },
            { x:-cr + d, y:-cr }, // start control point
            { x: -cr + d, y:0 }, // end point
            { x:-cr + d, y:h - 2 * cr }
        ];
        let midpoint = middle(coords[coords.length-1], coords[0]);
        this.points.push({x:midpoint.x, y:midpoint.y, z:depth});
        let idmidpoint = this.points.length - 1;
        genBezierCurve (coords).forEach((p, ix) => {
            this.points.push({x:p.x, y:p.y, z:depth});
            if (ix > 0 && isOdd(ix)) {
                let id_coord = this.points.length-1;
                this.edges.push({a:id_coord-1, b:id_coord});
                this.polygons.push([idmidpoint, (id_coord-1), (id_coord)]);
            }
        });

        //this.points.push({ x:-cr + d, y:h - 2 * cr, z:depth });

        coords = [
            { x:-cr + d, y:h - 2 * cr },
            { x:-cr + d, y:-cr + h }, // start control point
            { x:d - 2 * cr, y:-cr + h }, // end point
            { x:0, y:-cr + h }
        ];
        genBezierCurve (coords).forEach((p, ix) => {
            this.points.push({x:p.x, y:p.y, z:depth});
            if (ix > 0 && isOdd(ix)) {
                let id_coord = this.points.length-1;
                this.edges.push({a:id_coord-1, b:id_coord});
                this.polygons.push([idmidpoint, (id_coord-1), (id_coord)]);
            }
        });

        coords = [
            { x:0, y:-cr + h },
            { x:-cr, y:-cr + h }, // start control point
            { x:-cr, y:h - 2 * cr }, // end point
            { x:-cr, y:0 }
        ];
        midpoint = middle(coords[coords.length-1], coords[0]);
        this.points.push({x:midpoint.x, y:midpoint.y, z:depth});
        idmidpoint = this.points.length - 1;
        genBezierCurve (coords).forEach((p, ix) => {
            this.points.push({x:p.x, y:p.y, z:depth});
            if (ix > 0 && isOdd(ix)) {
                let id_coord = this.points.length-1;
                this.edges.push({a:id_coord-1, b:id_coord});
                this.polygons.push([idmidpoint, (id_coord-1), (id_coord)]);
            }
        });

        // this.points.push({ x:-cr, y:0, z:depth});

        coords = [
            { x:-cr, y:0 },
            { x:-cr, y:-cr }, // start control point
            { x:0, y:-cr }, // end point
            { x: 0, y: -cr }
        ];
        genBezierCurve (coords).forEach((p, ix) => {
            this.points.push({x:p.x, y:p.y, z:depth});
            if (ix > 0 && isOdd(ix)) {
                let id_coord = this.points.length-0;
                this.edges.push({a:id_coord-1, b:id_coord});
                this.polygons.push([idmidpoint, (id_coord-1), (id_coord)]);
            }
        });

        this.sideLimits["side"+side].end = this.points.length-1;

    }

    chainSides() {
        const isOdd = num => ((num % 2) != 0) ? true : false;
        let depth = this.depth / 2;  // depth (z position)
        let joins = [];
        let polys = [];
        for (let i=0, imax=this.sideLimits.side1.end; i<imax; i++) {
            joins[i] = {a: i, b: i + this.sideLimits.side2.end};
            if (i>0 && isOdd(i)) {
                polys.push([joins[i].a, joins[i].b, joins[i-1].b, joins[i-1].a ])
            }
        }
        joins.forEach(item => {
            this.edges.push(item);
        })
        polys.forEach(item => {
            this.polygons.push(item);
        })

    }

    /**
     * Generate 3D shape
     */
    generateShape() {
        this.generateOneSide(1);
        this.generateOneSide(2);
        this.chainSides();
        /*
                let path_series2 = [];
                let sides = [];
                path.forEach((point, idx) => {
                    path_series2[idx] = {x: point.x, y:point.y, z:-depth};
                });

                path_series2.forEach(item => {
                    path.push(item);
                });
        */
    }

    /**
     * Draw the segment in a 3D context (with Zdog)
     * @param context
     * @returns {[]}
     */
    draw(context) {

        let zoffset = this.z + this.offset * this.lineWidth;
        let seg = new Zdog.Shape({
            addTo: context,
            //   translate: {x:this.x, y:this.y, z:zoffset},
            rotate: {z:this.rotation},
            scale: {x: this.scaleX, y:this.scaleY}
        });

        let main = new Zdog.Shape({
            addTo: seg,
            path: this.points,
            closed: false,
            fill: false,
            stroke: this.lineWidth,
            color: this.color
        });
        /*
                new Zdog.Ellipse({
                    addTo: main,
                    translate: { x:0, y:0},
                    diameter: this.diameter,
                    stroke: 1,
                    color: this.outline,
                    fill: false
                });
        */
        /*
                new Zdog.Ellipse({
                    addTo: main,
                    translate: { x:0, y:0, z:this.depth+this.lineWidth+1},
                    diameter: this.diameter,
                    stroke: 1,
                    color: this.outline,
                    fill: false
                });
        */
        /*
        new Zdog.Ellipse({
            addTo: main,
            translate: { x:this.width, y:0},
            diameter: this.diameter,
            stroke: 1,
            color: this.outline,
            fill: false
        });
        */
        /*
        new Zdog.Ellipse({
            addTo: main,
            translate: { x:this.width, y:0, z:this.depth+this.lineWidth+1},
            diameter: this.diameter,
            stroke: 1,
            color: this.outline,
            fill: false
        });
*/
    }

    exportMesh() {
        return {
            points: this.points,
            edges: this.edges,
            polygons: this.polygons
        };
    }

    getPin() {
        return {
            x: this.x + Math.cos(this.rotation) * this.width,
            y: this.y + Math.sin(this.rotation) * this.width
        };
    }

}
