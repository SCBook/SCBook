/**
 * Created by user on 2015-04-20.
 */

SCRAP.MAIN2 = {REVISION : 1};

SCRAP.MAIN2.previewObject = function() {

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
            'className' : 'preview',
            'style' : {
                'backgroundColor':'rgba(0,0,0,0.5)'
            }
        }
        , root
    );

    var object = new THREE.CSS3DObject(root);
    object._width = 300;
    object._height = 200;
    object._element = element;

    return object;
}

SCRAP.MAIN2.FlipView = function(x, y, z, mirror) {

    var group = new THREE.Group();
    group.slot_p = [];
    group.slot_r = [];
    group.flipAnimation = [];
    group.margin = 20;
    group._cur = -1;
    group._est = false;

    group._init = function() {
        for (var i = 0; i < 15; i++) {
            group.slot_r.push(new THREE.Vector3(-Math.PI / 2, 0, 0));
            group.slot_p.push(new THREE.Vector3(0, i * group.margin, 0));
        }
        for (var i = 0; i < 15; i++) {
            group.add(new SCRAP.MAIN2.previewObject());
            group.children[i].position.set(0, SCRAP._INF, 0);
            group.children[i]._element._idx = i;
        }
        group._start();
    }

    group._start = function() {
        var tw_p, tw_r;
        for(var i=0; i<15; i++) {
            tw_p = new TWEEN.Tween(group.children[i].position)
                .to({x:group.slot_p[i].x,y:group.slot_p[i].y,z:group.slot_p[i].z},1000 + 100 * i)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
            tw_r = new TWEEN.Tween(group.children[i].rotation)
                .to({x:group.slot_r[i].x,y:group.slot_r[i].y,z:group.slot_r[i].z},1000 + 100 * i)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
            SCRAP.Fader.fadeIn(group.children[i],1000 + 100 * i);
        }
        tw_p.onComplete(function() {
            group._est = true;
            group._select(0);
        })
    }

    group._flipDown = function() {
        if(group._cur==-1) return;
        for(var i=0 ; i<group.flipAnimation.length; i++) {
            TWEEN.remove(group.flipAnimation[i]);
        }
        group.flipAnimation.splice(1,group.flipAnimation.length);
        group._cur = -1;
    }

    group._flip = function( idx ) {
        if(!group._est) return;

        group._flipDown();

        if(group.children[idx]==null) return;

        var height = group.children[idx]._height;

        for(var i=14; i>idx; i--) {
            new TWEEN.Tween(group.children[i].position)
                .to({y:group.slot_p[i].y + height}, 300)
                .start();
            new TWEEN.Tween(group.children[i].rotation)
                .to({x:group.slot_r[i].x},300)
                .start();
        }

        new TWEEN.Tween(group.children[idx].position)
            .to({y:group.slot_p[i].y + height / 2}, 300)
            .start();

        new TWEEN.Tween(group.children[idx].rotation)
            .to({x:0},300)
            .start();

        for(var i=idx-1; i>=0; i--) {
            new TWEEN.Tween(group.children[i].position)
                .to({y:group.slot_p[i].y}, 300)
                .start();
            new TWEEN.Tween(group.children[i].rotation)
                .to({x:group.slot_r[i].x},300)
                .start();
        }

        group._cur = idx;

    }

    group._select = function( idx ) {
        var curScene = SCRAP.DIRECTOR._sceneList["main2"];

        new TWEEN.Tween(group.position)
            .to({x:-500},1000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .onComplete(function() {
                curScene.CSSScene.children[2]._start();
            })
            .start();

        new TWEEN.Tween(group.rotation)
            .to({y:Math.PI/4},1000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

    }

    group._init();

    return group;
}

SCRAP.MAIN2.mainviewObject = function( t ) {

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
            'className' : 'mainview',
            'style' : {
                'backgroundColor':'rgba(0,0,0,0.5)'
            }
        }
        , root
    );

    var object = new THREE.CSS3DObject(root);
    object._width = 800;
    object._height = 600;
    object._element = element;
    object._data = "";
    object._keywordSet = [];
    object._path = "";
    object._user = "";
    object._index = -1;

    object._setData = function(data, keywordSet, path, user, index) {
        object._data = data;
        object._keywordSet = keywordSet;
        object._path = path;
        object._user = user;
        object._index = index;
        object._element.innerHTML = data;
    }

    return object;

}

