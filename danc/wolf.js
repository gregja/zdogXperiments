var _json = _elk_data;

var _svg , _Vertexs , _current , _graphic , _faces = [] , _Triangles = [] , _angle = 0 , _r = 0;
var _V = {x:0 , y:0 , z:5000} , _L = {x:0 , y:3000 , z:5000};

function init(){
  _svg = d3.select('#svg');
		_graphic = _svg.select('#graphic');
		_current = 0;
		_Vertexs = _json.morphTargets[0].vertices;
		makeFace(_json.faces);
		_faces.forEach(function(f,i){ _Triangles.push(new Triangle(f,i)) })
		setInterval(onFrame, 100);
}
function onFrame(){
	_current = _current + 1 == _json.morphTargets.length ? 0 : _current;
	_Vertexs = _json.morphTargets[_current].vertices;
	var array = [];
	_Triangles.forEach(function(t){
		t.setVrtex();
		t.rotateY();
		array.push({obj:t , z:t.getZ()})
	});
	array.sort(function (a,b){
           return a.z < b.z ? -1 : a.z > b.z ? 1 : 0;
     });
     array.forEach(function(e,i){e.obj.draw(i);});

	_current++;
	_angle += 0.05;
}
function Vertex(){
	if(arguments.length == 3){
        this.x = arguments[0];
        this.y = arguments[1];
        this.z = arguments[2];
    }else{
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
    this.fl = 1000;
}
Vertex.prototype = {
		getScrrenPoint : function(){
            var scale_z = this.fl + this.z;
            var scale = this.fl / scale_z;
            var x = this.x * scale;
            var y = this.y * scale;
            return {x:x , y:y , scale:scale};
        },
        set : function(p1,p2,p3){
            this.x = p1;
            this.y = p2;
            this.z = p3;
        },
        copy : function(v){
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
        }
}
var _Vector = {
		add : function(p1,p2){
	        var rtn = new Object();
	        rtn.x = p1.x + p2.x;
	        rtn.y = p1.y + p2.y;
	        rtn.z = p1.z + p2.z;
	        return rtn;
	    },
	    substrct : function(p1,p2){
	        var rtn = new Object();
	        rtn.x = p1.x - p2.x;
	        rtn.y = p1.y - p2.y;
	        rtn.z = p1.z - p2.z;
	        return rtn;
	    },
	    dot : function(p1,p2){
	        var rtn;
	        rtn = p1.x*p2.x + p1.y*p2.y + p1.z*p2.z;
	        return rtn;
	    },
	    crossproduct : function(p1,p2){
	        var rtn = new Object();
	        rtn.x = p1.y*p2.z - p1.z*p2.y;
	        rtn.y = p1.z*p2.x - p1.x*p2.z;
	        rtn.z = p1.x*p2.y - p1.y*p2.x;
	        return rtn;
	    },
	    normalize : function(p){
	        var magsq = p.x*p.x + p.y*p.y + p.z*p.z;
	        var rtn = {x : 0 , y : 0 , z : 0};
	        if(magsq > 0.0){
	            var oneovaermag = 1.0 / Math.sqrt(magsq);
	            rtn.x = p.x * oneovaermag;
	            rtn.y = p.y * oneovaermag;
	            rtn.z = p.z * oneovaermag;
	        }
	        return rtn;
	    },
	    check : function(p1,p2){
	        return p1.x==p2.x && p1.y==p2.y && p1.z==p2.z;
	    },
	    distance : function(p1,p2){
	        var dx = p1.x - p2.x;
	        var dy = p1.y - p2.y;
	        var dz = p1.z - p2.z;
	        return Math.sqrt(dx*dx + dy*dy + dz*dz);
	    },
	    Multiply : function(p1,p2){
	        var rtn = {};
	        rtn.x = p1.x * p2;
	        rtn.y = p1.y * p2;
	        rtn.z = p1.z * p2;
	        return rtn;
	    }
}
function Triangle(f,i){
	this.face = f;
    this.index = i;
    this.id = '#dorgon'+i;
    var v1 = new Vertex();
    var v2 = new Vertex();
    var v3 = new Vertex();
    this.Vetexs = [v1,v2,v3];
    this.WorkPos = {x:0 , y:0 , z:0};
    this.setVrtex();
    this.Color = {x:0.5 , y:0.5 , z:0.5};
    _graphic.append('path')
    			.attr('d',this.getPath())
    			.attr('id','dorgon'+i)
    			.attr('fill','black')
    			.attr('stroke','none')
}
Triangle.prototype = {
		setVrtex : function(){
            this.Vetexs.forEach(function(e,i){
                switch (i){
                    case 0: setFaceToVetex(this.face.a,this.Vetexs[i]); break;
                    case 1: setFaceToVetex(this.face.b,this.Vetexs[i]); break;
                    case 2: setFaceToVetex(this.face.c,this.Vetexs[i]); break;
                }
            }.bind(this));
            function setFaceToVetex(vindex,v){
                var v1 = _Vertexs[vindex*3 + 0];
                var v2 = _Vertexs[vindex*3 + 1];
                var v3 = _Vertexs[vindex*3 + 2];
                v.set(v1,v2,v3);
            }
        },
        rotateY : function(){
        	var cos = Math.cos(_angle);
        	var sin = Math.sin(_angle);
        	var _this = this;
        	this.Vetexs.forEach(function(v){rotateVertex(v)});
        	function rotateVertex(v){
        		_this.WorkPos.x = cos * v.x  - sin * v.z;
        		_this.WorkPos.y = v.y;
        		_this.WorkPos.z =  cos * v.z  + sin * v.x;
        		v.x = _this.WorkPos.x;
        		v.y = _this.WorkPos.y;
        		v.z = _this.WorkPos.z;
        	}
        },
        getPath : function(){
            var v1 = this.Vetexs[0].getScrrenPoint();
            var v2 = this.Vetexs[1].getScrrenPoint();
            var v3 = this.Vetexs[2].getScrrenPoint();
            return 'M '+v1.x+' '+v1.y+' L '+v2.x+' '+v2.y+' L '+v3.x+' '+v3.y+' Z';
        },
        getZ : function(){
            return Math.min(this.Vetexs[0].z,this.Vetexs[1].z,this.Vetexs[2].z);
        },
        draw : function(i){
            if(this.isFace()){
            	 _graphic.select('#dorgon'+i)
            	 			.attr('visibility','hidden')
            }else{
            	var color = this.getColor();
            	var d = this.getPath();
            	_graphic.select('#dorgon'+i)
            			   .attr('visibility','visible')
            			   .attr('d',d)
            			   .attr('fill',color)
            }
        },
        isFace : function(){
            var N = this.getNormal();
            return _Vector.dot(_V,N) <= 0;
        },
        getColor : function(){
            var kd = 0.7 , ks = 0.2 , ke = 0.2;
            var WHITE = {x:1 , y:1 , z:1};
            var N = this.getNormal();
            var V = _Vector.substrct(this.Vetexs[0],_V);
            V = _Vector.normalize(V);
            var L = _Vector.substrct(this.Vetexs[0],_L);
            L = _Vector.normalize(L);
            var dot = _Vector.dot(L,N);
            var vec1 = _Vector.Multiply(N,dot);
            vec1 = _Vector.Multiply(vec1,2);
            var R = _Vector.substrct(L,vec1);
            vec1 = _Vector.Multiply(N,-1);
            dot = Math.max(_Vector.dot(vec1,L),0);
            vec1 = _Vector.Multiply(_Vector.Multiply(this.Color,dot),kd);
            var vec2 = _Vector.Multiply(R,-1);
            dot = Math.pow(Math.max(_Vector.dot(vec2,V,0)),20);
            vec2 = _Vector.Multiply(WHITE,dot * ks);
            var vec3 = _Vector.Multiply(this.Color,ke);
            var col = _Vector.add(_Vector.add(vec1,vec2),vec3);
            var red = Math.floor(col.x*255);
            var green = Math.floor(col.y*255);
            var blue = Math.floor(col.z*255);
            return 'rgb('+red+','+green+','+blue+')';
        },
        getNormal : function(){
            var v1 = this.Vetexs[0];
            var v2 = this.Vetexs[1];
            var v3 = this.Vetexs[2];
            var e1 = _Vector.substrct(v3,v2);
            var e2 = _Vector.substrct(v1,v3);
            var N = _Vector.crossproduct(e1,e2);
            N = _Vector.normalize(N);
            return N;
        }
}

function Face(a,b,c){
	this.a = a;
	this.b = b;
	this.c = c;
}

function makeFace(faces){
	var offset = 0;
    while (offset < faces.length)
    {
        var type = faces[offset++];
        var isQuad = this.isBitSet(type, 0);
        var hasMaterial = this.isBitSet(type, 1);
        var hasFaceVertexUv = this.isBitSet(type, 3);
        var hasFaceNormal = this.isBitSet(type, 4);
        var hasFaceVertexNormal = this.isBitSet(type, 5);
        var hasFaceColor = this.isBitSet(type, 6);
        var hasFaceVertexColor = this.isBitSet(type, 7);
        if (isQuad != 0)
        {
          console.log('quad');
            var faceA = new Face();
            faceA.a = faces[offset+0];
            faceA.b = faces[offset+1];
            faceA.c = faces[offset+3];
            var faceB = new Face();
            faceB.a = faces[offset+1];
            faceB.b = faces[offset+2];
            faceB.c = faces[offset+3];
            offset += 4;
            if (hasMaterial != 0) offset++;
            if (hasFaceVertexUv != 0)
            {
                for (var i = 0; i < 4; i++) offset++;
            }
            if (hasFaceNormal != 0) offset++;
            if (hasFaceVertexNormal != 0)
            {
                for (var i = 0; i < 4; i++) offset++;
            }
            if (hasFaceColor != 0){
            	offset++;
            }
            if (hasFaceVertexColor != 0)
            {
                for (var i = 0; i < 4; i++) offset++;
            }
            _faces.push(faceA);
            _faces.push(faceB);
        }
        else
        {
          console.log('not quad');
            var face = new Face();
            face.a = faces[offset++];
            face.b = faces[offset++];
            face.c = faces[offset++];
            if (hasMaterial != 0) {
              offset++;
              console.log('xxx0')
            } else {
              console.log('!!! xxx0')
            }
            if (hasFaceVertexUv != 0)
            {
              console.log('xxx1')
                for (var i = 0; i < 3; i++) offset++;
              } else {
                console.log('!!! xxx1')
            }
            if (hasFaceNormal != 0) {
              console.log('xxx2');
              offset++;
            } else {
              console.log('!!! xxx2')
            }
            if (hasFaceVertexNormal != 0)
            {
              console.log('xxx3')
                for (var i = 0; i < 3; i++) offset++;
            } else {
              console.log('!!! xxx3')
            }
            if (hasFaceColor != 0){
              console.log('xxx4')
            	offset++;
            } else {
              console.log('!!! xxx4')
            }
            if (hasFaceVertexColor != 0)
            {
              console.log('xxx5')
                for (var i = 0; i < 3; i++) offset++;
            } else {
              console.log('!!! xxx5')
            }
            _faces.push(face);
        }

    }
    console.log(_faces[0]);
    console.log(_faces[1]);
}
function isBitSet( value, position){
	return value & ( 1 << position );
}
window.onload = function(){init();}
