/**
 * Created by user on 2015-04-03.
 */

SCRAP.INTRO = {REVISION:1}

SCRAP.INTRO.loginObject = function( type ) {

    var root = new SCRAP.Element('div',
        {
            'style' : {
                'opacity' : 0
            }
        }
        ,
        null
    );

    var element = new SCRAP.Element('div',
        {
            'className' : 'element',
            'style' : {
                'backgroundColor':'rgba(0,0,0,0.9)'
            }
        }
        , root
    );

    new SCRAP.Element('div',
        {
            'className' : 'blank_big'
        }
        , element
    );

    var id = new SCRAP.Element('div',
        {
            'className' : 'input'
        }
        , element
    );

    var idText = new SCRAP.Element('input',
        {
            'className' : 'text',
            'type' : 'text',
            'placeholder' : 'username',
            'disabled'   : false,
            'autofocus' : true
        }
        , id
    );

    var pw = new SCRAP.Element('div',
        {
            'className' : 'input'
        }
        , element
    );

    var pwText = new SCRAP.Element('input',
        {
            'className' : 'text',
            'type' : 'password',
            'placeholder' : 'password',
            'disabled'   : false
        }
        , pw
    );

    var object = new THREE.CSS3DObject(root);
    object._width = 300;
    object._height = 500;

    object._getId = function() {
        return idText.value;
    }

    object._getPw = function() {
        return pwText.value;
    }

    object._reset = function() {
        idText.value = "";
        pwText.value = "";
    }

    return object;
}


SCRAP.INTRO.loginCloneObject = function( type ) {

    var root = new SCRAP.Element('div',
        {
            'style' : {
                'opacity' : 0
            }
        }
        ,
        null
    );

    var element = new SCRAP.Element('div',
        {
            'className' : 'element',
            'style' : {
                'opacity' : 0.3,
                'backgroundColor':'rgba(0,0,0,0.9)'
            }
        }
        , root
    );

    new SCRAP.Element('div',
        {
            'className' : 'blank_big'
        }
        , element
    );

    var id = new SCRAP.Element('div',
        {
            'className' : 'input'
        }
        , element
    );

    var idText = new SCRAP.Element('input',
        {
            'className' : 'text',
            'type' : 'text',
            'placeholder' : 'username',
            'disabled'   : true
        }
        , id
    );

    var pw = new SCRAP.Element('div',
        {
            'className' : 'input'
        }
        , element
    );

    var pwText = new SCRAP.Element('input',
        {
            'className' : 'text',
            'type' : 'password',
            'placeholder' : 'password',
            'disabled'   : true
        }
        , pw
    );

    var object = new THREE.CSS3DObject(root);

    return object;
}


