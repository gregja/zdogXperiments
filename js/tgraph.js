// inspired by : https://amoffat.github.io/held-karp-gpu-demo/

var tgraph = (function( ) {
    "use strict";
	
  var generateTour = function(num, maxEdgeCost) {
    var cost, edge, edges, getCost, node, nodes, _i, _j;
    if (maxEdgeCost == null) {
      maxEdgeCost = 100;
    }
    nodes = {};
    getCost = function() {
      return _.toInteger(Math.random() * maxEdgeCost);
    };
    for (node = _i = 0; 0 <= num ? _i < num : _i > num; node = 0 <= num ? ++_i : --_i) {
      edges = {};
      nodes[node] = edges;
      for (edge = _j = 0; 0 <= num ? _j < num : _j > num; edge = 0 <= num ? ++_j : --_j) {
        cost = getCost();
        edges[edge] = cost;
      }
    }
    return nodes;
  };

  var distance = function(a, b) {
    var x, y;
    x = b.x - a.x;
    y = b.y - a.y;
    return Math.sqrt(x * x + y * y);
  };

  var createRndNode = function(id) {
    var x = Math.random();
    var y = Math.random();
    return {
      id: id,
      pos: {
        x: x,
        y: y
      }
    };
  };
  
  var createNode = function(id, x, y) {
    return {
      id: id,
      pos: {
        x: x,
        y: y
      }
    };
  };
  
  var computeEdges = function(nodes) {
    var d, i, key, n1, n2, _results;
    _results = [];
    for (key in nodes) {
      n1 = nodes[key];
      n1.edges = {};
      _results.push((function() {
        var _results1;
        _results1 = [];
        for (i in nodes) {
          n2 = nodes[i];
          d = distance(n1.pos, n2.pos);
          _results1.push(n1.edges[i] = d);
        }
        return _results1;
      })());
    }
    return _results;
  };

  var pushRndNode = function(nodes) {
	var x = Math.round(Math.random()*100);
    var y = Math.round(Math.random()*100);
    var id = Object.keys(nodes).length;
    nodes[id] = createNode(id, x, y);
    computeEdges(nodes);
	return nodes;
  };

  var pushNode = function(nodes, x, y) {
    var id = Object.keys(nodes).length;
    nodes[id] = createNode(id, x, y);
    computeEdges(nodes);
	return nodes;
  };
  
  var popNode = function(nodes) {
    var id;
    id = Object.keys(nodes) - 1;
    delete nodes[id];
    computeEdges(nodes);
	return nodes;
  };

  var dropNode = function(nodes, id) {
    if (nodes.hasOwnProperty(id)) {
		delete nodes[id];
		computeEdges(nodes);
	} else {
		console.error('id not found - drop failed');
	}
	return nodes;
  };
  
  var generateNodes = function(num) {
    var i, nodes, _i;
    nodes = {};
    for (i = _i = 0; 0 <= num ? _i < num : _i > num; i = 0 <= num ? ++_i : --_i) {
      nodes[i] = createRndNode(i);
    }
    computeEdges(nodes);
    return nodes;
  };
  
  var polygone = function(sides, radius) {
	  var path = []; var TAU = Math.PI * 2;
	  for ( var i=0; i < sides; i++ ) {
		var theta = i/sides * TAU - TAU/4;
		var x = Math.cos( theta ) * radius;
		var y = Math.sin( theta ) * radius;
		path.push({ x: x, y: y }); 
	  }
	  return path;
	};

  return {
	generateNodes: generateNodes,
	pushRndNode: pushRndNode,
	pushNode: pushNode,
	popNode: popNode,
	dropNode: dropNode,
	polygone: polygone
  };

})();

var nodes = tgraph.generateNodes(10);
console.log(nodes);
nodes = tgraph.pushRndNode(nodes);
nodes = tgraph.dropNode(nodes, 10);
nodes = tgraph.pushNode(nodes, 10, 30);
console.log(nodes);
   
   
   