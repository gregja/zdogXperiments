
{
    "use strict";

    let surface_listing = parametricalSurfaces.getList();
    let settings = {
    	default_colorU: "#ff0000",
        default_colorV: "#336699",
        draw_graphU: true,
        draw_graphV: true,
    	stroke_value: 1,
    	isSpinning: true,
    	speed: 0.003,
        scale: parametricalSurfaces.getDefaultScale(),
        init_scale: parametricalSurfaces.getDefaultScale(),
        type: surface_listing[0]
    }

    // clone settings for detection of changes
    let backup_settings = Object.assign({}, settings);

    // global variables
    let illo, mainGroupU, mainGroupV, shapeU, shapeV;

    illo = new Zdog.Illustration({
        element: '.zdog-canvas',
        dragRotate: true,
        scale: {x:settings.init_scale, y:settings.init_scale, z:settings.init_scale},
    });

    function generateGraph() {
        illo.children = []; // drop all children before regeneration

        if (settings.draw_graphU) {
            shapeU = parametricalSurfaces.curvesInU();

            mainGroupU = new Zdog.Anchor({
              addTo: illo,
              translate: {x: 0, y: 0, z: 0 }
            });
      console.log('graphU polygons =>'+shapeU.polygons.length);

            shapeU.polygons.forEach(vertices => {
                let points = [];
                let datas = [];

                vertices.forEach((item, idx) => {
                    points.push({point:shapeU.points[vertices[idx]]});
                });

                points.forEach(item => {
                    if (item.point != undefined && item.point.x != undefined) {
                        datas.push({x: item.point.x, y:item.point.y, z:item.point.z});
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
              translate: {x: 0, y: 0, z: 0 }
            });
console.log('graphV polygons =>'+shapeV.polygons.length);
            shapeV.polygons.forEach(vertices => {
                let points = [];
                let datas = [];

                vertices.forEach((item, idx) => {
                    points.push({point:shapeV.points[vertices[idx]]});
                });

                points.forEach(item => {
                    if (item.point != undefined && item.point.x != undefined) {
                        datas.push({x: item.point.x, y:item.point.y, z:item.point.z});
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
    }

    generateGraph();

    function draw (){
        backup_settings.isSpinning = settings.isSpinning;
        if (settings.isSpinning) {
            illo.rotate.z += settings.speed;
        }
        let changes = false;
        let newshape = false;
        let change_scale = false;
        for(let item in backup_settings) {
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
                illo.scale.x = infos.scale ;
                illo.scale.y = infos.scale ;
                illo.scale.z = infos.scale ;
                settings.scale = infos.scale;
                backup_settings.scale = infos.scale;
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
        requestAnimationFrame( animate );
    }

    function addGui(obj, surf_list) {

        let gui = new dat.gui.GUI();

        //gui.remember(obj);

        // Choose from accepted values
        gui.add(obj, 'type', surf_list );

        gui.add(obj, 'draw_graphU');
        gui.add(obj, 'draw_graphV');
        gui.add(obj, 'isSpinning');

        gui.add(obj, 'stroke_value').min(1).max(5).step(1);

        gui.add(obj, 'speed').min(0).max(.01).step(.001);

        gui.add(obj, 'scale').min(0).max(400).step(1);

        let f1 = gui.addFolder('Colors');
        f1.addColor(obj, 'default_colorU');
        f1.addColor(obj, 'default_colorV');

    }

    document.addEventListener("DOMContentLoaded", function(event) {
        console.log("DOM fully loaded and parsed");
        addGui(settings, surface_listing);
        animate();
    });

}
