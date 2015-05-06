/**
 * Created by user on 2015-04-29.
 */

SCRAP._initDirector = function()
{
    var director = new Object();
    director._curuser=null;
    director._curScene = null;
    director._sceneList = [];

    director._init = function() {

        var keys = Object.keys(director._sceneList);

        director._sceneTransition( "intro" );

    }

    director._addScene = function(scene, tag) {
        if(Object.keys(director._sceneList).indexOf(tag)==-1) {
            director._sceneList[tag] = scene;
            return true;
        }
        else {
            console.log("already has same tag Scene!");
            return false;
        }
    }

    director._deleteSceneByTag = function(tag) {
        if(Object.keys(director._sceneList).indexOf(tag)==-1) {
            console.log("there is no such tag");
            return false;
        }
        else {
            delete director._sceneList[tag];
            return true;
        }
    }

    director._getCurScene = function() {

        return director._curScene;

    }

    director._sceneTransition = function( to ) {

        console.log("scene change to : " + to);

        var exitScene = director._curScene;
        var startScene = director._sceneList[to];

        if(startScene == null) return;
        else if(exitScene == null) {
            startScene._start();
        }
        else {
            console.log("startScene");
            console.log(startScene);
            exitScene._exit( startScene._start );
        }

        director._curScene = startScene;

    }

    return director;

}

SCRAP.DIRECTOR = new SCRAP._initDirector();

SCRAP._initScene = function() {

    SCRAP.DIRECTOR._addScene(new SCRAP.INTRO.Scene(),"intro");
    SCRAP.DIRECTOR._addScene(new SCRAP.LOBBY.Scene(),"lobby");
    SCRAP.DIRECTOR._addScene(new SCRAP.MAIN1.Scene(),"main");
    SCRAP.DIRECTOR._addScene(new SCRAP.MAIN2.Scene(),"main2");

    SCRAP.DIRECTOR._init();

}
SCRAP._initScene();