SCRAP.MAIN2.circleView = function (x, y, z, mirror) {

    var group = new THREE.Group();
    group._bound = 3;
    group._head = 0;
    group._margin = 20;
    group._action = false;
    group._selec = -1;
    group._req = true;

    group._setList = function(rcvData, rcvKeyword, rcvPath, rcvUser, rcvIdx, dir) {
        group._req = false;

        var offset = 0;

        if( dir ) {
            offset = group.children.length;
            group._addFront(rcvData.length);
        }
        else group._addBack(rcvData.length);

        for(var i=0; i<rcvData.length; i++){
            group.children[rcvData.length - i - 1 + offset]._setData(rcvData[i],rcvKeyword[i],rcvPath[i], rcvUser[i], rcvIdx[i]);
        }
    }

    group._init = function() {
        group.position.set(x, y, z);
    }

    group._start = function() {
/*
        var _width = group.children[0]._width;
        var _height = group.children[0]._height;
*/
        var _width = 800;
        var _height = 600;
        var delta = (2500);

        group.position.set(x -delta * Math.cos(Math.PI / 8), 0, z - delta * Math.sin(Math.PI / 8));

        new TWEEN.Tween(group.position)
            .to({x:group.position.x + (2500 - _width / 2) * Math.cos(Math.PI / 8), z:group.position.z + (2500 - _width / 2) * Math.sin(Math.PI / 8)}, 1000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

        var _head = group._head;
        var _bound = group._bound;

        for(var i=0; i<group.children.length; i++) {
            var child = group.children[i];
            SCRAP.Fader.fadeIn(child, 300);
        }

    }

    group._move = function( idx ) {
        if(idx == null) return;
        if(group._head > idx) group._backward( group._head - idx );
        else group._forward( idx - group._head );
    }

    group._requestOld = function( cnt ) {
        console.log("requestOld!!");
        var lastIdx = group.children[group.children.length - 1]._index;
        console.log("index : " + lastIdx);
        var end = lastIdx;
        if(end==0) {
            group._req = false;
            return;
        }
        var start = end - cnt;
        if(start < 0) start = 0;
        requestScrap(SCRAP.DIRECTOR._curuser, start, end, "old");
    }

    group._addFront = function( cnt ) {
        var offset = group.children.length;
        for(var i=0; i<cnt; i++) {
            group.add(new SCRAP.MAIN2.mainviewObject("main " + i + offset));
            var _width = group.children[i+offset]._width;
            var _height = group.children[i+offset]._height;
            group.children[i+offset].position.set(-((_width+group._margin) * (i + offset)), _height / 2, 0);
            group.children[i+offset]._element._idx = i+offset;
            if(offset > 0) SCRAP.Fader.fadeIn(group.children[i+offset], 300);

            var curScene = SCRAP.DIRECTOR._sceneList["main2"];
            group.children[i+offset].element.addEventListener('wheel', curScene.moveObject);
            group.children[i+offset].element.addEventListener('click', function (e) {
                var element = e.target;
                while(element._idx==null) {
                    element = element.parentElement;
                }
                if (group._selec < 0) group._select(element._idx);
                else group._deselect(null);
            });
        }
    }

    group._forward = function( cnt ) {
        if(cnt == null) return;

        if(group._selec >= 0){
            group._deselect(group._forward, cnt);
            return;
        }

        cnt = group.children.length - ( group._head + group._bound  + cnt );

        if(cnt <= -group._bound && !group._req) {
            group._req = true;
            group._requestOld(10);
            return;
        }
        else cnt = -(cnt + group._head + group._bound - group.children.length);

        if(group._action){
            console.log("already action!");
            setTimeout(group._forward, 100);
            return;
        }

        console.log("forward : " + cnt);
        group._action = true;

        var _width = group.children[group._head]._width;
        var _margin = group._margin;
        var _delta = _width + _margin;

        new TWEEN.Tween(group.position)
            .to({x:group.position.x + _delta * cnt * Math.cos(Math.PI / 8), z:group.position.z + _delta * cnt * Math.sin(Math.PI / 8)}, 100 * cnt)
            .easing(TWEEN.Easing.Exponential.InOut)
            .onComplete(function() {
                group._action = false;
            })
            .start();

        group._head += cnt;
    }

    group._requestNew = function( cnt ) {
        console.log("requestNew!!");
        var firstIdx = group.children[0]._index;
        var start = firstIdx+1;
        var end = start + cnt;
        requestScrap(SCRAP.DIRECTOR._curuser, start, end, "new");
    }

    group._addBack = function( cnt ) {
        if(cnt <= 0) return;
        var _width = group.children[0]._width;
        var _height = group.children[0]._height;
        for(var i=0; i<group.children.length; i++) {
            group.children[i].position.x -= (_width+group._margin) * cnt;
        }

        var _delta = (_width+group._margin) * cnt;
        group.position.x += _delta * Math.cos(Math.PI / 8);
        group.position.z += _delta * Math.sin(Math.PI / 8);
        var temp = group.children;
        for(var i=0; i<temp.length; i++) {
            var num = temp[i]._element._idx;
            console.log(num);
            console.log(num + cnt);
            temp[i]._element._idx = num + cnt;
        }
        group.children = [];
        for(var i=0; i<cnt; i++) {
            group.add(new SCRAP.MAIN2.mainviewObject("main " + i));
            group.children[i].position.set(-(_width+group._margin) * (i), _height / 2 , 0);
            group.children[i]._element._idx = i;
            SCRAP.Fader.fadeIn(group.children[i], 300);

            var curScene = SCRAP.DIRECTOR._sceneList["main2"];
            group.children[i].element.addEventListener('wheel', curScene.moveObject);
            group.children[i].element.addEventListener('click', function (e) {
                var element = e.target;
                if(element._idx==null) {
                    element = element.parentElement;
                }
                if (group._selec < 0) group._select(element._idx);
                else group._deselect(null);
            });
        }
        group._head += cnt;
        group._targetPos += cnt;
        group.children = group.children.concat(temp);
    }

    group._backward = function( cnt ) {
        console.log("backward : " + cnt);
        if(cnt == null) return;

        if(group._selec >= 0){
            group._deselect(group._backward, cnt);
            return;
        }

        cnt = group._head - cnt;
        if(cnt < 0 && !group._req) {
            group._req = true;
            group._requestNew(10);
            return;
        }
        else cnt = group._head - cnt;

        if(group._action){
            console.log("already action!");
            setTimeout(group._backward, 100);
            return;
        }

        group._action=true;

        var _width = group.children[group._head]._width;
        var _margin = group._margin;
        var _delta = _width + _margin;

        new TWEEN.Tween(group.position)
            .to({x:group.position.x - _delta * cnt * Math.cos(Math.PI / 8), z:group.position.z - _delta * cnt * Math.sin(Math.PI / 8)}, 100 * cnt)
            .easing(TWEEN.Easing.Exponential.InOut)
            .onComplete(function() {
                group._action = false;
                group._req = false;
            })
            .start();

        for(var i=0; i<cnt; i++) {
            //SCRAP.Fader.fadeOut(group.children[group._head + group._bound], 100);
            group._head--;
            //SCRAP.Fader.fadeIn(group.children[group._head], 100);
        }
    }

    group._deselect = function( callback, param ) {

        if( group._selec < 0 || group._action ) return;

        var manager = SCRAP.DIRECTOR._sceneList["main2"];
        if( manager._camPosStack.length > 0 ){
            if(manager.CSSScene.children[4]._enable) manager.CSSScene.children[4]._exit();
            else manager.CSSScene.children[5]._exit();
            manager._moveCameraBack();
            return;
        }

        group._action = true;

        var curScene = SCRAP.DIRECTOR._sceneList["main2"].CSSScene;
        curScene.children[3]._exit();

        var cur = group.children[group._head];

        var _fromX = ((cur._width / 2) - (Math.cos(Math.PI/8) * cur._width/2));
        var _fromZ = Math.sin(Math.PI / 8) * cur._width / 2;

        var _deltaX = 300 * Math.sin(Math.PI / 8);
        var _deltaZ = 300 * Math.cos(Math.PI / 8);

        new TWEEN.Tween(cur.position)
            .to({ x:cur.position.x - _deltaX, z:cur.position.z - _deltaZ },1000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .onComplete(function() {
                new TWEEN.Tween(cur.position)
                    .to({x:cur.position.x - _fromX, z:cur.position.z - _fromZ},300)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start();
                new TWEEN.Tween(cur.rotation)
                    .to({y:0}, 300)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .onComplete(function() {
                        group._action = false;
                        group._selec = -1;
                        if(callback != null) callback(param);
                    })
                    .start();
            })
            .start();
    }

    group._select = function( idx ) {

        console.log("select");
        if(group._selec >= 0 || group._action) return;

        if( idx != group._head ) {
            group._move( idx );
        }

        group._selec = idx;
        group._action = true;

        var curScene = SCRAP.DIRECTOR._sceneList["main2"].CSSScene;

        var cur = group.children[idx];
        var _fromX = ((cur._width / 2) - (Math.cos(Math.PI/8) * cur._width/2));
        var _fromZ = Math.sin(Math.PI / 8) * cur._width / 2;

        var _deltaX = 300 * Math.sin(Math.PI / 8);
        var _deltaZ = 300 * Math.cos(Math.PI / 8);

        new TWEEN.Tween(cur.position)
            .to({ x:cur.position.x + _fromX, z:cur.position.z + _fromZ },300)
            .easing(TWEEN.Easing.Exponential.InOut)
            .onComplete(function() {
                new TWEEN.Tween(cur.position)
                    .to({x:cur.position.x + _deltaX, z:cur.position.z + _deltaZ},1000)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .onComplete(function() {
                        group._action = false;
                        curScene.children[3]._start();
                        //curScene.children[4]._start();
                    })
                    .start();
            })
            .start();

        new TWEEN.Tween(cur.rotation)
            .to({y:Math.PI / 8}, 300)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

    }

    group.rotation.y = -Math.PI/8;

    group._init();

    return group;

}

SCRAP.MAIN2.ButtonObject = function( textValue ) {

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

SCRAP.MAIN2.mainControlView = function( x, y, z, mirror ) {

    var group = new THREE.Group();

    var signInObject = new SCRAP.INTRO.ButtonObject('comment');
    group.add(signInObject);
    var joinObject = new SCRAP.INTRO.ButtonObject('User');
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
            var temp = group.children[i];
            new TWEEN.Tween(temp.position)
                .to({x:-1000},1000 + 100 * i)
                .onComplete(function () {
                    for(var i=0; i<group.children.length; i++) {
                        var temp = group.children[i];
                        temp.element.style.opacity=0;
                        temp.position.x = 1000;
                    }
                })
                .easing(TWEEN.Easing.Exponential.Out)
                .start();
            SCRAP.Fader.fadeOut(temp, 1000 + 100 * i);
        }
    }

    return group;
}

SCRAP.MAIN2.commentObject = function ( t ) {

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
            'className':'comment'
        },
        root
    );

    var picture = new SCRAP.Element('div',
        {
            'className':'picture'
        },
        element
    );

    var pic = new SCRAP.Element('img',
        {
            'src' : './images/sun_halo.png',
            'style' : {
                'width' : '75px',
                'height' : '75px'
            }
        },picture
    );

    var name = new SCRAP.Element('div',
        {
            'className':'name',
            'innerHTML':'hansolchoi'
        },
        element
    );

    var content = new SCRAP.Element('div',
        {
            'className':'content',
            'innerHTML' : t
        },
        element
    );

    var object = new THREE.CSS3DObject(root);
    object._width = 400;
    object._height = 120;

    return object;
}

