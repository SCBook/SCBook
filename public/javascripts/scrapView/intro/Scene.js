    /**
    * Created by user on 2015-04-03.
    */

    SCRAP.INTRO.Scene = function() {

        var SceneManager = new Object();
        SceneManager.CSSScene;
        SceneManager.CSSRenderer;

        SceneManager._freezeFlag = false;

        /*
         CSSScene.children
         0 - camera
         1 - loginView
         2 - 1st menu list
         3 - loadingView
         4 - GuideView
         5 - AlertView
         6 - 2nd menu list
         */

        SceneManager._freeze = function() {

        }

        SceneManager._preProc = function() {

            sessionCheck();
        }

        SceneManager._init = function() {

            SCRAP.DIRECTOR._setMsg("회원가입은 무료입니다.");

            if(SCRAP.DIRECTOR.curuser == null) {
                SceneManager._preProc();
            }

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

            SceneManager.CSSScene.add(new SCRAP.INTRO.loginView(0, 0, 0, true));
            SceneManager.CSSScene.add(new SCRAP.INTRO.IntroControlView(0, 0, 30, true));
            SceneManager.CSSScene.add(new SCRAP.INTRO.LoadingView(0, 0, 10, true));
            SceneManager.CSSScene.add(new SCRAP.INTRO.detailInputView(210, 300, 0, true));
            SceneManager.CSSScene.add(new SCRAP.INTRO.AlertView(0, 0, 20, true));
            SceneManager.CSSScene.add(new SCRAP.INTRO.IntroJoinView(0, 0, 30, true));

        }

        SceneManager._toLoginView = function() {

            var l_group = SceneManager.CSSScene.children[1];
            var b_group = SceneManager.CSSScene.children[2];
            var j_group = SceneManager.CSSScene.children[4];
            var nb_group = SceneManager.CSSScene.children[6];

            l_group._reset();
            nb_group._exit();
            b_group._start();
            j_group._exit(l_group._action['signIn']());

        }


        SceneManager._initListener = function() {

            function toJoinView() {
                var l_group = SceneManager.CSSScene.children[1];
                var b_group = SceneManager.CSSScene.children[2];
                var j_group = SceneManager.CSSScene.children[4];
                var nb_group = SceneManager.CSSScene.children[6];

                b_group._exit();
                l_group._reset();
                l_group._action['signUp'](j_group._start);
                nb_group._start();
            }

            function toLoginView() {
                var l_group = SceneManager.CSSScene.children[1];
                var b_group = SceneManager.CSSScene.children[2];
                var j_group = SceneManager.CSSScene.children[4];
                var nb_group = SceneManager.CSSScene.children[6];

                l_group._reset();
                nb_group._exit();
                b_group._start();
                j_group._exit(l_group._action['signIn']());
            }

            function moveObject(event) {
                console.log("wheel!!");
                if (!event) event = window.event;
                var view =  SceneManager.CSSScene.children[4];
                if (event.wheelDelta > 0) {
                    view._rotateUp();
                } else {
                    view._rotateDown();
                }
            }

            var loginView = SceneManager.CSSScene.children[1];
            var loginElement = loginView.children[0].element;
            console.log(loginView);
            loginElement.addEventListener("keypress", function hitEnterKey(e) {
                if (e.keyCode == 13) {
                    if(loginView._status == "login") requestLogin();
                    else requestJoin();
                } else {
                    e.keyCode == 0;
                    return;
                }
            });

            var loginBut = SceneManager.CSSScene.children[2].children[0].element;
            loginBut.addEventListener('click', requestLogin);

            var toJoin = SceneManager.CSSScene.children[2].children[1].element;
            toJoin.addEventListener('click', toJoinView);

            var joinBut = SceneManager.CSSScene.children[6].children[0].element;
            joinBut.addEventListener('click', requestJoin);

            var toLogin = SceneManager.CSSScene.children[6].children[1].element;
            toLogin.addEventListener('click', toLoginView);

            var child = SceneManager.CSSScene.children[4];
            for (var i = 0; i < child.children.length; i++) {
                child.children[i].element.addEventListener('wheel', moveObject);
            }

        }

        SceneManager._animate = function() {

            requestAnimationFrame(SceneManager._animate);

            TWEEN.update();
            SCRAP.Fader.update();

            SceneManager._render();

        }

        SceneManager._render = function() {

            camera.lookAt(cameraTarget);

            SceneManager.CSSRenderer.render(SceneManager.CSSScene, camera);
        }

        SceneManager._start = function( chain ) {

            SceneManager._init();
            SceneManager._animate();

            var login = SceneManager.CSSScene.children[1];
            var menu = SceneManager.CSSScene.children[2];

            login._start();
            menu._start();

        }

        SceneManager._exit = function( chain ) {

            SceneManager.CSSRenderer.domElement.remove();

            for(var i=1; i<3; i++) {
                var child = SceneManager.CSSScene.children[i];
                child._exit();
            }
            console.log(arguments);
            if(arguments[1]!=null) chain(arguments[1]);
            else chain();

        }

        SceneManager._setCamera = function() {
            camera.position.set(0, 500, 1250);
            cameraTarget.set(0,250,0);
        }

        return SceneManager;
    }