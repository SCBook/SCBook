/**
 * Created by redball on 15. 5. 6.
 */

SCRAP.LOBBY = {REVISION:1};

SCRAP.LOBBY.faceObject = function( length, i ) {

    var root = new SCRAP.Element('div',
        {
            'style' : {
                'opacity' : 1
            }
        }
        ,
        null
    );

    var element = new SCRAP.Element('div',
        {
            'className' : 'element',
            'style' : {
                'backgroundColor':'rgba(0, 20, 20, 100)',
                'width' : length + "px",
                'height' : length + "px"
            }
        }
        , root
    );

    var symbol = new SCRAP.Element('div',
        {
            'className' : 'symbol',
            'innerHTML' : i
        }
        , element
    );

    element.addEventListener("mouseover", function() {
        element.style.boxShadow = "0px 0px 12px rgba(127,127,0,1)"
    });

    element.addEventListener("click", function() {
        console.log("element clicked");
        object.parent._mouseClicked();
    });

    var object = new THREE.CSS3DObject(root);
    object._width = length;
    object._height = length;
    object._element = element

    return object;

}

SCRAP.LOBBY.cubeView = function( length ) {

    var group = new THREE.Group();

    group._posList = [
        new THREE.Vector3(0,-length/2,0),
        new THREE.Vector3(0,length/2,0),
        new THREE.Vector3(0,0,-length/2),
        new THREE.Vector3(0,0,length/2),
        new THREE.Vector3(-length/2,0,0),
        new THREE.Vector3(length/2,0,0),
    ]
    group._rotList = [
        new THREE.Vector3(Math.PI / 2, 0 , 0),
        new THREE.Vector3(-Math.PI / 2, 0 , 0),
        new THREE.Vector3(0, Math.PI , 0),
        new THREE.Vector3(0, 0 , 0),
        new THREE.Vector3(0, -Math.PI / 2 , 0),
        new THREE.Vector3(0, Math.PI / 2 , 0),
    ]

    group._init = function() {

        for (var i = 4; i < 5; i++) {
            var face = new SCRAP.LOBBY.faceObject(length, '');
            face.position.set(group._posList[i].x, group._posList[i].y, group._posList[i].z);
            face.rotation.set(group._rotList[i].x, group._rotList[i].y, group._rotList[i].z);
            group.add(face);
        }

    }

    group._init();

    group._mouseClicked = function() {
        console.log("cubeView mouseClicked!");
        group.parent._mouseClicked();
    }

    return group;

}

SCRAP.LOBBY.orbitLineObject = function( radius ) {

    var root = new SCRAP.Element('div',
        {
            'style' : {
                'opacity' : 1
            }
        }
        ,
        null
    );

    var element = new SCRAP.Element('div',
        {
            'className' : 'element',
            'style' : {
                'backgroundColor':'rgba(0, 0, 0, 0)',
                'border-radius':'50%',
                'width' : radius + "px",
                'height' : radius + "px"
            }
        }
        , root
    );

    var object = new THREE.CSS3DObject(root);
    object._width = radius;
    object._height = radius;

    object.rotation.x = Math.PI / 2;

    return object;

}

SCRAP.LOBBY.orbitCubeView = function( length, radius ) {

    var group = new THREE.Group();

    group._theta = Math.random() * Math.PI / 360;

    group._init = function() {

        var cube = new SCRAP.LOBBY.cubeView( length );
        group.add(cube);
        cube.position.x = -radius / 2;
        cube.position.y = length / 2 + 20;

    }

    group.rotation.y = group._theta * Math.random() * 720;

    group._init();

    group._mouseClicked = function(pos, rot) {
        console.log("orbitCubeView mouseClicked!");
        var cube = group.children[0];
        console.log(cube.position.x);
        var pos = new THREE.Vector3(cube.position.x, group.position.y, 0);
        var rot = new THREE.Vector3(0, group.rotation.y, 0);
        group.parent._mouseClicked(pos, rot);
    }

    return group;

}