SCRAP.MAIN2.commentListView = function(x, y, z, mirror) {

    var group = new THREE.Group();

    group._rotateUp = function() {

        if(group._action){
            setTimeout(group._rotateUp,100);
            return;
        }

        group._action = true;


        var start = group._head;
        var end = group._head + group._bound;
        group._head++
        group._targetPos++;
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

    group._rotateDown = function( ani ) {

        if(group._head < 0) return;
        if(group._targetPos <= 0 ){
            console.log("already on target");
            return;
        }
        if(group._action){
            console.log("can't down now");
            setTimeout(group._rotateDown, 100, ani);
            return;
        }

        group._action = true;
        group._head--;
        group._targetPos--;

        var start = group._head;
        var end = group._head + group._bound + 1;
        var idx = 0;

        while(start + idx < end) {
            console.log(start + " , " + idx + " , " + group.children.length);
            if(start + idx < 0 || start + idx >= group.children.length){
                idx++;
                continue;
            }
            if(idx==0) {
                group.children[start + idx].position.set(group._slot[idx].x, group._slot[idx].y, group._slot[idx].z);
            }
            if( ani ) {
                var tween = new TWEEN.Tween(group.children[start + idx].position)
                    .to({x: group._slot[idx + 1].x, y: group._slot[idx + 1].y, z: group._slot[idx + 1].z}, 200)
                    .start();
                if(idx==0) {
                    SCRAP.Fader.fadeIn(group.children[start+idx],200);
                }
            }
            else {
                group.children[start + idx].position.set(group._slot[idx + 1].x, group._slot[idx + 1].y, group._slot[idx + 1].z);
            }
            idx++;
        }
        if(end < group.children.length){
            if( ani ){
                SCRAP.Fader.fadeOut(group.children[end-1],200);
            }
            else {
                group.children[start + idx].element.style.opacity = 0;
            }
            group.children[start + idx].position.z = -10;
        }
        if(tween!=null) tween.onComplete(function() {
            group._action = false;
        });
        else group._action = false;
    }

    group._init = function() {

        group.children = [];
        group._bound = 4;
        group._head = 0;
        group._slot = [];
        group._margin = 20;
        group._action = false;
        group._enable = false;
        group._request = false;
        group._targetPos = 0;

        var bound = group._bound + 2;

        var _width = 300;
        var _height = 110;

        var mid = Math.floor(bound / 2);

        for(var i=0; i<bound; i++) {
            var dist = Math.abs(mid - i);
            group._slot.push(new THREE.Vector3(0, (_height + group._margin) * (i), 0));
            console.log(group._slot);
        }

        group._update();
        group._enable = true;
        group._start();
    }

    group._start = function () {

        if(group._request) return;
        group._request = true;

        var maxLen = group.children.length;

        var curScene = SCRAP.DIRECTOR._sceneList["main2"]
        var curView = curScene.CSSScene.children[2];
        var curIdx = curView._selec;
        var path = curView.children[curIdx]._path;

        requestComment(path, maxLen);

    }


    group._exit = function ( chain ) {

        group._enable = false;

        var start = group._head;
        var end = group._bound;
        if(group._bound > group.children.length) end = group.children.length;;

        for(var i=0; i<end; i++) {
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

    group._appear = function() {

        var start = group._head;
        var end = group._bound;
        if(group._bound > group.children.length) end = group.children.length;;

        for(var i=0; i<end; i++) {
            var temp = group.children[start + i];
            if(i%2==0) {
                temp.position.x = -200;
            }
            else temp.position.x = 200;
        }

        for(var i=0; i<end; i++) {
            var temp = group.children[start + i];
            if(i%2==0){
                new TWEEN.Tween(temp.position)
                    .to({x:0},200)
                    .start();
                SCRAP.Fader.fadeIn(temp,200);
            } else {
                new TWEEN.Tween(temp.position)
                    .to({x:0},200)
                    .start();
                SCRAP.Fader.fadeIn(temp,200);
            }
        }
    }

    group._add = function( newComments ) {

        function moveObject(event) {
            if(!group._enable) return;
            if (!event) event = window.event;
            if (event.wheelDelta > 0) {
                group._rotateUp();
            } else {
                group._rotateDown( true );
            }
        }

        var len = newComments.length;
        var prev_len = group.children.length;
        var temp = group.children;

        group.children = [];

        for (var i=0; i<len; i++) {
            var cmtObj = new SCRAP.MAIN2.commentObject(newComments[i]);
            cmtObj.element.addEventListener('wheel', moveObject);
            group.add(cmtObj);
        }
        group.children = group.children.concat(temp);

        if(prev_len==0){
            len++;
            group._head += len;
            group._targetPos += len;
            for (var i = 0; i < len; i++) {
                group._rotateDown( false );
            }
            group._appear();
        }
        else {
            group._head += len;
            group._targetPos += len;
            for (var i = 0; i < len; i++) {
                group._rotateDown( true );
            }
        }

        group._request = false;
        setTimeout(group._update,5000);
    }

    group._update = function() {
        if(!group._enable) return;
        console.log("update!");
        group._start();
    }

    group.position.set(x,y,z);

    return group;

}

SCRAP.MAIN2.commentInputObject = function(x, y, z) {

    var root = new SCRAP.Element('div',
        {
            'style':
            {
                'opacity': 0
            }
        },
        null
    );

    var element =  new SCRAP.Element('textarea',
        {
            'className' : 'comment_input',
            'type' : 'text',
            'placeholder' : 'enter your comment!',
            'rows':4,
            'cols':50
        }
        , root
    );

    var object = new THREE.CSS3DObject(root);
    object._width = 300;
    object._height = 50;

    object._getInput = function() {
        return element.value;
    }
    object._reset = function() {
        element.value = "";
    }

    return object;

}

SCRAP.MAIN2.commentInputView = function(x, y, z, mirror) {

    var group = new THREE.Group();

    group.add(new SCRAP.MAIN2.commentInputObject());

    group._start = function() {
        var temp = group.children[0];
        SCRAP.Fader.fadeIn(temp,200);
    }

    group._exit = function() {
        var temp = group.children[0];
        SCRAP.Fader.fadeOut(temp,200);
    }

    group.position.set(x, y, z);

    group.rotation.x = -Math.PI / 4;

    return group;
}

SCRAP.MAIN2.commentView = function(x, y, z) {

    var group = new THREE.Group();
    group._enable = false;
    group._myPos = new THREE.Vector3(x, y, z);

    group._init = function() {
        group.position.z = -SCRAP._INF;
        group.add(new SCRAP.MAIN2.commentListView(0,50,0));
        group.add(new SCRAP.MAIN2.commentInputView(0,0,0));
    }

    group._start = function() {
        group.position.z = group._myPos.z;
        if(group._enable) return;
        group._enable = true;
        for(var i=0; i<group.children.length; i++) {
            if(i==0) group.children[i]._init();
            else group.children[i]._start();
        }
        var curScene = SCRAP.DIRECTOR._sceneList["main2"];
        var targetPos = curScene.CSSScene.children[4].position;
        curScene._moveCamera(null, new THREE.Vector3(targetPos.x,cameraTarget.y,targetPos.z));
    }

    group._exit = function() {
        setTimeout(function() {group.position.z = -SCRAP._INF}, 300);
        if(!group._enable) return;
        for(var i=0; i<group.children.length; i++) {
            group.children[i]._exit();
        }
        var curScene = SCRAP.DIRECTOR._sceneList["main2"];
        group._enable = false;
    }

    group.position.set(x, y, z);

    group.rotation.y = -Math.PI / 4;

    group._init();

    return group;

}

SCRAP.MAIN2.progressBarObject = function( t, ratio ) {

    var root = new SCRAP.Element('div',
        {
            'className' : 'progress',
            'style':
            {
                'opacity': 0
            }
        },
        null
    );

    var element =  new SCRAP.Element('div',
        {
            'className' : 'key_text',
            'innerHTML' : t
        }
        , root
    );

    var object = new THREE.CSS3DObject(root);
    object._width = 450;
    object._height = 30;

    return object;

}

SCRAP.MAIN2.progressBarView = function( words, weights ) {

    var group = new THREE.Group();

    group._init = function() {
        for(var i=0; i<words.length; i++) {
            var progObj = new SCRAP.MAIN2.progressBarObject(words[i]+"("+weights[i]*100+"%)",weights[i]);
            progObj.position.set(0, (words.length - i) * (progObj._height + 20), 0);
            group.add(progObj);
        }
    }

    group._start = function() {
        console.log("from");
        for(var i=0; i<group.children.length; i++){
            setTimeout(SCRAP.Resizer._resizeObj, 100 * i, group.children[i], 0, 300 * weights[i], 1000);
            setTimeout(SCRAP.Fader.fadeIn, 100 * i, group.children[i], 500);
        }
        console.log("to");
    }

    group._exit = function() {
        for(var i=0; i<group.children.length; i++) {
            var temp = group.children[i];
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

    return group;
}

SCRAP.MAIN2.pictureObject = function() {

    var root = new SCRAP.Element('div',
        {
            'style':
            {
                'opacity': 0
            }
        },
        null
    );

    var element =  new SCRAP.Element('div',
        {
            'className' : 'profile_picture'
        }
        , root
    );

    var picture = new SCRAP.Element('img',
        {
            'src' : './images/sun_halo.png',
            'style' : {
                'width' : '100px',
                'height' : '100px'
            }
        },element
    );

    var object = new THREE.CSS3DObject(root);
    object._width = 100;
    object._height = 100;

    return object;
}

SCRAP.MAIN2.contentObject = function() {

    var root = new SCRAP.Element('div',
        {
            'style':
            {
                'opacity': 0
            }
        },
        null
    );

    var element =  new SCRAP.Element('div',
        {
            'className' : 'profile_content'
        }
        , root
    );

    var object = new THREE.CSS3DObject(root);
    object._width = 200;
    object._height = 25;

    object._setText = function( text ) {
        element.innerHTML = text;
    }

    return object;
}

SCRAP.MAIN2.profileBackground = function() {

    var root = new SCRAP.Element('div',
        {
            'style':
            {
                'opacity': 0
            }
        },
        null
    );

    var element =  new SCRAP.Element('div',
        {
            'className' : 'profile_back'
        }
        , root
    );

    var object = new THREE.CSS3DObject(root);
    object._width = 450;
    object._height = 800;

    object._setText = function( text ) {
        element.innerHTML = text;
    }

    return object;
}

SCRAP.MAIN2.profileView = function( userData ) {

    var group = new THREE.Group();

    group._init = function() {
        var picture = new SCRAP.MAIN2.pictureObject();
        group.add(picture);
        for(var i=0; i<3; i++) {
            var content = new SCRAP.MAIN2.contentObject();
            group.add(content);
            content._setText(userData[i]);
        }
        var back = new SCRAP.MAIN2.profileBackground();
        group.add(back);
        group._initPos();
    }

    group._initPos = function() {
        var picture = group.children[0];
        picture.position.set(picture._width / 2, picture._height / 2, 0);
        for(var i=0; i<3; i++) {
            var content = group.children[i+1]
            var newX = picture._width + content._width / 2 + 10;
            var newY = content._height / 2 + (content._height + 10) * i;
            content.position.set(newX, newY, 0);
        }
        var back = group.children[4];
        back.position.set(150 ,-200,-10);
    }

    group._start = function() {

        group._initPos();

        var picture = group.children[0];
        var targetX = picture.position.x;

        picture.position.x-=500;
        new TWEEN.Tween(picture.position)
            .to({x:targetX},500)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
        SCRAP.Fader.fadeIn(picture,500);
        for(var i=0; i<4; i++) {
            var content = group.children[i+1];
            var _targetX = content.position.x;
            content.position.x += 500;
            new TWEEN.Tween(content.position)
                .to({x:_targetX},500 + i * 100)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
            SCRAP.Fader.fadeIn(content, 500 + i * 100);
        }
    }

    group._exit = function() {
        var picture = group.children[0];
        var targetX = -500
        new TWEEN.Tween(picture.position)
            .to({x:targetX},500)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
        SCRAP.Fader.fadeOut(picture,500);
        for(var i=0; i<4; i++) {
            var content = group.children[i+1];
            var _targetX = 500
            new TWEEN.Tween(content.position)
                .to({x:_targetX},500 + i * 100)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
            SCRAP.Fader.fadeOut(content, 500 + i * 100);
        }
    }

    group._init();

    return group;

}

SCRAP.MAIN2.freindObject = function( flag ) {

    var root = new SCRAP.Element('div',
        {
            'style' : {
                'opacity' : 0
            }
        },
        null
    );

    if(flag) {
        var element = new SCRAP.Element('div',
            {
                'className': 'friend',
                'style': {
                    'backgroundColor': 'rgba(127,127,0,0.5)'
                },
                'innerHTML': "구독하기"
            }
            , root
        );
    } else {
        var element = new SCRAP.Element('div',
            {
                'className': 'friend',
                'style': {
                    'backgroundColor': 'rgba(0,127,0,0.5)'
                },
                'innerHTML': "구독중"
            }
            , root
        );
    }

    var object = new THREE.CSS3DObject(root);
    object._width = 150;
    object._height = 30;

    object._setText = function( text ) {
        object.element.innerHTML = text;
    }

    return object;

}

SCRAP.MAIN2.freindView = function() {

    var group = new THREE.Group();
    group._curFlag = true;
    group._rotating = false;

    group._init = function() {
        var friend = new SCRAP.MAIN2.freindObject(true);
        friend.position.z = 10;
        group.add(friend);
        var unfriend = new SCRAP.MAIN2.freindObject(false);
        group.add(unfriend);
        unfriend.position.z = -10;
        unfriend.rotation.y = Math.PI;
        group.position.z = -10;
    }

    group._start = function( flag ) {
        for(var i=0; i<group.children.length; i++)
            SCRAP.Fader.fadeIn(group.children[i], 500);
        if(!flag) {
            group._rotate();
        }
    }

    group._rotate = function() {
        if(group._rotating) return;
        group._rotating = true;
        new TWEEN.Tween(group.position)
            .to({z:0},500)
            .onComplete(function() {
                var target = 0;
                if(group._curFlag) target = Math.PI;
                new TWEEN.Tween(group.rotation)
                    .to({y:target},500)
                    .onComplete(function() {
                        new TWEEN.Tween(group.position)
                            .to({z:-10},500)
                            .onComplete(function() {
                                group._rotating = false;
                            })
                            .start();
                    })
                    .start();
            })
            .start();
    }

    group._exit = function() {
        for(var i=0; i<group.children.length; i++)
            SCRAP.Fader.fadeOut(group.children[i],500)
    }

    group._init();

    return group;
}

SCRAP.MAIN2.userView = function(x, y, z) {

    var group = new THREE.Group();

    group._myPos = new THREE.Vector3(x, y, z);
    group._userData = ["오늘도 즐겁게","1,233,543","hansolchoi"];
    group._words = [
        "브라보브라보",
        "브라보브라보",
        "브라보브라보",
        "브라보브라보",
        "브라보브라보",
        "브라보브라보",
        "브라보브라보",
        "브라보브라보",
        "브라보브라보",
        "브라보브라보"
    ];
    group._weights = [
        0.9,
        0.8,
        0.7,
        0.6,
        0.6,
        0.6,
        0.5,
        0.5,
        0.4,
        0.4
    ];
    group._friend = false;

    group._init = function() {
        group.position.z = -SCRAP._INF;

        var profile = new SCRAP.MAIN2.profileView(group._userData);
        group.add(profile);
        profile.position.set(-50,540,0);

        var friend = new SCRAP.MAIN2.freindView();
        group.add(friend);
        friend.position.set(0,670, 0);

        var keyword = new SCRAP.MAIN2.progressBarView(group._words, group._weights);
        group.add(keyword);
        keyword.position.set(65,0,0);
    }

    group._start = function() {
        group.position.z = group._myPos.z;

        group.children[0]._start();
        group.children[1]._start();
        group.children[2]._start(false);

        var curScene = SCRAP.DIRECTOR._sceneList["main2"];
        var targetPos = curScene.CSSScene.children[5].position;
        curScene._moveCamera(null, new THREE.Vector3(targetPos.x,cameraTarget.y,targetPos.z));
    }

    group._exit = function() {
        setTimeout(function() {group.position.z = -SCRAP._INF}, 300);
        for(var i=0; i<group.children.length; i++)
                group.children[i]._exit();
    }

    group.position.set(x, y, z);
    group.rotation.y = Math.PI / 4;

    group._init();

    return group;
}

