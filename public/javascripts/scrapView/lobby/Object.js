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

        for (var i = 2; i < 3; i++) {
            var face = new SCRAP.LOBBY.faceObject(length, '');
            face.position.set(group._posList[i].x, group._posList[i].y, group._posList[i].z);
            face.rotation.set(group._rotList[i].x, group._rotList[i].y, group._rotList[i].z);
            group.add(face);
        }

    }

    group._init();


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
            if((Math.floor(Math.random() * 10000) % 2) == 1) {
                group._wormHole[i] = new THREE.Vector3( weight[i], param * param, 0);
            } else {
                group._wormHole[i] = new THREE.Vector3( weight[i], -param * param, 0);
            }

        }

        // spinner
        for (var i=0; i<users.length; i++) {
            var param = (weight[i] - 1500) / 75;
            if((Math.floor(Math.random() * 10000) % 2) == 1) {
                group._spinner[i] = new THREE.Vector3( weight[i], -param * param, 0 );
            } else {
                group._spinner[i] = new THREE.Vector3( weight[i], param * param, 0 );
            }

        }

        // sphere
        for (var i=0; i<users.length; i++) {

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

        for( var i=0; i<users.length; i++) {
            var delta = Math.random() * 3000 + 1500;
            new TWEEN.Tween(group.children[i].children[0].position)
                .to({x : group["_"+to][i].x}, delta)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();

            new TWEEN.Tween(group.children[i].position)
                .to({y : group["_"+to][i].y }, delta)
                .easing(TWEEN.Easing.Exponential.InOut)
                .onComplete(function() {
                })
                .start();
        }

    }

    group.rotation.z = -Math.PI / 8;

    group._init();

    return group;

}