SCRAP.LOBBY.galaxyView = function( users, weight ) {

    var group = new THREE.Group();

    group._wormHole = [];
    group._spinner = [];
    group._sphere= [];

    group._init = function() {

        // wormHole
        for (var i=0; i<users.length; i++) {
            var param = Math.sqrt(weight[i]);

            group._wormHole.push({ pos : [], rot : [] });

            if((Math.floor(Math.random() * 10000) % 2) == 1) {
                group._wormHole[i].pos = new THREE.Vector3( weight[i], param * param, 0);
                group._wormHole[i].rot = new THREE.Vector3( 0, 0, 0);
            } else {
                group._wormHole[i].pos = new THREE.Vector3( weight[i], -param * param, 0);
                group._wormHole[i].rot = new THREE.Vector3( 0, 0, 0);
            }

        }

        // spinner
        for (var i=0; i<users.length; i++) {
            var param = (weight[i] - 1500) / 75;

            group._spinner.push({ pos : [], rot : [] });

            if((Math.floor(Math.random() * 10000) % 2) == 1) {
                group._spinner[i].pos = new THREE.Vector3( weight[i], param * param, 0);
                group._spinner[i].rot = new THREE.Vector3( 0, 0, 0);
            } else {
                group._spinner[i].pos = new THREE.Vector3( weight[i], -param * param, 0);
                group._spinner[i].rot = new THREE.Vector3( 0, 0, 0);
            }

        }

        // sphere
        for (var i=0; i<users.length; i++) {

            var row = Math.random() * 2 * Math.PI;
            var yol = Math.random() * 2 * Math.PI;
            var pitch = Math.random() * 2 * Math.PI;

            group._sphere.push({ pos : [], rot : [] });

            group._sphere[i].pos = new THREE.Vector3( weight[i], 0, 0);
            group._sphere[i].rot = new THREE.Vector3( row, yol, pitch );

        }

        // init
        for(var i=0; i<users.length; i++) {

            var orbitBox = new SCRAP.LOBBY.orbitCubeView(10, Math.random() * 5000 + 5000);
            orbitBox.position.y = Math.random() * 5000 - 2500;
            group.add(orbitBox);

        }

        group._start();
    }

    group._update = function() {

        group.rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI / 1440);

    }

    group._start = function() {
        group._transformation( "wormHole" );
    }

    group._exit = function() {

    }

    group._transformation = function( to ) {

        var tw = null;

        for( var i=0; i<users.length; i++) {

            var delta = Math.random() * 3000 + 1500;

            new TWEEN.Tween(group.children[i].children[0].position)
                .to({x : group["_"+to][i].pos.x}, delta)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
            new TWEEN.Tween(group.children[i].position)
                .to({ y : group["_"+to][i].pos.y }, delta)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();

            new TWEEN.Tween(group.children[i].rotation)
                .to({x : group["_"+to][i].rot.x, z : group["_"+to][i].rot.z }, delta)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();

        }

    }

    group._mouseClicked = function(pos,rot) {
        console.log("galaxyView mouseClicked!");
        var delta = 300;
        var defaultAxis = -Math.PI / 8;
        camTargetDestPos = new THREE.Vector3(pos.x, pos.y, 0);
        camDestPos = new THREE.Vector3(pos.x + delta, pos.y, 0);
        console.log(camTargetDestPos);
        console.log(camDestPos);
        // x:group.position.x + _delta * cnt * Math.cos(Math.PI / 8),
        // z:group.position.z + _delta * cnt * Math.sin(Math.PI / 8)

        var newX = camDestPos.x * Math.cos(rot.y) + camDestPos.z * Math.sin(rot.y);
        var newZ = -camDestPos.x * Math.sin(rot.y) + camDestPos.z * Math.cos(rot.y);
        //var newnewX = newX * Math.cos(defaultAxis) + camDestPos.y * Math.sin(defaultAxis);
        //var newnewY = -newX * Math.sin(defaultAxis) + camDestPos.y * Math.cos(defaultAxis);
        camDestPos.x = newX;
        //camDestPos.y = newnewY;
        camDestPos.z = newZ;
        var newTX = camTargetDestPos.x * Math.cos(rot.y) + camTargetDestPos.z * Math.sin(rot.y);
        var newTZ = -camTargetDestPos.x * Math.sin(rot.y) + camTargetDestPos.z * Math.cos(rot.y);
        //var newnewTX = newTX * Math.cos(defaultAxis) + camTargetDestPos.y * Math.sin(defaultAxis);
        //var newnewTY = -newTX * Math.sin(defaultAxis) + camTargetDestPos.y * Math.cos(defaultAxis);
        camTargetDestPos.x = newTX;
        //camTargetDestPos.y = newnewTY;
        camTargetDestPos.z = newTZ;
        var curScene = SCRAP.DIRECTOR._sceneList["lobby"];
        new TWEEN.Tween(camera.position)
            .to({x:camDestPos.x, y:camDestPos.y, z:camDestPos.z}, 3000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
        new TWEEN.Tween(cameraTarget)
            .to({x:camTargetDestPos.x, y:camTargetDestPos.y, z:camTargetDestPos.z}, 3000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
    }

    //group.rotation.z = -Math.PI / 8;

    group._init();

    return group;

}