/**
 * Created by user on 2015-04-17.
 */
SCRAP.MAIN1 = {REVISION:1};

SCRAP.MAIN1.createTextOption  = function ( size ) {

    var option = {
        size: size,
        height: 25,
        curveSegments: 4,

        bevelThickness: 2,
        bevelSize: 1.5,
        bevelSegments: 3,
        bevelEnabled: false,

        font: "nanumgothic_coding",
        weight: "normal",
        style: "normal",

        material: 0,
        extrudeMaterial: 1
    }

    return option;

};

// Light
SCRAP.MAIN1.DirLightObject = function() {

    var dirLight = new THREE.DirectionalLight( 0xffffff, 1.35 );
    dirLight.position.set( 1500, 1500, 0 );

    var _target = new THREE.Object3D();
    _target.position.set(0,500,0);
    dirLight.target = _target;

    return dirLight;

}

SCRAP.MAIN1.SpotLightObject = function(x, y, z, i) {

    var spotLight = new THREE.SpotLight( 0xffffff, i );
    spotLight.position.set( x, y, z );
    return spotLight;

}

SCRAP.MAIN1.AmbiLightObject = function() {

    var ambiLight = new THREE.AmbientLight( 0x0404040 );
    ambiLight.position.set( 100, 100, 100 );

    return ambiLight;

}

// Orbiting Word
SCRAP.MAIN1.WordCloud = function(x, y, z, words, weights) {

    var group = new THREE.Group();

    group._words = words;
    group._weights = weights;

    group._init = function() {
        for(var i=0; i<group._words.length; i++){
            var word = group._words[i];
            var weight = group._weights[i];
            group.add(new SCRAP.MAIN1.wordOrbitView(0, 110 * i, 0, 1500 - 100 * i, word, weight ));
        }

        group._start();
    }

    group._stop = function() {
        for(var i=0; i<group.children.length; i++) {
            var wordOrbit = group.children[i];
            wordOrbit._stop();
        }
    }

    group._play = function() {
        for(var i=0; i<group.children.length; i++) {
            var wordOrbit = group.children[i];
            wordOrbit._play();
        }
    }

    group._start = function() {
        for(var i=0; i<group.children.length; i++) {
            var wordOrbit = group.children[i];
            wordOrbit._init();
        }
    }

    group._update = function() {
        for(var i=0; i<group.children.length; i++) {
            var wordOrbit = group.children[i];
            wordOrbit._update();
        }
    }

    return group;
}

