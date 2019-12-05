// algebre en js
https://github.com/enkimute/ganja.js#Started


// https://codepen.io/perbyhring/pen/weKpRV

const r = (n = 1) => Math.random() * n;
const PI = Math.PI;
const TAU = PI * 2;

const lerp = (start, end, amt) => {
  return (1-amt)*start+amt*end
};

const distance = (x1, y1, x2, y2) => {
	const a = x1 - x2;
	const b = y1 - y2;
	return Math.sqrt( a*a + b*b );
};

const distanceAB = (a, b) => {
    const x = b.x - a.x;
    const y = b.y - a.y;
    return Math.sqrt(x * x + y * y);
};

const angle = (cx, cy, ex, ey) => {
  return Math.atan2(ey - cy, ex - cx);
};

//-------------------------

      // function power taken on http://www.generative-gestaltung.de/2/
    const power = (b, e) => {
        if (b >= 0 || floor(e) == e) {
            return pow(b, e);
        }
        else {
            return -pow(-b, e);
        }
    };

  const logE = (v) => {
    if (v >= 0) {
      return log(v);
    }
    else{
      return -log(-v);
    }
  }

  const sinh = (a) => {
    return (sin(HALF_PI/2-a));
  }

  const cosh = (a) => {
    return (cos(HALF_PI/2-a));
  }

  const tanh = (a) => {
    return (tan(HALF_PI/2-a));
  }

  //-----
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
//----------------------
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


//--------------

const particlePrototype = () => ({
  x: w * 0.5 + (Math.cos(r(TAU)) * r(w* 0.5)),
  y: h * 0.5 + (Math.sin(r(TAU)) * r(h* 0.5)),
  angle: r(TAU),
  speed: r(0.15),
  normalSpeed: r(0.15),
	oscAmplitudeX: r(2),
	oscSpeedX: 0.001 + r(0.008),
	oscAmplitudeY: r(2),
	oscSpeedY: 0.001 + (r(0.008)),
	connectDistance: r(CONNECT_DISTANCE),
	color: {
		r: Math.round(200 + r(55)),
		g: Math.round(150 + r(105)),
		b: Math.round(200 + r(55))
	}
});

const particles = (new Array(PARTICLE_COUNT))
  .fill({})
  .map(particlePrototype);



// https://codepen.io/shalanah/pen/ymRpPd

const DPR = window.devicePixelRatio || 1;

const clamp = (min, max, val) => {
  return Math.min(Math.max(min, val), max)
}
const boolRandom = () => {
  return Math.round(Math.random()) ? false : true
}

const sizeCanvas = () => {
  radius = clamp(15, 50, window.innerWidth / 60 / DPR)
  const canvas = document.getElementById('rainbow')
  canvas.width = window.innerWidth * DPR
  canvas.height = window.innerHeight * DPR
}

window.addEventListener('resize', sizeCanvas)

// https://codepen.io/AlainBarrios/pen/Xorwjx



// différer l'exécution d'une fonction à X millisecondes
//   https://flaviocopes.com/javascript-sleep/

const execDiffered = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

//... 1er mode d'utilisation

execDiffered(500).then(() => {
  //do stuff
})

//... 2ème solution :

const doSomething = async () => {
  await execDiffered(2000)
  //do stuff
}

doSomething();



// fonction Sleep pour forcer un code JS à attendre X millisecondes :

	/**
	 * Sleep function
	 *   https://www.sitepoint.com/delay-sleep-pause-wait/
	 * @param milliseconds
	 */
	function sleep(milliseconds) {
		var start = new Date().getTime();
		for (var i = 0; i < 1e7; i++) {
			if ((new Date().getTime() - start) > milliseconds){
				break;
			}
		}
	}


//  https://codepen.io/dev_loop/pen/gOYLbge             (color collision => très intéressant)

// This func. gets a random float between the given range
function randomFloatFromRange(min, max){
	return (Math.random() * (max - min + 1) + min);
}

// This func. gets a random item from a given array
function randomFromArray(arr){
	return arr[Math.floor(Math.random() * arr.length)]
}

// This func. gets the distance between two given points
function getDist(x1, y1, x2, y2){
	return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2))
}


// https://codepen.io/dev_loop/pen/pmQJgR

function animate(){
	ctx.clearRect(0,0,innerWidth, innerHeight);
	particlesArray.forEach(particle => {
		particle.update();
	})
	requestAnimationFrame(animate);
}
animate();


// boucle pour créer une forme circulaire irrégulière
// https://codepen.io/dev_loop/pen/NQOymr

for(let a = 0; a < TWO_PI; a+=0.1){
			let xOff = map(cos(a + this.phase), -1, 1, 0, this.noiseMax)
			let yOff = map(sin(a + this.phase), -1, 1, 0, this.noiseMax)
			let r = map(noise(xOff, yOff, this.zOff), 0, 1, this.minRadius, this.maxRadius)
			let x = r * cos(a)
			let y = r * sin(a)
			vertex(x, y)
			fill('#e67e22')
			ellipse(x, y, this.minRadius - 10)
}


// dat.gui example => https://codepen.io/dev_loop/pen/byLzRy

var gui = new dat.GUI();
var object = {
	particle: 1,
	frequency: 0.02,
};
var strokeFill = {
	r: 0,
	g: 0,
	b: 0
}
gui.add(object, 'particle', 1, 100).step(1);
gui.add(object, 'frequency', 0, 1);
var stroke = gui.addFolder('stroke');
stroke.add(strokeFill, 'r', 0, 255);
stroke.add(strokeFill, 'g', 0, 255);
stroke.add(strokeFill, 'b', 0, 255);




/**
 * utils
 * https://codepen.io/ko-yelie/pen/oNvWYpw
 */
function loadImage(srcs, isCrossOrigin) {
  if (!(typeof srcs === 'object' && srcs.constructor.name === 'Array')) {
    srcs = [srcs]
  }
  let promises = []
  srcs.forEach(src => {
    const img = document.createElement('img')
    promises.push(
      new Promise(resolve => {
        img.addEventListener('load', () => {
          resolve(img)
        })
      })
    )
    if (isCrossOrigin) img.crossOrigin = 'anonymous'
    img.src = src
  })
  return Promise.all(promises)
}
