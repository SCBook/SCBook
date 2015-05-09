/**
 * Created by user on 2015-04-20.
 */

SCRAP.MENU.Scene = function() {

    var SceneManager = new Object();
    SceneManager.CSSScene;
    SceneManager.CSSRenderer;

    SceneManager._scroll = 0;
    SceneManager._curTime = getCurTime();

    SceneManager._camPosStack = [];
    SceneManager._camTgtPosStack = [];

    var camera = new THREE.PerspectiveCamera(45, width / height, 1, 15000);
    camera.position.set(0, 500, 3000);

    var cameraTarget = new THREE.Vector3(0,500,0);

    SceneManager._init = function() {

        SceneManager._setCamera();
        SceneManager._initScene();
        SceneManager._initObject();
        SceneManager._initListener();

        var container = document.getElementById("menuContainer");

        if(container == null) {
            container = document.createElement('div');
            container.id = "menuContainer";
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

    }

    SceneManager._initScene = function() {
        console.log()
        var width = window.innerWidth;
        var height = window.innerHeight;

        SceneManager.CSSRenderer = new THREE.CSS3DRenderer();
        SceneManager.CSSRenderer.setSize(width, height);
        SceneManager.CSSRenderer.domElement.style.position = 'absolute';
        SceneManager.CSSRenderer.domElement.style.top = '0px';
        SceneManager.CSSScene = new THREE.Scene();
        console.log(SceneManager.CSSScene.children.length);
        SceneManager.CSSScene.add(camera);
        console.log(SceneManager.CSSScene.children.length);

    }

    SceneManager._initObject = function() {
        SceneManager.CSSScene.add(new SCRAP.MENU.settingView(0, 350, 500));
        console.log(SceneManager.CSSScene.children.length);
    }

    SceneManager._initListener = function() {
        console.log(SceneManager.CSSScene.children.length);
        window.addEventListener("keypress", function hitEnterKey(e) {
            console.log(e.keyCode);
            if (e.keyCode == 113) {
                var curScene = SCRAP.DIRECTOR._sceneList["menu"];
                console.log(SceneManager.CSSScene.children.length);
                var curView = curScene.CSSScene.children[1];
                console.log(curScene);
                SCRAP.DIRECTOR._freezeScene();
                if (curView._enable) {
                    curView._exit();
                } else {
                    curView._start();
                }
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
        console.log("menu render");
        camera.lookAt(cameraTarget);

        SceneManager.CSSRenderer.render(SceneManager.CSSScene, camera);
    }

    function getCurTime() {
        var d = new Date();
        return d.getTime();
    }

    SceneManager._start = function( chain ) {

        console.log("start");

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
        camera.position.set(0, 500, 6500);
        cameraTarget.set(0,250,0);
    }

    return SceneManager;
}