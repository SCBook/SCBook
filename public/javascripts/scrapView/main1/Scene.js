/**
 * Created by user on 2015-04-17.
 */
    SCRAP.MAIN1.Scene = function() {

        var SceneManager = new Object();
        SceneManager.GLScene;
        SceneManager.GLRenderer;

        var words, weights;

        SceneManager._init = function() {

            SceneManager._setCamera();
            SceneManager._initScene();
            SceneManager._initWordList();

            document.body.appendChild(SceneManager.GLRenderer.domElement);
            window.addEventListener('resize', onWindowResize, true);

            function onWindowResize() {

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                SceneManager.GLRenderer.setSize(window.innerWidth, window.innerHeight);

                SceneManager._render();
            }

        }

        SceneManager._initScene = function() {

            var width = window.innerWidth;
            var height = window.innerHeight;

            SceneManager.GLRenderer = new THREE.WebGLRenderer({ antialias : false });
            SceneManager.GLRenderer.setSize(width, height);
            SceneManager.GLRenderer.domElement.style.position = 'absolute';
            SceneManager.GLRenderer.domElement.style.top = '0px';

            SceneManager.GLScene = new THREE.Scene();
            SceneManager.GLScene.add(camera);

        }

        SceneManager._initWordList = function() {
            requestKeywords( "hansolchoi", words, weights );
        }

        SceneManager._initObject = function( _words, _weights ) {
            words = _words;
            weights = _weights;
            SceneManager.GLScene.add(new SCRAP.MAIN1.WordCloud(0,0,0, words, weights));
            SceneManager.GLScene.add(new SCRAP.MAIN1.DirLightObject());

            SceneManager.GLScene.children[1]._init();
        }

        SceneManager._animate = function() {

            requestAnimationFrame(SceneManager._animate);

            TWEEN.update();

            if(SceneManager.GLScene.children[1]!=null) SceneManager.GLScene.children[1]._update();

            SceneManager._render();
        }

        SceneManager._render = function() {

            camera.lookAt(cameraTarget);

            SceneManager.GLRenderer.render(SceneManager.GLScene, camera);

        }

        SceneManager._start = function() {

            console.log("main start");

            SceneManager._init();
            SceneManager._animate();

        }

        SceneManager._setCamera = function() {
            camera.position.set(0, 1000, 3500);
            cameraTarget.set(0,500,0);
        }

        return SceneManager;

    }

