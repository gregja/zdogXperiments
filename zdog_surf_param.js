/*
   parametric surfaces
*/
{
    "use strict";
    var init_scale = 50;
    var surface_listing = parametricSurfaces.getList();
    var settings = {
        default_colorU: "#ff0000",
        default_colorV: "#336699",
        draw_graphU: true,
        draw_graphV: true,
        stroke_value: 2,
        isSpinning: true,
        speed: 0.003,
        init_scale: init_scale,
        scaleX: init_scale,
        scaleY: init_scale,
        scaleZ: init_scale,
        type: surface_listing[0]
    }

    // backup to detect changes
    var backup_settings = Object.assign({}, settings);

    var illo, mainGroupU, mainGroupV, shapeU, shapeV;

    illo = new Zdog.Illustration({
        element: '.zdog-canvas',
        dragRotate: true,
        scale: {x:settings.init_scale, y:settings.init_scale, z:settings.init_scale},
    });

    function generateGraph() {
        illo.children = []; // drop all children before regeneration

        if (settings.draw_graphU) {
            shapeU = parametricSurfaces.courbesEnU();

            mainGroupU = new Zdog.Anchor({
              addTo: illo,
              translate: {x: 0, y: 0, z: 0 }
            });

            shapeU.polygons.forEach(vertices => {
                let points = [];
                let datas = [];

                vertices.forEach((item, idx) => {
                    points.push({point:shapeU.points[vertices[idx]]});
                })

                points.forEach(item => {
                    if (item.point != undefined && item.point.x != undefined) {
                        datas.push({x: item.point.x, y:item.point.y, z:item.point.z});
                    }
                })

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
            shapeV = parametricSurfaces.courbesEnV();

            mainGroupV = new Zdog.Anchor({
              addTo: illo,
              translate: {x: 0, y: 0, z: 0 }
            });

            shapeV.polygons.forEach(vertices => {
                let points = [];
                let datas = [];

                vertices.forEach((item, idx) => {
                    points.push({point:shapeV.points[vertices[idx]]});
                })

                points.forEach(item => {
                    if (item.point != undefined && item.point.x != undefined) {
                        datas.push({x: item.point.x, y:item.point.y, z:item.point.z});
                    }
                })

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
        illo.scale.x = settings.scaleX;
        illo.scale.y = settings.scaleY;
        illo.scale.z = settings.scaleZ;

        let changes = false;
        let newshape = false;
        for(let item in backup_settings) {
            if (backup_settings[item] != settings[item]) {
                if (item == 'type') {
                    newshape = true;
                }
                backup_settings[item] = settings[item];
                changes = true;
            }
        }
        if (changes) {
            if (newshape) {
                parametricSurfaces.setSurface(settings.type);
            }
            generateGraph();
        }

        illo.updateRenderGraph();
    }

    function animate() {
        draw();
        requestAnimationFrame( animate );
    }

    function resetScale() {
        illo.scale.x = init_scale;
        illo.scale.y = init_scale;
        illo.scale.z = init_scale;
    }

    function addGui(obj, surf_list) {

        var gui = new dat.gui.GUI();

        //gui.remember(obj);

        // Choose from accepted values
        gui.add(obj, 'type', surf_list );

        gui.add(obj, 'draw_graphU');
        gui.add(obj, 'draw_graphV');
        gui.add(obj, 'isSpinning');

        gui.add(obj, 'stroke_value').min(1).max(5).step(1);

        gui.add(obj, 'speed').min(0).max(.01).step(.001);

        gui.add(obj, 'scaleX').min(1).max(100).step(1);
        gui.add(obj, 'scaleY').min(1).max(100).step(1);
        gui.add(obj, 'scaleZ').min(1).max(100).step(1);

        var f1 = gui.addFolder('Colors');
        f1.addColor(obj, 'default_colorU');
        f1.addColor(obj, 'default_colorV');
    }

    document.addEventListener("DOMContentLoaded", function(event) {
        console.log("DOM fully loaded and parsed");
        addGui(settings, surface_listing);
        animate();
    });

}
