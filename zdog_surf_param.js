{
    "use strict";

    var ref = {
        link: document.getElementById('link'),
        comment: document.getElementById('comment'),
        source: document.getElementById('source'),
    };

    parametricalSurfaces.loadInternalShapes();
    let surface_listing = parametricalSurfaces.getList();

    let current_shape = parametricalSurfaces.setSurface(parametricalSurfaces.getRndItemFromList());
    let first_shape = true;
    let settings = {
        default_colorU: "#ff0000", // previous ,"#5743e6"
        default_colorV: "#336699", // previous "#d4541f",
        default_colorMesh: "#000000",
        draw_graphU: true,
        draw_graphV: true,
        draw_mesh1: false,
        draw_mesh2: false,
        draw_mesh3: false,
        stroke_value: 1,
        isSpinning: true,
        speed: 0.003,
        scale: current_shape.scale,
        init_scale: current_shape.scale,
        type:current_shape.name
    };

    // clone settings for detection of changes
    let backup_settings = Object.assign({}, settings);

    // global variables
    let illo, mainGroupU, mainGroupV, shapeU, shapeV, mesh;

    illo = new Zdog.Illustration({
        element: '.zdog-canvas',
        dragRotate: true,
        scale: {x: settings.init_scale, y: settings.init_scale, z: settings.init_scale},
    });

    function generateGraph() {
        illo.children = []; // drop all children before regeneration

        if (settings.draw_mesh1) {
            mesh = parametricalSurfaces.curvesInMesh();

            mainGroupU = new Zdog.Anchor({
                addTo: illo,
                translate: {x: 0, y: 0, z: 0}
            });

            mesh.polygons.forEach(vertices => {
                let datas = [];

                vertices.forEach(item => {
                    if (mesh.points[item]) {
                        datas.push(mesh.points[item]);
                    }
                });

                new Zdog.Shape({
                    addTo: mainGroupU,
                    path: datas,
                    color: settings.default_colorMesh,
                    closed: false,
                    stroke: settings.stroke_value,
                    fill: false,
                });
            });

        }

        if (settings.draw_mesh2 || settings.draw_mesh3) {
            let render_mode = 1; // draw one facet on two
            if (settings.draw_mesh3){
                render_mode = 2;  // draw all facets
            }

            let obj3d = parametricalSurfaces.curvesInMesh(render_mode);

            mainGroupU = new Zdog.Anchor({
                addTo: illo,
                translate: {x: 0, y: 0, z: 0}
            });

            var gradient_color = 1;
            var stroke_value = 1;

            var colors = [];
            if (gradient_color == 1) {
                // each polygon has a unique color
                colors = chroma.scale(['#9cdf7c','#2A4858']).mode('lch').colors(obj3d.polygons.length)
            } else {
                // generate a first set of unique colors (from darkest to brightest) for the first half
                // of the polygons, then reverse that color series for the second half of the polygons
                // (interesting mode for cylinders and cones)
                let nb_colors = obj3d.polygons.length;
                if (nb_colors % 2 == 0) {
                    // we wish an odd number
                    nb_colors += 1;
                }
                let tmp_colors = chroma.scale(['#9cdf7c', '#2A4858']).mode('lch').colors(Math.round(nb_colors / 2));
                for (let i=tmp_colors.length-1; i>=0; i--) {
                    tmp_colors.push(tmp_colors[i]);
                }
                colors = tmp_colors;
            }

            obj3d.polygons.forEach((vertices, idx) => {
                let shape = [];
                vertices.forEach(item => {
                    shape.push(obj3d.points[item]);
                })

                new Zdog.Shape({
                    addTo: mainGroupU,
                    path: shape,
                    color: colors[idx],
                    closed: false,
                    stroke: stroke_value,
                    fill: true,
                });
            });
        }

        if (settings.draw_graphU) {
            shapeU = parametricalSurfaces.curvesInU();

            mainGroupU = new Zdog.Anchor({
                addTo: illo,
                translate: {x: 0, y: 0, z: 0}
            });

            shapeU.polygons.forEach(vertices => {
                let datas = [];

                vertices.forEach(item => {
                    if (shapeU.points[item]) {
                        datas.push(shapeU.points[item]);
                    }
                });

                new Zdog.Shape({
                    addTo: mainGroupU,
                    path: datas,
                    color: settings.default_colorU,
                    closed: false,
                    stroke: settings.stroke_value,
                    fill: false,
                });
            });
        }

        if (settings.draw_graphV) {
            shapeV = parametricalSurfaces.curvesInV();

            mainGroupV = new Zdog.Anchor({
                addTo: illo,
                translate: {x: 0, y: 0, z: 0}
            });

            shapeV.polygons.forEach(vertices => {
                let datas = [];

                vertices.forEach(item => {
                    if (shapeV.points[item]) {
                        datas.push(shapeV.points[item]);
                    }
                });

                new Zdog.Shape({
                    addTo: mainGroupV,
                    path: datas,
                    color: settings.default_colorV,
                    closed: false,
                    stroke: settings.stroke_value,
                    fill: false,
                });
            });
        }
        console.log('shape generated, everything is OK ;)');
    }

    generateGraph();

    function draw() {
        backup_settings.isSpinning = settings.isSpinning;
        if (settings.isSpinning) {
            illo.rotate.z += settings.speed;
            if (illo.rotate.x > -1) {
                illo.rotate.x -= settings.speed/2;
            }
        }
        let changes = false;
        let newshape = false;
        if (first_shape) {
            first_shape = false;
            changes = true;
            newshape = true;
        }
        let change_scale = false;
        for (let item in backup_settings) {
            if (backup_settings[item] != settings[item]) {
                if (item == 'type') {
                    newshape = true;
                } else {
                    if (item == 'scale') {
                        change_scale = true;
                    }
                }
                backup_settings[item] = settings[item];
                changes = true;
            }
        }
        if (changes) {
            if (newshape) {
                let infos = parametricalSurfaces.setSurface(settings.type);
                console.log("new shape selected : " + infos.name);
                illo.scale.x = infos.scale;
                illo.scale.y = infos.scale;
                illo.scale.z = infos.scale;
                settings.scale = infos.scale;
                backup_settings.scale = infos.scale;

                if (infos.refer.comment) {
                    ref.comment.innerHTML = `<fieldset><legend>Comment</legend>${infos.refer.comment}</fieldset>`;
                } else {
                    ref.comment.innerHTML = '';
                }
                if (infos.refer.link) {
                    ref.link.innerHTML = `<fieldset><legend>Link</legend><a href="${infos.refer.link}" target="_blank">${infos.refer.link}</a></fieldset>`;
                } else {
                    ref.link.innerHTML = '';
                }
                ref.source.innerHTML = '';
                let sources = [];
                if (infos.params && infos.params.length > 0) {
                    sources.push( '<pre>Constants => '+JSON.stringify(infos.params)+'</pre>\n' );
                }
                if (infos.limits && infos.limits.u) {
                    sources.push( '<pre>Limits on U => '+JSON.stringify(infos.limits.u)+'</pre>\n' );
                }
                if (infos.limits && infos.limits.v) {
                    sources.push( '<pre>Limits on V => '+JSON.stringify(infos.limits.v)+'</pre>\n' );
                }
                if (infos.fx != null) {
                    sources.push( '<pre>'+infos.fx+'</pre>\n' );
                }
                if (infos.fy != null) {
                    sources.push( '<pre>'+infos.fy+'</pre>\n' );
                }
                if (infos.fz != null) {
                    sources.push( '<pre>'+infos.fz+'</pre>\n' );
                }
                if (infos.fxyz != null) {
                    sources.push( '<pre>'+infos.fxyz+'</pre>\n' );
                }
                if (sources.length > 0) {
                    let tmpsrc = sources.join('\n');
                    ref.source.innerHTML = `<fieldset><legend>Source</legend>${tmpsrc}</fieldset>`;
                }

                if (infos.hasOwnProperty('rotation')) {
                    if (infos.rotation.hasOwnProperty('x')) {
                        illo.rotate.x = infos.rotation.x;
                    }
                    if (infos.rotation.hasOwnProperty('y')) {
                        illo.rotate.y = infos.rotation.y;
                    }
                    if (infos.rotation.hasOwnProperty('z')) {
                        illo.rotate.z = infos.rotation.z;
                    }
                }
            } else {
                if (change_scale) {
                    let scale = Number(backup_settings['scale']);
                    illo.scale.x = scale;
                    illo.scale.y = scale;
                    illo.scale.z = scale;
                }
            }
            generateGraph();
        }

        illo.updateRenderGraph();
    }

    function animate() {
        draw();
        requestAnimationFrame(animate);
    }

    function addGui(obj, surf_list) {

        let gui = new dat.gui.GUI();

        //gui.remember(obj);

        // Choose from accepted values
        gui.add(obj, 'type', surf_list);

        gui.add(obj, 'draw_graphU');
        gui.add(obj, 'draw_graphV');
        gui.add(obj, 'draw_mesh1');
        gui.add(obj, 'draw_mesh2');
        gui.add(obj, 'draw_mesh3');
        gui.add(obj, 'isSpinning');

        gui.add(obj, 'stroke_value').min(1).max(5).step(1);

        gui.add(obj, 'speed').min(0).max(.01).step(.001);

        gui.add(obj, 'scale').min(1).max(400).step(1);

        let f1 = gui.addFolder('Colors');
        f1.addColor(obj, 'default_colorU');
        f1.addColor(obj, 'default_colorV');
        f1.addColor(obj, 'default_colorMesh');

    }

    document.addEventListener("DOMContentLoaded", function (event) {
        console.log("DOM fully loaded and parsed");
        addGui(settings, surface_listing);
        animate();
    });

}
