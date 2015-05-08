/**
 * Created by redball on 15. 5. 6.
 */

SCRAP.LOBBY.Scene = function() {

    var SceneManager = new Object();
    SceneManager.CSSScene;
    SceneManager.CSSRenderer;
    SceneManager._scroll = 0;
    SceneManager._curTime = getCurTime();

    var freeze = true;

    SceneManager._init = function() {

        SceneManager._setCamera();
        SceneManager._initScene();
        SceneManager._initObject();
        SceneManager._initListener();

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
        var user = [];
        var weight = [];
        for(var i=0; i<500; i++){
            user.push(new Object());
            weight.push(Math.random() * 1500);
        }
        SceneManager.CSSScene.add(new SCRAP.LOBBY.galaxyView(user, weight));
    }

    SceneManager._galaxyTog = function() {
        //freeze = !freeze;
    }

    SceneManager._initListener = function() {

        window.addEventListener("keypress", function hitEnterKey(e) {
            console.log(e.keyCode);
            if (e.keyCode == 32) {
                SceneManager._galaxyTog();
            } else if(e.keyCode == 49){
                SceneManager.CSSScene.children[1]._transformation("wormHole");
            } else if(e.keyCode == 50) {
                SceneManager.CSSScene.children[1]._transformation("spinner");
            } else if(e.keyCode == 51) {
                SceneManager.CSSScene.children[1]._transformation("sphere");
            }
            else {
                e.keyCode == 0;
                return;
            }
        });

        window.addEventListener("wheel", SceneManager.moveObject);

    }

    SceneManager._animate = function() {

        var curScene = SceneManager.CSSScene;

        requestAnimationFrame( SceneManager._animate);

        TWEEN.update();
        SCRAP.Fader.update();
        SCRAP.Resizer.update();

        if( !freeze ) {
            curScene.children[1]._update();
        }

        var tempTime = getCurTime();
        if (tempTime - SceneManager._curTime > 50) {
            SceneManager._curTime = tempTime;
            if (SceneManager._scroll > 0) SceneManager.zoomEffect( SceneManager._scroll / 120 );
            else if (SceneManager._scroll < 0) SceneManager.zoomEffect( SceneManager._scroll / 120 );
            SceneManager._scroll = 0;
        }

        SceneManager._render();

    }

    SceneManager.zoomEffect = function( cnt ) {

        var delta = 100 * cnt;

        new TWEEN.Tween(camera.position)
            .to({z:camera.position.z + delta},1000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

    }

    SceneManager.moveObject = function( event ) {
        console.log("wheel event");
        if (!event) event = window.event;
        SceneManager._scroll += event.wheelDelta;
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

        setTimeout(chain, 500);
    }

    SceneManager._setCamera = function() {
        camera.position.set(0, 0, 1500);
        cameraTarget.set(0,0,0);
    }



    return SceneManager;
}