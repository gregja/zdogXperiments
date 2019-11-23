/**
 * Adaptation for Zdog of a Segment class proposed by Keith Peters and Billy Lamberta in the book :
 *   "Foundation HTML5 Animation with JavaScript"
 */

class Segment {

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
        this.engine = params.engine || 'zdog';
        this.engine = String(this.engine).trim();
        if (this.engine != 'zdog' && this.engine != 'canvas') {
            this.engine == 'bad';
            throw new Error('engine not correct');
        }
        this.context = params.context || null;  // 2D canvas context OR Zdog parent node (not mandatory because it's possible to address it with the draw methods)

        this.diameter = params.diameter || Math.round(this.width / 100) ;
        if (this.diameter < 2) this.diameter = 2;

    }

    /**
     * Original method of K.Peters et B.Lamberta maintained here
     * to be used concurrently with the zdog draw method
     * @param cnvcontext
     */
    draw2D(cnvcontext=undefined) {
        let context = cnvcontext || this.context;
        var h = this.height,
            d = this.width + h, //top-right diagonal
            cr = h / 2;         //corner radius
        let TAU = Math.PI * 2;
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation);
        context.scale(this.scaleX, this.scaleY);
        context.lineWidth = this.lineWidth;
        context.fillStyle = this.color;
        context.beginPath();
        context.moveTo(0, -cr);
        context.lineTo(d-2*cr, -cr);
        context.quadraticCurveTo(-cr+d, -cr, -cr+d, 0);
        context.lineTo(-cr+d, h-2*cr);
        context.quadraticCurveTo(-cr+d, -cr+h, d-2*cr, -cr+h);
        context.lineTo(0, -cr+h);
        context.quadraticCurveTo(-cr, -cr+h, -cr, h-2*cr);
        context.lineTo(-cr, 0);
        context.quadraticCurveTo(-cr, -cr, 0, -cr);
        context.closePath();
        context.fill();
        if (this.lineWidth > 0) {
            context.stroke();
        }
        //draw the 2 "pins"
        context.beginPath();
        context.arc(0, 0, this.diameter, 0, TAU, true);
        context.closePath();
        context.stroke();

        context.beginPath();
        context.arc(this.width, 0, this.diameter, 0, TAU, true);
        context.closePath();
        context.stroke();

        context.restore();
    }

    /**
     * Draw the segment in a 3D context (with Zdog)
     * @param zdogrefer
     */
    drawZdog(zdogrefer=undefined) {
        let context = zdogrefer || this.context;
        let h = this.height,
            d = this.width + h, //top-right diagonal
            cr = h / 2,         //corner radius
            depth = this.depth;  // depth (z position)

        let zoffset = this.z + this.offset * this.lineWidth;
        let seg = new Zdog.Shape({
            addTo: context,
            translate: {x:this.x, y:this.y, z:zoffset},
            rotate: {z:this.rotation},
            scale: {x: this.scaleX, y:this.scaleY}
        });

        let path =  [
            { x: 0, y: -cr, z:depth },
            { x: d - 2 * cr, y: -cr, z:depth },
            { arc: [
                    { x:-cr + d, y:-cr, z:depth }, // start control point
                    { x: -cr + d, y:0, z:depth }, // end point
                ]},
            { x:-cr + d, y:h - 2 * cr, z:depth },
            { arc: [
                    { x:-cr + d, y:-cr + h, z:depth }, // start control point
                    { x:d - 2 * cr, y:-cr + h, z:depth }, // end point
                ]},
            { x:0, y:-cr + h, z:depth },
            { arc: [
                    { x:-cr, y:-cr + h, z:depth }, // start control point
                    { x:-cr, y:h - 2 * cr, z:depth }, // end point
                ]},
            { x:-cr, y:0, z:depth},
            { arc: [
                    { x:-cr, y:-cr, z:depth }, // start control point
                    { x:0, y:-cr, z:depth }, // end point
                ]}
        ];

        let main = new Zdog.Shape({
            addTo: seg,
            path: path,
            closed: false,
            fill: true,
            stroke: this.lineWidth,
            color: this.color
        });

        new Zdog.Ellipse({
            addTo: main,
            translate: { x:0, y:0},
            diameter: this.diameter,
            stroke: 1,
            color: this.outline,
            fill: false
        });
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
        new Zdog.Ellipse({
            addTo: main,
            translate: { x:this.width, y:0},
            diameter: this.diameter,
            stroke: 1,
            color: this.outline,
            fill: false
        });
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

    /**
     * Call the good "draw" method using the engine specified
     * @param context
     */
    draw(context=undefined) {
        if (this.engine == 'zdog') {
            return this.drawZdog(context);
        } else {
            return this.draw2D(context);
        }
    }

    getPin() {
        return {
            x: this.x + Math.cos(this.rotation) * this.width,
            y: this.y + Math.sin(this.rotation) * this.width
        };
    }

}
