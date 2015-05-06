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

        for (var i = 0; i < 6; i++) {
            group.add(new SCRAP.LOBBY.faceObject(length, ''));
            group.children[i].position.set(group._posList[i].x, group._posList[i].y, group._posList[i].z);
            group.children[i].rotation.set(group._rotList[i].x, group._rotList[i].y, group._rotList[i].z);
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

        var line = new SCRAP.LOBBY.orbitLineObject( radius );
        //group.add(line);

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

    group._init = function() {
var odd = 0;
        var even = 0;
        for(var i=0; i<users.length; i++) {

            var orbitBox = new SCRAP.LOBBY.orbitCubeView(10, (Math.log2(weight[i])));
            if( Math.floor(Math.random() * 10000) % 2 == 1 ) {
                odd++
                orbitBox.position.y = weight[i];
            }
            else {
                even++;
                orbitBox.position.y = -weight[i];
            }
            group.add(orbitBox);

        }
        console.log(even + " , " + odd);

    }

    group._update = function() {
        group.rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI / 100);
    }

    group.rotation.z = -Math.PI / 4;

    group._init();

    return group;

}