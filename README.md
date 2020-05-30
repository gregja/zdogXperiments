# zdogXperiments
experiments with zdog

I discovered Zdog in the beginning of june 2019 and I liked it immediately.
It's a really cool project, so I decided to make some experiments with it.
This github repository is the result of those experiments.
It's just the beginning, I have a lot of other ideas to test ;)

Note that for all shapes, it's possible to zoom with arrow keys, to reset the zoom with the escape key, and to "click & drag" to rotate the shape.

To test the algorithms, just download the zip of this repository, unzip it, double-click on "index.html", and follow the links.

Follow this link to watch the live demo of this project :

http://ledefrichoir.com/labo/zdogXperiments/

The content of the project :

- 3D Cube : cube generated programmatically, with two types of render : "wireframe" and "paint" (for the "paint" mode, colors are generated by Chroma.js)

- 3D shapes : shapes generated programmatically => cube, pyramid, icosahedron, cone, 2 spheres, 2 cuboïds, 2 cylinders, tube, diamond and double diamond (both generated with tube shape), calices (2 variants generated with tube shape), strange fruits (2 variants)

- Load wavefront obj files V1 (*) : cube, dodecahedron, icosahedron, and a lot of other objects, found on this site : http://people.sc.fsu.edu/~jburkardt/data/obj/obj.html

- Load wavefront obj files V2 (*) : V1 with asynchronuous loading of the 3D objects (better practice using the Fetch API)

- Load wavefront obj files V3 (*) : V2 with a "paint" mode (the same used for "3D Cube" and "3D shapes")

- Menger Sponge & Flake generators : adaptation of algorithms of Frido Verweij (https://library.fridoverweij.com/codelab/menger_fractals/)

- Tunnel 3D : shape generated using an algorithm of Niklas Knaack, found on this pen : https://codepen.io/NiklasKnaack/pen/WyWqja

- 8 cubes linked

- 8 cubes linked and clickable : how to set a list of clickables shapes with Zdog and a ghost canvas (*2)

- Parametrical surfaces : (big update the 2020-01-01)
     Ellipsoid, Sphere, Torus, Hyperboloid, Cone, Pseudo-sphere, Helicoid, Katenoid, Möbius ribbon, Klein bottle,
     Limpet torus, triaxial hexatorus, saddle torus, triaxial tritorus, bow curve, and a lot of new 
	 weird creatures

- Parametrical surfaces customizable (NEW)

- Magnetic cubes

- Solar system (n-body algorithm) (=> experimental, for fun, not finalized)

- XWing

- Complex 3D object created with 3 primitives (*3)

- 3D animals running (*4)

- 3D shape generator (*5)

- Boxman, a robot walking (*6)

- Grid of cubes swinging

- Calabi-Yau manifold (*7)

- Segments for puppets - 5 examples (*8)

- Leap Motion with Zdog - draw hands (*9)

- Cuboid generated with Delaunay Triangulation (*10)

- 3D Objects excavated (*11)

- Constructive Solid Geometry with csg.js (new) (*12)


-------------------

(*) Note that the import OBJ algorithm is largely inspired by a similar algorithm found on Phoria.js, of Kevin Roast : http://www.kevs3d.co.uk/dev/phoria/

(*2) see improved version by José (thank's José):
https://codepen.io/ncodefun/pen/aggZKP

(*3) recreation with zdog of : https://library.fridoverweij.com/codelab/3d_wireframe/

(*4) recreation with zdog of : https://codepen.io/hankuro/pen/QMVLJZ

(*5) inspired by an example excerpt of the book of Nikolaus Gradwohl : "Processing 2: Creative Programming Hotshot", Packt Publishing 2013

(*6) inspired by a pen of Hankuro : https://codepen.io/hankuro/pen/LrbVrx

(*7) inspired by this tutorial : https://observablehq.com/@sw1227/calabi-yau-manifold-3d

(*8) inspired by the book : "Foundation HTML5 Animation with JavaScript" of Billy Lamberta and Keith Peters (ed. Apress), http://lamberta.github.io/html5-animation/

(*9) you'll find different links (docs and tutorials) in the beginning of the JS code

(*10) Source of the Delaunay algorithm : https://github.com/ironwallaby/delaunay.git

(*11) Adaptation for Javascript of an algorithm excerpt from the book :
      "Graphisme 3D en Turbo Pascal", Gérald Grandpierre and Richard Cotté, édiTests 1988

(*12) Link to the project csg.js : http://evanw.github.io/csg.js/

------------------

A lot of examples of this project are visible on my pens :
https://codepen.io/gregja/

Link to this github repository :
https://github.com/gregja/zdogXperiments

Link to the official site of Zdog :
https://zzz.dog/
