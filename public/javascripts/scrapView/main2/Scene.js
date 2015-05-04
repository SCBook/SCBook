/**
 * Created by user on 2015-04-20.
 */

SCRAP.MAIN2.Scene = function() {

    var SceneManager = new Object();
    SceneManager.CSSScene;
    SceneManager.CSSRenderer;

    SceneManager._scroll = 0;
    SceneManager._curTime = getCurTime();

    SceneManager._camPosStack = [];
    SceneManager._camTgtPosStack = [];

    SceneManager._init = function() {

        SceneManager._setCamera();
        SceneManager._initScene();
        requestScrap(SCRAP.DIRECTOR._curuser, -1, 10);

    }

    SceneManager._postProc = function(rcvData, rcvKeyword, rcvPath, rcvUser, rcvIdx) {
        
        SceneManager._initObject();
        SceneManager._initListener();
        SceneManager.CSSScene.children[2]._setList(rcvData, rcvKeyword, rcvPath, rcvUser, rcvIdx, true);

        document.body.appendChild(SceneManager.CSSRenderer.domElement);
        window.addEventListener('resize', onWindowResize, true);

        function onWindowResize() {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            SceneManager.CSSRenderer.setSize(window.innerWidth, window.innerHeight);

            SceneManager._render();
        }
    }

    SceneManager._initScene = function() {

        var width = window.innerWidth;
        var height = window.innerHeight;

        SceneManager.CSSRenderer = new THREE.CSS3DRenderer();
        SceneManager.CSSRenderer.setSize(width, height);
        SceneManager.CSSRenderer.domElement.style.position = 'absolute';
        SceneManager.CSSRenderer.domElement.style.top = '0px';
        SceneManager.CSSScene = new THREE.Scene();
        SceneManager.CSSScene.add(camera);

    }

    SceneManager._initObject = function() {
        SceneManager.CSSScene.add(new SCRAP.MAIN2.FlipView(0, 0, 0, true));
        SceneManager.CSSScene.add(new SCRAP.MAIN2.circleView(500, 0, -100, true));
        SceneManager.CSSScene.add(new SCRAP.MAIN2.mainControlView(80, 0, 300, true));
        SceneManager.CSSScene.add(new SCRAP.MAIN2.commentView(700,50,500));
        SceneManager.CSSScene.add(new SCRAP.MAIN2.userView(-600,-30,400));

    }

    SceneManager._initListener = function() {

        var prevChild = SceneManager.CSSScene.children[1];
        var mainChild = SceneManager.CSSScene.children[2];

        for (var i = 0; i < prevChild.children.length; i++) {
            prevChild.children[i].element.addEventListener('mouseover', function (e) {
                prevChild._flip(e.target._idx);
            });
            prevChild.children[i].element.addEventListener('click', function (e) {
                mainChild._move(e.target._idx);
            });
        }

        var controlView = SceneManager.CSSScene.children[3];
        var commentBut = controlView.children[0];
        commentBut.element.addEventListener('click', function (e) {
            SceneManager.CSSScene.children[4]._start();
        });

        var controlView = SceneManager.CSSScene.children[3];
        var userBut = controlView.children[1];
        userBut.element.addEventListener('click', function (e) {
            SceneManager.CSSScene.children[5]._start();
        });

        var commentInput = SceneManager.CSSScene.children[4];
        console.log(commentInput.children[1]);
        commentInput.children[1].children[0].element.addEventListener("keypress", function hitEnterKey(e) {
            if (e.keyCode == 13) {
                var input = commentInput.children[1].children[0]._getInput();
                commentInput.children[1].children[0]._reset();

                var curScene = SCRAP.DIRECTOR._sceneList["main2"]
                var curView = curScene.CSSScene.children[2];
                var curIdx = curView._selec;
                var path = curView.children[curIdx]._path;

                sendComment(path,input,SCRAP.DIRECTOR._curuser);
            } else {
                e.keyCode == 0;
                return;
            }
        });
    }

    SceneManager.moveObject = function( event ) {
        if (!event) event = window.event;
        SceneManager._scroll += event.wheelDelta;
    }

    SceneManager._animate = function() {

        var curScene = SceneManager.CSSScene;

        requestAnimationFrame( SceneManager._animate);

        TWEEN.update();
        SCRAP.Fader.update();
        SCRAP.Resizer.update();

        var tempTime = getCurTime();
        if (tempTime - SceneManager._curTime > 100) {

            SceneManager._curTime = tempTime;
            if (SceneManager._scroll > 0) curScene.children[2]._forward(SceneManager._scroll / 120);
            else if (SceneManager._scroll < 0) curScene.children[2]._backward(-SceneManager._scroll / 120);
            SceneManager._scroll = 0;
        }

        SceneManager._render();
    }

    SceneManager._render = function() {

        camera.lookAt(cameraTarget);

        SceneManager.CSSRenderer.render(SceneManager.CSSScene, camera);
    }

    function getCurTime() {
        var d = new Date();
        return d.getTime();
    }

    SceneManager._start = function( chain ) {

        SceneManager._init();
        SceneManager._animate();

    }

    SceneManager._exit = function( chain ) {

    }

    SceneManager._setCamera = function() {
        camera.position.set(0, 500, 1250);
        cameraTarget.set(0,250,0);
    }

    SceneManager._moveCamera = function( newCamPos, newTgtPos, pop ) {
        if(!pop) SceneManager._camPosStack.push(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z));
        if(newCamPos!=null) {
            new TWEEN.Tween(camera.position)
                .to({x:newCamPos.x, y:newCamPos.y, z:newCamPos.z},1000)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
        }
        if(!pop) SceneManager._camTgtPosStack.push(new THREE.Vector3(cameraTarget.x, cameraTarget.y, cameraTarget.z));
        if(newTgtPos!=null) {
            console.log()
            new TWEEN.Tween(cameraTarget)
                .to({x:newTgtPos.x, y:newTgtPos.y, z:newTgtPos.z},1000)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
        }
    }

    SceneManager._moveCameraBack = function( ) {
        var newCamPos = SceneManager._camPosStack.pop();
        var newTgtPos = SceneManager._camTgtPosStack.pop();
        SceneManager._moveCamera(newCamPos, newTgtPos, true);
    }

    return SceneManager;
}