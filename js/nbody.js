/* The Computer Language Benchmarks Game
   https://salsa.debian.org/benchmarksgame-team/benchmarksgame/
   contributed by Isaac Gouy */


// https://benchmarksgame-team.pages.debian.net/benchmarksgame/description/nbody.html

/*

Model the orbits of Jovian planets, using the same simple symplectic-integrator.

Thanks to Mark C. Lewis for suggesting this task.

Useful symplectic integrators are freely available, for example the HNBody Symplectic Integration Package.

https://benchmarksgame-team.pages.debian.net/benchmarksgame/program/nbody-java-2.html
https://benchmarksgame-team.pages.debian.net/benchmarksgame/description/nbody.html#nbody
*/


const SOLAR_PARAMS = {
    SOLAR_MASS: 4 * Math.PI * Math.PI,
    DAYS_PER_YEAR: 365.24
};


function Body(name, diameter, x,y,z,vx,vy,vz,mass, color){
    this.name = name;
    this.diameter = diameter;
    this.color = color;
    this.x = x;
    this.y = y;
    this.z = z;
    this.vx = vx;
    this.vy = vy;
    this.vz = vz;
    this.mass = mass;
}

Body.prototype.offsetMomentum = function(px,py,pz) {
    this.vx = -px / SOLAR_PARAMS.SOLAR_MASS;
    this.vy = -py / SOLAR_PARAMS.SOLAR_MASS;
    this.vz = -pz / SOLAR_PARAMS.SOLAR_MASS;
    return this;
}

function Jupiter(){
    return new Body(
        "Jupiter",
        139820,
        4.84143144246472090e+00,
        -1.16032004402742839e+00,
        -1.03622044471123109e-01,
        1.66007664274403694e-03 * SOLAR_PARAMS.DAYS_PER_YEAR,
        7.69901118419740425e-03 * SOLAR_PARAMS.DAYS_PER_YEAR,
        -6.90460016972063023e-05 * SOLAR_PARAMS.DAYS_PER_YEAR,
        9.54791938424326609e-04 * SOLAR_PARAMS.SOLAR_MASS,
        "#ffff66"
    );
}

function Saturn(){
    return new Body(
        "Saturn",
        116460,
        8.34336671824457987e+00,
        4.12479856412430479e+00,
        -4.03523417114321381e-01,
        -2.76742510726862411e-03 * SOLAR_PARAMS.DAYS_PER_YEAR,
        4.99852801234917238e-03 * SOLAR_PARAMS.DAYS_PER_YEAR,
        2.30417297573763929e-05 * SOLAR_PARAMS.DAYS_PER_YEAR,
        2.85885980666130812e-04 * SOLAR_PARAMS.SOLAR_MASS,
        "#0099cc"
    );
}

function Uranus(){
    return new Body(
        "Uranus",
        50724,
        1.28943695621391310e+01,
        -1.51111514016986312e+01,
        -2.23307578892655734e-01,
        2.96460137564761618e-03 * SOLAR_PARAMS.DAYS_PER_YEAR,
        2.37847173959480950e-03 * SOLAR_PARAMS.DAYS_PER_YEAR,
        -2.96589568540237556e-05 * SOLAR_PARAMS.DAYS_PER_YEAR,
        4.36624404335156298e-05 * SOLAR_PARAMS.SOLAR_MASS,
        "#996633"
    );
}

function Neptune(){
    return new Body(
        "Neptune",
        49244,
        1.53796971148509165e+01,
        -2.59193146099879641e+01,
        1.79258772950371181e-01,
        2.68067772490389322e-03 * SOLAR_PARAMS.DAYS_PER_YEAR,
        1.62824170038242295e-03 * SOLAR_PARAMS.DAYS_PER_YEAR,
        -9.51592254519715870e-05 * SOLAR_PARAMS.DAYS_PER_YEAR,
        5.15138902046611451e-05 * SOLAR_PARAMS.SOLAR_MASS,
        "#ff9966"
    );
}

function Sun(){
    return new Body("Sun", 1391000, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, SOLAR_PARAMS.SOLAR_MASS, "#ffff00");
}


function NBodySystem(bodies){
    this.bodies = bodies;
    var px = 0.0;
    var py = 0.0;
    var pz = 0.0;
    var size = this.bodies.length;
    for (let i=0; i<size; i++){
        let b = this.bodies[i];
        let m = b.mass;
        px += b.vx * m;
        py += b.vy * m;
        pz += b.vz * m;
    }
    this.bodies[0].offsetMomentum(px,py,pz);
}

NBodySystem.prototype.advance = function(dt){
    var dx, dy, dz, distance, mag;
    var size = this.bodies.length;

    for (let i=0; i<size; i++) {
        var bodyi = this.bodies[i];
        for (let j=i+1; j<size; j++) {
            let bodyj = this.bodies[j];
            dx = bodyi.x - bodyj.x;
            dy = bodyi.y - bodyj.y;
            dz = bodyi.z - bodyj.z;

            distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
            mag = dt / (distance * distance * distance);

            bodyi.vx -= dx * bodyj.mass * mag;
            bodyi.vy -= dy * bodyj.mass * mag;
            bodyi.vz -= dz * bodyj.mass * mag;

            bodyj.vx += dx * bodyi.mass * mag;
            bodyj.vy += dy * bodyi.mass * mag;
            bodyj.vz += dz * bodyi.mass * mag;
        }
    }

    for (let i=0; i<size; i++) {
        let body = this.bodies[i];
        body.x += dt * body.vx;
        body.y += dt * body.vy;
        body.z += dt * body.vz;
    }
}

NBodySystem.prototype.energy = function(){
    var dx, dy, dz, distance;
    var e = 0.0;
    var size = this.bodies.length;

    for (let i=0; i<size; i++) {
        let bodyi = this.bodies[i];

        e += 0.5 * bodyi.mass *
            ( bodyi.vx * bodyi.vx
                + bodyi.vy * bodyi.vy
                + bodyi.vz * bodyi.vz );

        for (let j=i+1; j<size; j++) {
            let bodyj = this.bodies[j];
            dx = bodyi.x - bodyj.x;
            dy = bodyi.y - bodyj.y;
            dz = bodyi.z - bodyj.z;

            distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
            e -= (bodyi.mass * bodyj.mass) / distance;
        }
    }
    return e;
}

NBodySystem.prototype.getDatas = function(){
    return this.bodies;
}

/*
Example for testing :

var bodies = new NBodySystem( Array(
    Sun(),Jupiter(),Saturn(),Uranus(),Neptune()
));

var n = +process.argv[2];
console.log(n);

console.log(bodies.energy().toFixed(9));
for (let i=0; i<n; i++){ bodies.advance(0.01); }
console.log(bodies.energy().toFixed(9));

for (let i=0; i<n; i++){ bodies.advance(0.1); }
console.log(bodies.energy().toFixed(9));

console.log(bodies.getDatas());
*/
