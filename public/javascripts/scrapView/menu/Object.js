/**
 * Created by redball on 15. 5. 9.
 */

SCRAP.MENU = { REVISION : 1 };

SCRAP.MENU.settingView = function(x, y, z) {

    var group = new THREE.Group();
    group._myPos = new THREE.Vector3(x, y, z);
    group._enable = false;

    group._eventTime = 0;

    group._init = function() {

        group.position.z = SCRAP._INF;

        var back = new SCRAP.MAIN2.blockObject();
        group.add(back);

        var msg = new SCRAP.MAIN2.msgObject();
        msg.position.z = 10;
        group.add(msg);

        var yesBut = new SCRAP.MAIN2._ButtonObject("네");
        yesBut.position.x = -100;
        yesBut.position.y = -100;
        yesBut.position.z = 10;
        yesBut.element.addEventListener("click",function eventHandler(e) {
            requestSignOut();
        })
        group.add(yesBut);

        var noBut = new SCRAP.MAIN2._ButtonObject("아니오");
        noBut.position.x = 100;
        noBut.position.y = -100;
        noBut.position.z = 10;
        group.add(noBut);

    }

    group._start = function() {
        var d = new Date();
        var n = d.getTime();
        if( Math.abs(group._eventTime - n) < 600 ) return;
        group._eventTime = n;
        console.log("start");
        group._enable = true;
        /*
        var camPos = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
        var camtarPos = new THREE.Vector3(cameraTarget.x, cameraTarget.y, cameraTarget.z);

        var diffPos = new THREE.Vector3(camPos.x, - camtarPos.x, camPos.y - camtarPos.y, camPos.z - camtarPos.z);
        console.log(diffPos);
        var ratioDiffPos = diffPos.multiplyScalar(0.9);
        console.log(ratioDiffPos);
        var newPos = new THREE.Vector3(camtarPos.x + ratioDiffPos.x, camtarPos.y, camtarPos.z + ratioDiffPos.z);
        */
        group.position.set(500, 500, 6000);
        group.lookAt(new THREE.Vector3(0,500,7000));

        for(var i=0; i<group.children.length; i++){
            SCRAP.Fader.fadeIn(group.children[i],500);
        }
    }

    group._exit = function() {
        var d = new Date();
        var n = d.getTime();
        if( Math.abs(group._eventTime - n) < 500 ) return;
        group._eventTime = n;
        console.log("end");
        group._enable = false;
        setTimeout(function() {group.position.z = SCRAP._INF;}, 500);
        for(var i=0; i<group.children.length; i++){
            SCRAP.Fader.fadeOut(group.children[i],600);
        }
    }

    group.position.set(x, y , z);

    group._init();

    return group;

}