SCRAP.INTRO.loginView = function( x, y, z, mirror ) {

    var group = new THREE.Group();
    var loginObject = new SCRAP.INTRO.loginObject();
    var hover = 10;

    loginObject.position.set(0, hover + ( loginObject._height / 2) , 0);

    group.add(loginObject);

    if(mirror) {
        var mirror = SCRAP.INTRO.loginCloneObject();
        mirror.position.set(0, -( hover + ( loginObject._height / 2) ), 0);
        mirror.rotation.x = -Math.PI;
        group.add(mirror);
    }

    group.position.set( x-1000, y, z);

    group._start = function() {
        console.log("start login");
        new TWEEN.Tween(group.position)
            .to({x: 0}, 1000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
        for(var i=0; i<group.children.length; i++) {
            var temp = group.children[i];
            SCRAP.Fader.fadeIn(temp, 1000);
        }
    }

    group._exit = function() {

        new TWEEN.Tween(group.position)
            .to({x: 1000}, 1000)
            .easing(TWEEN.Easing.Exponential.Out)
            .start();
        for(var i=0; i<group.children.length; i++) {
            var temp = group.children[i];
            SCRAP.Fader.fadeOut(temp, 1000);
        }
    }

    group._action = { name : "loginView" };
    group._action["signUp"] = function( chain ) {
        new TWEEN.Tween(group.position)
            .to({x:-150},1000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .onComplete(function() {
                if(chain!=null) chain();
            })
            .start();
    }

    group._action["signIn"] = function( chain ) {
        new TWEEN.Tween(group.position)
            .to({x:0},1000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .onComplete(function() {
                if(chain!=null) chain();
            })
            .start();
    }

    group._getId = function() {
        return loginObject._getId();
    }

    group._getPw = function() {
        return loginObject._getPw();
    }

    group._reset = function() {
        group.children[0]._reset();
    }

    return group;
}


SCRAP.INTRO.ButtonObject = function( textValue ) {

    var root = new SCRAP.Element('div',
        {
        },
        null
    );

    var element = new SCRAP.Element('div',
        {
            'className' : 'list',
            'style' : {
                'backgroundColor':'rgba(0,127,127,0.5)'
            }
        }
        , root
    );

    var symbol = new SCRAP.Element('div',
        {
            'className' : 'symbol',
            'innerHTML' : textValue
        }
        , element
    );

    var object = new THREE.CSS3DObject(root);
    object._width = 200;
    object._height = 40;

    return object;

}

SCRAP.INTRO.IntroControlView = function( x, y, z, mirror ) {

    var group = new THREE.Group();

    var signInObject = new SCRAP.INTRO.ButtonObject('로그인');
    group.add(signInObject);
    var joinObject = new SCRAP.INTRO.ButtonObject('회원가입화면');
    group.add(joinObject);

    var margin = 10;

    for(var i=0; i<group.children.length; i++) {

        var temp = group.children[i];

        temp.position.y = - ( margin + temp._height ) * i - temp._height / 2;
        temp.position.x = 1000;
        temp.element.style.opacity = 0;
    }

    group.position.set(x, y, z);

    group.rotation.x = -Math.PI / 2;

    group._start = function() {
        for(var i=0; i<group.children.length; i++) {
            var temp = group.children[i];
            new TWEEN.Tween(temp.position)
                .to({x:0},1000 + 100 * i)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
            SCRAP.Fader.fadeIn(temp, 1000 + 100 * i);
        }
    }

    group._exit = function () {
        for(var i=0; i<group.children.length; i++) {
            console.log("group[i] : " + i);
            var temp = group.children[i];
            new TWEEN.Tween(temp.position)
                .to({x:-1000},1000 + 100 * i)
                .onComplete(function () {
                    for(var i=0; i<group.children.length; i++) {
                        var temp = group.children[i].element.style.opacity=0;
                    }
                })
                .easing(TWEEN.Easing.Exponential.Out)
                .start();
            SCRAP.Fader.fadeOut(temp, 1000 + 100 * i);
        }
    }

    return group;
}

SCRAP.INTRO.IntroJoinView = function( x, y, z, mirror ) {

    var group = new THREE.Group();

    var joinObject = new SCRAP.INTRO.ButtonObject('가입신청');
    group.add(joinObject);
    var loginObject = new SCRAP.INTRO.ButtonObject('로그인화면');
    group.add(loginObject);

    var margin = 10;

    for(var i=0; i<group.children.length; i++) {

        var temp = group.children[i];

        temp.position.y = - ( margin + temp._height ) * i - temp._height / 2;
        temp.position.x = 1000;
        temp.element.style.opacity = 0;
    }

    group.position.set(x, y, z);

    group.rotation.x = -Math.PI / 2;

    group._start = function() {
        for(var i=0; i<group.children.length; i++) {
            var temp = group.children[i];
            new TWEEN.Tween(temp.position)
                .to({x:0},1000 + 100 * i)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
            SCRAP.Fader.fadeIn(temp, 1000 + 100 * i);
        }
    }

    group._exit = function () {
        for(var i=0; i<group.children.length; i++) {
            var temp = group.children[i];
            new TWEEN.Tween(temp.position)
                .to({x:1000},1000 + 100 * i)
                .easing(TWEEN.Easing.Exponential.Out)
                .start();
            SCRAP.Fader.fadeOut(temp, 1000 + 100 * i);
        }
    }

    return group;
}


SCRAP.INTRO.loadingObject = function() {

    var root = new SCRAP.Element('div',
        {
            'style':
            {
                'opacity': 0
            }
        },
        null
    );

    var element = new SCRAP.Element('div',
        {
            'className':'status',
            'style':
            {
                'backgroundColor':'rgba(0,127,127,0.5)'
            }
        },
        root
    );

    var container = new SCRAP.Element('div',
        {
            'className':'loading-container'
        },
        element
    );

    var loading = new SCRAP.Element('div',
        {
            'className':'loading'
        },
        container
    );

    var loading = new SCRAP.Element('div',
        {
            'id':'loading-text',
            'innerHTML':'loading...'
        },
        container
    );

    var object = new THREE.CSS3DObject(root);
    object._width = 200;
    object._height = 40;

    return object;
}

SCRAP.INTRO.LoadingView = function (x, y, z, mirror) {

    var group = new THREE.Group();

    var loadingObject = new SCRAP.INTRO.loadingObject();
    var hover = 260;

    loadingObject.position.set(0, hover + ( loadingObject._height / 2) , 0);

    group.add(loadingObject);

    if(mirror) {
        var mirror = new SCRAP.Clone(loadingObject, SCRAP.INTRO.loadingObject);
        mirror.position.set(0, -( hover + ( loadingObject._height / 2) ), 0);
        group.add(mirror);
    }

    group.position.set(x+1000, y, z);

    group._start = function() {
        /*
        console.log("start");
        new TWEEN.Tween(group.position)
            .to({x:0},1000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
        for(var i=0; i<group.children.length; i++) {
            var temp = group.children[i];
            new TWEEN.Tween(temp.element.style)
                .to({opacity:1},1000)
                .start();
        }
        */
    }

    group._exit = function() {
/*
        new TWEEN.Tween(group.position)
            .to({x:-1000},1000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .onComplete(function() {
                group.position.x = 1000;
                for(var i=0; i<group.children.length; i++) {
                    var temp = group.children[i].element.style.opacity=0;
                }
            })
            .start();
            */

    }

    return group;
}


SCRAP.INTRO.PreviewObject = function ( t ) {
    

    var root = new SCRAP.Element('div',
        {
            'style':
            {
                'opacity': 0
            }
        },
        null
    );

    var element = new SCRAP.Element('div',
        {
            'className':'preview_l',
            'style':
            {
                'backgroundColor':'rgba(0,127,127,0.5)'
            }
        },
        root
    );

    var container = new SCRAP.Element('div',
        {
            'className':'symbol',
            'innerHTML': t
        },
        element
    );

    var object = new THREE.CSS3DObject(root);
    object._width = 300;
    object._height = 200;

    return object;
}

SCRAP.INTRO.GuideView = function(x, y, z, mirror) {

    var group = new THREE.Group();
    group._bound = 3;
    group._head = -group._bound-1;
    group._slot = [];
    group._margin = 50;
    group._action = false;

    group._rotateUp = function() {
        if(group._action){
            setTimeout(group._rotateUp,100);
            return;
        }
        group._action = true;
        group._head++

        var start = group._head;
        var end = group._head + group._bound;
        var idx = 0;

        while(start + idx <= end) {
            if(start + idx < 0 || start + idx >= group.children.length){
                idx++;
                continue;
            }
            if(start+idx >= end){
                group.children[start+idx].position.set(group._slot[idx+1].x, group._slot[idx+1].y, group._slot[idx+1].z);
            }
            var tween = new TWEEN.Tween(group.children[start + idx].position)
                                    .to({x: group._slot[idx].x, y: group._slot[idx].y, z: group._slot[idx].z}, 200)
                                    .start();

            group.children[start + idx].element.style.opacity = 1;
            idx++;
        }
        if(tween!=null) {
            tween.onComplete(function () {
                group._action = false;
                if(group._head >= 0)
                {
                    SCRAP.Fader.fadeOut(group.children[start],200);
                }
            });
        }
    }

    group._rotateDown = function() {
        if(group._action){
            setTimeout(group._rotateDown,100);
            return;
        }
        group._action = true;
        group._head--;

        var start = group._head + 1;
        var end = group._head + group._bound + 1;
        var idx = 0;

        while(start + idx < end) {
            if(start + idx < 0 || start + idx >= group.children.length){
                idx++;
                continue;
            }
            if(idx==0) {
                group.children[start + idx].position.set(group._slot[idx].x, group._slot[idx].y, group._slot[idx].z);
            }
            var tween = new TWEEN.Tween(group.children[start + idx].position)
                .to({x: group._slot[idx+1].x, y: group._slot[idx+1].y, z: group._slot[idx+1].z}, 200)
                .start();

            group.children[start + idx].element.style.opacity = 1;
            idx++;
        }
        if(end < group.children.length){
            SCRAP.Fader.fadeOut(group.children[start+idx],200);
        }
        tween.onComplete(function() {
            group._action = false;
        });
    }

    group._init = function() {
        var bound = group._bound + 2;
        for(var i=0; i<15; i++) {
            group.add(new SCRAP.INTRO.PreviewObject(i));
        }
        var _width = group.children[0]._width;
        var _height = group.children[0]._height;
        var mid = Math.floor(bound / 2);

        for(var i=0; i<bound; i++) {
            var dist = Math.abs(mid - i);
            group._slot.push(new THREE.Vector3(0, (_height * 0.7) * (i), -dist * group._margin));
        }
    }

    group._start = function () {
        group._head = -group._bound-1;
        for(var i=0; i<group._bound; i++) {
            group._rotateUp();
        }
    }

    group._exit = function ( chain ) {
        var start = group._head + 1;

        for(var i=0; i<group._bound; i++) {
            var temp = group.children[start + i];
            if(i%2==0){
                new TWEEN.Tween(temp.position)
                    .to({x:-200},200)
                    .start();
                SCRAP.Fader.fadeOut(temp,200);
            } else {
                new TWEEN.Tween(temp.position)
                    .to({x:200},200)
                    .start();
                SCRAP.Fader.fadeOut(temp,200);
            }
        }
    }

    group._init();

    group.position.set(x,y,z);

    group.rotation.y = -Math.PI / 8;

    return group;
}


SCRAP.INTRO.AlertObject = function( ) {

    var root = new SCRAP.Element('div',
        {
            'style' : {
                'opacity' : 0
            }
        }
        ,
        null
    );

    var element = new SCRAP.Element('div',
        {
            'className' : 'alert',
            'style' : {
                'backgroundColor':'rgba(0,0,0,0.9)'
            }
        }
        , root
    );

    var msg = new SCRAP.Element('div',
        {
            'className' : 'msg'
        }
        , element
    );

    var object = new THREE.CSS3DObject(root);
    object._height = 20;

    object._setText = function( _msg ) {
        msg.innerHTML = _msg;
    }

    return object;
}

SCRAP.INTRO.AlertView = function(x, y, z, mirror) {

    var group = new THREE.Group();
    var alertObject = new SCRAP.INTRO.AlertObject();
    var hover = 250;

    alertObject.position.set(0, hover + ( alertObject._height / 2) , 0);

    group.add(alertObject);

    if(mirror) {
        var mirror = new SCRAP.Clone(alertObject, SCRAP.INTRO.AlertObject);
        mirror.position.set(0, -( hover + ( alertObject._height / 2) ), 0);
        group.add(mirror);
    }

    group.position.set(SCRAP._INF, SCRAP._INF, SCRAP._INF);
    group._alertPosition = new THREE.Vector3(x,y,z);

    group._start = function() {
        var target = group._alertPosition;
        group.position.set(target.x, target.y, target.z);
        for(var i=0; i<group.children.length; i++) {
            var temp = group.children[i];
            SCRAP.Fader.fadeIn(temp, 300);
        }
        setTimeout(group._exit, 2000);
    }

    group._exit = function() {
        for(var i=0; i<group.children.length; i++) {
            var temp = group.children[i];
            SCRAP.Fader.fadeOut(temp, 300);
        }
        setTimeout(function() {
            group.position.set(SCRAP._INF, SCRAP._INF, SCRAP._INF);
        }, 300);
    }

    group._alert = function( msg ) {
        for(var i=0; i<group.children.length; i++){
            var temp = group.children[i];
            temp._setText(msg);
        }
        group._start();
    }

    return group;
}