SCRAP.MAIN1.wordOrbitView = function(x, y, z, r, txt, size) {
    var group = new THREE.Group();

    var word = new SCRAP.MAIN1.wordView( txt, size );
    group.add(word);
    word.position.set(-r,0,0);

    group._center = new THREE.Vector3(x, y, z);
    group._radius = r;
    group._wayPoint = [];
    group._roadPoint = [];
    group._curPoint = 0;
    group._speed = ( Math.floor((r/325) + 1));
    group._delta = 0;
    group._action = false;

    group._init = function() {
        var theta = 2 * Math.PI / 30;
        var pt = new THREE.Vector3(-r,0,0);
        for(var i=0; i<30; i++) {
            group._wayPoint.push(pt);
            var newX = pt.x * Math.cos(theta) - pt.z * Math.sin(theta);
            var newZ = pt.x * Math.sin(theta) + pt.z * Math.cos(theta);
            pt = new THREE.Vector3(newX, 0, newZ);
        }
        var bezierCnt = 30 * group._speed;
        for(var i=0; i<30; i+=2){
            var curve = new THREE.QuadraticBezierCurve3(group._wayPoint[i%30], group._wayPoint[(i+1)%30], group._wayPoint[(i+2)%30]);
            for(var j=0; j< bezierCnt; j++) {
                var _pt = curve.getPoint(j/bezierCnt);
                group._roadPoint.push(curve.getPoint(j/bezierCnt));
            }
        }

        var startCnt = Math.floor(Math.random() * (30 / 2 * bezierCnt));
        var startPos = group._roadPoint[startCnt];

        group.children[0].position.set(startPos.x, -100, startPos.z);
        var target = new THREE.Vector3(startPos.x, -100, startPos.z);
        group.children[0].lookAt(target.multiplyScalar(1.5));
        group._curPoint = startCnt;
        setTimeout(group._start, Math.random() * 10000 + 1000);
    }

    group._start = function() {
        var wrd = group.children[0];
        wrd._start();
        new TWEEN.Tween(wrd.position)
            .to({y:0},1000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .onComplete(function() {
                group._play();
                new TWEEN.Tween(group.position)
                    .to({y:y},5000)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start();
                console.log(wrd.position);
            })
            .start();
    }

    group._play = function() {
        group._action = true;
    }

    group._stop = function() {
        group._action = false;
    }

    group._update = function() {
        if(!group._action) return;
        var bezierCnt = 30 * group._speed;
        group._curPoint = (group._curPoint + 1) % (30 / 2 * bezierCnt);
        var word_t = group.children[0];
        var curPos = group._roadPoint[group._curPoint];
        word_t.position.set(curPos.x, 0, curPos.z);
        var temp = new THREE.Vector3(word_t.position.x, word_t.position.y, word_t.position.z);
        temp.multiplyScalar(2);
        word_t.lookAt(temp);
    }

    group._exit = function() {

    }

    return group;
}

SCRAP.MAIN1.wordView = function( txt, size ) {

    var group = new THREE.Group();

    var text = new SCRAP.MAIN1.fontObject( txt, size );
    group.add(text);

    var light;
/*
    light = new SCRAP.MAIN1.SpotLightObject(100, 100, 100, 0.5);
    light.target = text;
    group.add(light);

    light = new SCRAP.MAIN1.SpotLightObject(-100, 100, 100, 0.5);
    light.target = text;
    group.add(light);

    light = new SCRAP.MAIN1.SpotLightObject(-100, 100, -100, 0.5);
    light.target = text;
    group.add(light);

    light = new SCRAP.MAIN1.SpotLightObject(100, 100, -100, 0.5);
    light.target = text;
    group.add(light);
*/
    group._start = function( ) {
        group.children[0]._start( );
    }

    return group;

}

SCRAP.MAIN1.fontObject = function( txt, size ) {

    var geometry = new THREE.TextGeometry( txt , SCRAP.MAIN1.createTextOption(size));

    THREE.GeometryUtils.center( geometry );

    var material = new THREE.MeshPhongMaterial( { color: 0x008080, opacity:0, transparent:true, shading: THREE.FlatShading } );

    var object = new THREE.Mesh(geometry, material);

    object._start = function() {
        var mat = object.material;
        new TWEEN.Tween(mat)
            .to({opacity:1},1000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
    }

    return object;
}

// Sphere
SCRAP.MAIN1.sphereView = function(x, y, z, mirror) {

    var group = new THREE.Group();
    var sphere = new SCRAP.MAIN1.sphereObject( 100, 0xffffff );
    group.add(sphere);

    group.position.set(x, y, z);

    return group;
}

SCRAP.MAIN1.sphereObject = function( r, c ) {

    var geometry = new THREE.SphereGeometry(r, 32, 32);
    var material = new THREE.MeshPhongMaterial( { color: c } );
    var sphere = new THREE.Mesh( geometry, material );
    sphere.position.set(100,100,100);

    return sphere;

}

// Orbiting Line
SCRAP.MAIN1.orbitingLine = function( radius, segment, brush, x, y, z ) {

    var group = new THREE.Group();

    group._traceLine = [];
    group._head = 0;
    group._bound = 5;
    group._subdivision = 20;

    group._preProcess = function () {

    }

    group._init = function() {
        var pt = new THREE.Vector2(-radius, 0);
        var theta = 2 * Math.PI / segment;
        for(var i=0; i<segment; i++) {
            group._traceLine.push(pt);
            var newX = pt.x * Math.cos(theta) - pt.y * Math.sin(theta);
            var newY = pt.x * Math.sin(theta) + pt.y * Math.cos(theta);
            pt = new THREE.Vector2(newX, newY);
        }
    }

    group._update = function() {
        group._head = (group._head + 1) % segment;
        for(var i=group._head; i<group._head + group._bound; i++) {

        }
    }

}

SCRAP.MAIN1.lineFlow = function(from, mid, to) {

    var curve = new THREE.QuadraticBezierCurve3();

    curve.v0 = from;    curve.v1 = mid;    curve.v2 = to;

    var curPoint=0;
    var wayPoint=[];
    var wayColor=[];

    var geometry = new THREE.Geometry();
    for(var i=0; i<30; i++){
        geometry.vertices.push(new THREE.Vector3());
        geometry.colors.push(new THREE.Color(0xffffff));
    }
    for(var i=0; i<300; i++) wayPoint.push(curve.getPoint( i / 300 ));

    var material = new THREE.LineBasicMaterial({
        color: 0xff0000,
        opacity: 1,
        linewidth: 50,
        vertexColors: THREE.VertexColors
    });

    var line = new THREE.Line( geometry, material );

    line._update = function() {
        if(curPoint > 299) return;
        console.log(curPoint);
        var from = curPoint - 30;
        if(from <= 0) from = 0;
        for( var i=from; i<curPoint; i++) {
            line.geometry.vertices[29 - (i - from)].copy(wayPoint[curPoint - (i - from)]);
            line.geometry.colors[29 - (i - from)] = new THREE.Color(0xffffff);
            line.geometry.colors[29 - (i - from)].setHSL(((i-from) / 30), 1, 1);
        }
        line.geometry.verticesNeedUpdate = true;
        line.geometry.colorsNeedUpdate = true;
        curPoint++;

    }

    return line;

}


