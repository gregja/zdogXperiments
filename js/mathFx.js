/**
 * Extension de l'objet Math avec des fonctions empruntées à plusieurs livres, dont :
 *   - "Macromedia FX...",  de Robert Penner
 *   - "Ray Tracing in One Weekend", de Peter Shirley
 * @return {[type]} [description]
 */
var MathFX = (function () {
  "use strict";

  // vampirization of the Math Function
  Object.getOwnPropertyNames(Math).map(function(p) {
    this[p] = Math[p];
  });
  /*
  const cos = Math.cos;
  const sin = Math.sin;
  const asin = Math.asin;
  const atan = Math.atan;
  const pow = Math.pow;
  const sqrt = Math.sqrt;
  const abs = Math.abs;
  const PI = Math.PI;
  */
  const degToRad = angle => angle * ( PI / 180 );
  const radToDeg = angle => angle * ( 180 / PI );

  const square = val => val * val;
  const sinD = angle => sin(degToRad(angle));
  const cosD = angle => cos(degToRad(angle));
  const tanD = angle => tan(degToRad(angle));
  const atanD = angle => atan(degToRad(angle));
  const atan2D = angle => atan2(degToRad(angle));

  const angleOfLine = (x1, y1, x2, y2) => atan2D(y2 - y1, x2 - x1);
  const angleOfLineV = (v1, v2) => atan2D(v2.y - v1.y, v2.x - v1.x);

  const distance = (x1, y1, x2, y2) => {
    let dx = x2 - x1;
    let dy = y2 - y1;
    return sqrt(dx*dx + dy*dy);
  }
  const distanceV = (v1, v2) => {
    let dx = v2.x - v1.x;
    let dy = v2.y - v1.y;
    return sqrt(dx*dx + dy*dy);
  }
  const angleOfLine =

  const S_DEFAULT = 1.70158;
  const TWO_PI = PI * 2;
  const HALF_PI = PI / 2;
  const QUARTER_PI = PI / 4;
  const DEG_TO_RAD = PI / 180;

  const easingList = [ "linearTween",
                  "easeInQuad",
                  "easeOutQuad",
                  "easeInOutQuad",
                  "easeInCubic",
                  "easeOutCubic",
                  "easeInOutCubic",
                  "easeInQuart",
                  "easeOutQuart",
                  "easeInOutQuart",
                  "easeInQuint",
                  "easeOutQuint",
                  "easeInOutQuint",
                  "easeInSine",
                  "easeOutSine",
                  "easeInOutSine",
                  "easeInExpo",
                  "easeOutExpo",
                  "easeInOutExpo",
                  "easeInCirc",
                  "easeOutCirc",
                  "easeInOutCirc",
                  "easeInElastic",
                  "easeOutElastic",
                  "easeInOutElastic",
                  "easeInBack",
                  "easeOutBack",
                  "easeInOutBack",
                  "easeInBounce",
                  "easeOutBounce",
                  "easeInOutBounce" ]
  /**
   * t = time
   * b = beginning position
   * c = total change in position
   * d = duration of the tween
   */
  const easingDefault = (t, b, c, d) => easeOutQuad(t, b, c, d),

        linearTween = (t, b, c, d) => c*t/d+b,

        easeInQuad = (t, b, c, d) => c*(t/=d)*t + b,

        easeOutQuad = (t, b, c, d) => -c *(t/=d)*(t-2) + b,

        easeInOutQuad = (t, b, c, d) => {
          if ((t/=d/2) < 1) return c/2*t*t + b;
          return -c/2 * ((--t)*(t-2) - 1) + b;
        },

        easeInCubic = (t, b, c, d) => c*(t/=d)*t*t + b,

        easeOutCubic = (t, b, c, d) => c*((t=t/d-1)*t*t + 1) + b,

        easeInOutCubic = (t, b, c, d) => {
          if ((t/=d/2) < 1) return c/2*t*t*t + b;
          return c/2*((t-=2)*t*t + 2) + b;
        },

        easeInQuart = (t, b, c, d) => c*(t/=d)*t*t*t + b,

        easeOutQuart = (t, b, c, d) => -c * ((t=t/d-1)*t*t*t - 1) + b,

        easeInOutQuart = (t, b, c, d) => {
          if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
          return -c/2 * ((t-=2)*t*t*t - 2) + b;
        },

        easeInQuint = (t, b, c, d) => c*(t/=d)*t*t*t*t + b,

        easeOutQuint = (t, b, c, d) => c*((t=t/d-1)*t*t*t*t + 1) + b,

        easeInOutQuint = (t, b, c, d) => {
          if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
          return c/2*((t-=2)*t*t*t*t + 2) + b;
        },

        easeInSine = (t, b, c, d) => -c * cos(t/d * HALF_PI) + c + b,

        easeOutSine = (t, b, c, d) => c * sin(t/d * HALF_PI) + b,

        easeInOutSine = (t, b, c, d) => -c/2 * (cos(PI*t/d) - 1) + b,

        easeInExpo = (t, b, c, d) => (t==0) ? b : c * pow(2, 10 * (t/d - 1)) + b,

        easeOutExpo = (t, b, c, d) => (t==d) ? b+c : c * (-pow(2, -10 * t/d) + 1) + b,

        easeInOutExpo = (t, b, c, d) => {
          if (t==0) return b;
          if (t==d) return b+c;
          if ((t/=d/2) < 1) return c/2 * pow(2, 10 * (t - 1)) + b;
          return c/2 * (-pow(2, -10 * --t) + 2) + b;
        },

        easeInCirc = (t, b, c, d) => -c * (sqrt(1 - (t/=d)*t) - 1) + b,

        easeOutCirc = (t, b, c, d) => c * sqrt(1 - (t=t/d-1)*t) + b,

        easeInOutCirc = (t, b, c, d) => {
          if ((t/=d/2) < 1) return -c/2 * (sqrt(1 - t*t) - 1) + b;
          return c/2 * (sqrt(1 - (t-=2)*t) + 1) + b;
        },

        easeInElastic = (t, b, c, d) => {
          var s=S_DEFAULT;var p=0;var a=c;
          if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
          if (a < abs(c)) { a=c; var s=p/4; }
          else var s = p/TWO_PI * asin (c/a);
          return -(a*pow(2,10*(t-=1)) * sin( (t*d-s)*TWO_PI/p )) + b;
        },

        easeOutElastic = (t, b, c, d) => {
          var s=S_DEFAULT;var p=0;var a=c;
          if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
          if (a < abs(c)) { a=c; var s=p/4; }
          else var s = p/TWO_PI * asin (c/a);
          return a*pow(2,-10*t) * sin( (t*d-s)*TWO_PI/p ) + c + b;
        },

        easeInOutElastic = (t, b, c, d) => {
          var s=S_DEFAULT;var p=0;var a=c;
          if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
          if (a < abs(c)) { a=c; var s=p/4; }
          else var s = p/TWO_PI * asin (c/a);
          if (t < 1) return -.5*(a*pow(2,10*(t-=1)) * sin( (t*d-s)*TWO_PI/p )) + b;
          return a*pow(2,-10*(t-=1)) * sin( (t*d-s)*TWO_PI/p )*.5 + c + b;
        },

        easeInBack = (t, b, c, d, s) => {
          if (s == undefined) s = S_DEFAULT;
          return c*(t/=d)*t*((s+1)*t - s) + b;
        },

        easeOutBack = (t, b, c, d, s) => {
          if (s == undefined) s = S_DEFAULT;
          return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },

        easeInOutBack = (t, b, c, d, s) => {
          if (s == undefined) s = S_DEFAULT;
          if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
          return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        },

        easeInBounce = (t, b, c, d) => c - easeOutBounce (d-t, 0, c, d) + b,

        easeOutBounce = (t, b, c, d) => {
          if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
          } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
          } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
          } else {
            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
          }
        },

        easeInOutBounce = (t, b, c, d) => {
          if (t < d/2) return easeInBounce (t*2, 0, c, d) * .5 + b;
          return easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
        },

        /**
         * Lerp function
         * from the book "Ray Tracing in One Weekend", by Peter Shirley
         * @param  {[type]} s "start value"
         * @param  {[type]} e "end value"
         * @param  {[type]} t "value between 0 and 1"
         * @return {[type]}   [description]
        */
        lerp = (s, e, t) => (1-t)*s+t*e

  // Déclaration des méthodes et propriétés publiques
  return {
    cos: cos,
    cosD: cosD,
    sin: sin,
    sinD: sinD,
    tan: tan,
    tanD: tanD,
    asin: asin,
    atan: atan,
    pow: pow,
    sqrt: sqrt,
    abs: abs,
    square: square,
    angleOfLine: angleOfLine,
    PI: PI,
    TWO_PI: TWO_PI,
    HALF_PI: HALF_PI,
    QUARTER_PI: QUARTER_PI,
    easingDefault: easingDefault,
    linearTween: linearTween,
    easeInQuad: easeInQuad,
    easeOutQuad: easeOutQuad,
    easeInOutQuad: easeInOutQuad,
    easeInCubic: easeInCubic,
    easeOutCubic: easeOutCubic,
    easeInOutCubic: easeInOutCubic,
    easeInQuart: easeInQuart,
    easeOutQuart: easeOutQuart,
    easeInOutQuart: easeInOutQuart,
    easeInQuint: easeInQuint,
    easeOutQuint: easeOutQuint,
    easeInOutQuint: easeInOutQuint,
    easeInSine: easeInSine,
    easeOutSine: easeOutSine,
    easeInOutSine: easeInOutSine,
    easeInExpo: easeInExpo,
    easeOutExpo: easeOutExpo,
    easeInOutExpo: easeInOutExpo,
    easeInCirc: easeInCirc,
    easeOutCirc: easeOutCirc,
    easeInOutCirc: easeInOutCirc,
    easeInElastic: easeInElastic,
    easeOutElastic: easeOutElastic,
    easeInOutElastic: easeInOutElastic,
    easeInBack: easeInBack,
    easeOutBack: easeOutBack,
    easeInOutBack: easeInOutBack,
    easeInBounce: easeInBounce,
    easeOutBounce: easeOutBounce,
    easeInOutBounce: easeInOutBounce,
    lerp: lerp,
    easingList: easingList
  };
})();

/*
var test = MathFX.easeInQuad (10, 5, 4, 2, 4);
console.log(test);
*/
