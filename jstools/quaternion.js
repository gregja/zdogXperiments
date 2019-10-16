class Quaternion {
  constructor() {
    this.w = 1.0;
    this.x = 0.0;
    this.y = 0.0;
    this.z = 0.0;
    this.epsilon = 0.0001;
  }
  mult( b ) {  // void mult( Quaternion b )
    let res = new Quaternion();
    res.w = this.w * b.w - this.x * b.x - this.y * b.y - this.z * b.z;
    res.x = this.w * b.x + this.x * b.w + this.y * b.z - this.z * b.y;
    res.y = this.w * b.y - this.x * b.z + this.y * b.w + this.z * b.x;
    res.z = this.w * b.z + this.x * b.y - this.y * b.x + this.z * b.w;
    this.setQuaternion( res );
  }
  setCrossDot( cross, dot ) { // void set( PVector cross, float dot )
    this.x = cross.x;
    this.y = cross.y;
    this.z = cross.z;
    this.w = dot;
  }
  setQuaternion( ref ) { // void set( Quaternion ref )
    this.w = ref.w;
    this.x = ref.x;
    this.y = ref.y;
    this.z = ref.z;
  }
  matrix() { // float[] matrix()
    let res = [];
    let sa = Math.sqrt(1.0 - this.w * this.w);
    if (sa < this.epsilon) {
      sa = 1.0;
    }
    res[0] = Math.acos(this.w) * 2.0;
    res[1] = this.x / sa;
    res[2] = this.y / sa;
    res[3] = this.z / sa;
    return res;
  }
}
