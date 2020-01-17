{
    "use strict";

    function download(filename, text) {
        var new_name = parametricalSurfaces.replaceAll(filename, ' ', '_');
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', new_name+'_export.json');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    var ref = {
        canvas: document.getElementById('zdog-canvas'),
        link: document.getElementById('link'),
        comment: document.getElementById('comment'),
        source: document.getElementById('source'),
        edit_window: document.getElementById("edit-window"),
        edit_button: document.getElementById("edit-btn"),
        submit_button: document.getElementById("submit-btn"),
        export_button: document.getElementById("export-btn"),
        form: document.getElementById('myform'),
        warnings: document.querySelectorAll('[data-id=warning]'),
        fields: {}
    };

    function clearWarnings() {
        for(let v=0, vmax=ref.warnings.length; v<vmax; v++) {
            ref.warnings[v].innerText = '';
        }
    }

    // if function "toString" not available on functions, so it's not possible to modify functions dynamically
    var modify_functions = (Function.prototype.toString ? true: false);

    var infos = {};

    [...ref.form.querySelectorAll('[data-field]')].forEach(item => {
        let key = item.dataset.field;
        ref.fields[key] = item;
    });

    var formatSource = function(){
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
    };

    parametricalSurfaces.loadInternalShapes();
    let surface_listing = parametricalSurfaces.getList();

    var rendering = {
        'none': 9,
        'quads wireframe': 0,
        'triangles wireframe': 1,
        'triangles filled 1/2': 2,
    //    'triangles filled ': 3,   not visually interesting
        'quads filled': 4
    };

    let current_shape = parametricalSurfaces.setSurface(parametricalSurfaces.getRndItemFromList());
    let first_shape = true;
    let settings = {
        default_colorU: "#ff0000", // previous ,"#5743e6"
        default_colorV: "#336699", // previous "#d4541f",
        default_colorMesh: "#000000",
        draw_graphU: true,
        draw_graphV: true,
        rendering: 9,
        stroke_value: 1,
        isSpinning: false,
        speed: 0.003,
        scale: current_shape.scale,
        init_scale: current_shape.scale,
        type:current_shape.name
    };
    infos = parametricalSurfaces.getInfos();

    // clone settings for detection of changes
    let backup_settings = Object.assign({}, settings);

    ref.export_button.addEventListener('click', function(evt){
        var datas = JSON.stringify(infos);
        download(infos.name, datas);
    });

    ref.submit_button.setAttribute('disabled', 'disabled');

    ref.edit_button.addEventListener('click', function(evt){
        evt.preventDefault();

        if (ref.submit_button.hasAttribute('disabled')) {
            ref.submit_button.removeAttribute('disabled');
        }

        infos = parametricalSurfaces.getInfos();

        if (ref.edit_window.getAttribute('data-active') == 'false') {
            ref.edit_window.setAttribute('data-active', 'true');
            this.innerHTML = 'Cancel';
            ref.source.setAttribute('data-active', 'false');
        } else {
            ref.edit_window.setAttribute('data-active', 'false');
            this.innerHTML = 'Edit';
            ref.source.setAttribute('data-active', 'true');
        }

        ['a', 'b', 'c', 'd', 'e', 'f'].forEach(letrItem => {
            let node = ref.fields['const-'+letrItem];
            node.parentNode.style.display = "none";
            node.value = '';
            node.setAttribute('data-hidden', 'true');
        });

        infos.params.forEach((items, idx) => {
            for(item in items) {
                let letrItem = item.toLowerCase();
                let value = infos.params[idx][item];
                if (value != '') {
                    let node = ref.fields['const-'+letrItem];
                    node.value = value;
                    node.parentNode.style.display = "block";
                    node.setAttribute('data-hidden', 'false');
                }
            }
        });

        ['u', 'v'].forEach(curveLevl => {
            ['begin', 'end', 'step'].forEach(stepLevel => {
                let value = infos.limits[curveLevl][stepLevel];
                ref.fields[`limit-${curveLevl}-${stepLevel}`].value = value;
            });
        });

        clearWarnings();

        ['fx', 'fy', 'fz', 'fxyz'].forEach(fnc => {
            let node = ref.fields[fnc];
            let value = infos[fnc];

            if (value == null || value == 'null' || value == '') {
                node.parentNode.style.display = "none";
                node.value = '';
                node.setAttribute('data-hidden', 'true');
            } else {
                node.parentNode.style.display = "block";
                node.value = value;
                node.setAttribute('data-hidden', 'false');

                if (modify_functions == false) {
                    node.setAttribute('disabled', 'disabled');
                } else {
                    // check if function compatible with dynamic edition mode
                    let checkcode = parametricalSurfaces.testFunction(fnc, value);
                    if (checkcode.status != 'OK') {
                        console.log('not good for '+fnc);
                        node.setAttribute('disabled', 'disabled');
                    }
                }
            }
        });

    }, false);

    ref.form.addEventListener('submit', function(evt){
        evt.preventDefault();
        var custom = {};

        clearWarnings();

        infos.params.forEach((items, idx) => {
            for(let item in items) {
                let letrItem = item.toLowerCase();
                let value = ref.fields['const-'+letrItem].value;
                infos.params[idx][item] = value;
                custom[item] = value;
            }
        });

        ['u', 'v'].forEach(curveLevl => {
            custom[curveLevl] = {};
            ['begin', 'end', 'step'].forEach(stepLevel => {
                let value = ref.fields[`limit-${curveLevl}-${stepLevel}`].value;
                infos.limits[curveLevl][stepLevel] = value;
                custom[curveLevl][stepLevel] = value;
            });
        });
        let all_functions_good = true;
        if (modify_functions == true) {
            ['fx', 'fy', 'fz', 'fxyz'].forEach((fnc, idx) => {
                console.log(fnc);
                let node = ref.fields[fnc];
                let source = node.value;
                if (node.getAttribute('data-hidden') == 'false' && !node.hasAttribute('disabled')) {
                    let checkcode = parametricalSurfaces.testFunction(fnc, source);
                    if (checkcode.status == 'OK') {
                        custom[fnc] = source;
                    } else {
                        all_functions_good = false;
                        console.log(idx);
                        ref.warnings[idx].innerHTML = 'Syntax error';
                    }
                }
            });
        }
        if (all_functions_good) {
            formatSource();

            setTimeout(() => {
                parametricalSurfaces.customSurface(custom);
                infos = parametricalSurfaces.getInfos();
                generateGraph();
                illo.updateRenderGraph();
            }, 10);
        }

    }, false);

    // global variables
    let illo, mainGroupU, mainGroupV, shapeU, shapeV, mesh;

    illo = new Zdog.Illustration({
        element: ref.canvas,
        dragRotate: true,
        scale: {x: settings.init_scale, y: settings.init_scale, z: settings.init_scale},
    });

    function generateGraph() {
        illo.children = []; // drop all children before regeneration

        if (settings.rendering == 0 || settings.rendering == 1) {
            mesh = parametricalSurfaces.curvesInMesh(settings.rendering);

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

        if (settings.rendering == 2 || settings.rendering == 3 || settings.rendering == 4) {
            let render_mode = 0; // quad rendering
            if (settings.rendering == 2){
                render_mode = 1;  // triangle rendering, draw 1 triangle by 2
            } else {
                if (settings.rendering == 3) {
                    render_mode = 2;  // triangle rendering, draw all triangles
                }
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
                });

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

    function draw(e) {
        backup_settings.isSpinning = settings.isSpinning;
        if (settings.isSpinning) {
            illo.rotate.z += settings.speed;
            if (illo.rotate.x > -1) {
                illo.rotate.x -= settings.speed / 2;
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
                infos = parametricalSurfaces.setSurface(settings.type);
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

                formatSource();

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
            if (ref.edit_window.getAttribute('data-active') == 'true') {
                ref.edit_button.click();
                ref.edit_button.click();
            }
        }

        illo.updateRenderGraph();
    }

    function animate() {
        draw();
        requestAnimationFrame(animate);
    }

    function addGui(obj, surf_list, renderlist) {

        let gui = new dat.gui.GUI();

        //gui.remember(obj);

        // Choose from accepted values
        gui.add(obj, 'type', surf_list);

        gui.add(obj, 'draw_graphU');
        gui.add(obj, 'draw_graphV');

        gui.add(obj, 'rendering', renderlist, 9);  // none by default

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
        addGui(settings, surface_listing, rendering);
        animate();
    });

}
