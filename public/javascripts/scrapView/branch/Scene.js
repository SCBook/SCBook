/**
 * Created by user on 2015-04-20.
 */

SCRAP.BRANCH.Scene = function() {

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

        SceneManager._initObject();
        SceneManager._initListener();

        var container = document.getElementById("sceneContainer");

        if(container == null) {
            container = document.createElement('div');
            container.id = "sceneContainer";
            document.body.appendChild(container);
        }

        if(container.children.length > 0) {
            var len = container.children.length;
            for( var i=0; i<len; i++) {
                var temp = container.children[0];
                temp.remove();
            }
        }
        container.appendChild( SceneManager.CSSRenderer.domElement );

        window.addEventListener('resize', onWindowResize, true);

        function onWindowResize() {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            SceneManager.CSSRenderer.setSize(window.innerWidth, window.innerHeight);

            SceneManager._render();
        }

        requestScrapImagePreviewAll(SCRAP.DIRECTOR._curuser, -1, SCRAP._INF, true);
        requestScrapImagePreviewFriend(SCRAP.DIRECTOR._curuser, -1, SCRAP._INF, true);
        requestScrapImagePreview(SCRAP.DIRECTOR._curuser, -1, SCRAP._INF, true);
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
        SceneManager.CSSScene.add(new SCRAP.BRANCH.FlipViewList(0,0,0,0,15));
        SceneManager.CSSScene.add(new SCRAP.BRANCH.FlipViewList(-400, 0, 0, 0, 15));
        SceneManager.CSSScene.add(new SCRAP.BRANCH.FlipViewList(400, 0, 0, 0, 15));
        SceneManager.CSSScene.add(new SCRAP.BRANCH.IntroControlView(0, 0, 0));
        SceneManager.CSSScene.add(new SCRAP.BRANCH.circleView(500, 0, -100, true));
        SceneManager.CSSScene.add(new SCRAP.BRANCH.mainControlView(80, 0, 300, true));
        SceneManager.CSSScene.add(new SCRAP.BRANCH.commentView(700,50,500));
        SceneManager.CSSScene.add(new SCRAP.BRANCH.userView(-600,-30,400));
        SceneManager.CSSScene.add(new SCRAP.BRANCH.scrapCntListView());
        SceneManager.CSSScene.add(new SCRAP.BRANCH.welcomeView());
    }

    SceneManager._initListener = function() {
        var controlView = SceneManager.CSSScene.children[6];
        var commentBut = controlView.children[0];
        commentBut.element.addEventListener('click', function (e) {
            SceneManager.CSSScene.children[7]._start();
        });

        var controlView = SceneManager.CSSScene.children[6];
        var userBut = controlView.children[1];
        userBut.element.addEventListener('click', function (e) {
            var curView = SceneManager.CSSScene.children[5];
            var username = curView.children[curView._selec]._user;
            SceneManager.CSSScene.children[8]._start(username);
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

        for(var i=1; i<SceneManager.CSSScene.children.length; i++) {
            console.log(i);
            SceneManager.CSSScene.children[i]._exit();
        }

        setTimeout(chain, 500);
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