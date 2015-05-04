/**
 * Created by user on 2015-04-03.
 */
var camera, cameraTarget;
var width, height;

var SCRAP = { REVISION : 1 };

SCRAP._INF = 10000;

SCRAP._initiate = function() {

    width = window.innerWidth;
    height = window.innerHeight;

    camera = new THREE.PerspectiveCamera(45, width / height, 1, 15000);
    camera.position.set(0, 500, 3000);

    cameraTarget = new THREE.Vector3(0,500,0);

}
SCRAP._initiate();

SCRAP.Scene = function()
{
    var groupList = [];
    var onInit;
    var onExit;

    this.init = function() {

    }

    this.addGroup = function(group, tag) {
        if(Object.keys(groupList).indexOf(tag)==-1) {
            groupList[tag] = group;
            return true;
        }
        else {
            alert("already has same tag Scene!");
            return false;
        }
    }

    this.deleteSceneByTag = function(tag) {
        if(Object.keys(groupList).indexOf(tag)==-1) {
            alert("there is no such tag");
            return false;
        }
        else {
            delete groupList[tag];
            return true;
        }
    }
};

SCRAP.Clone = function(src, createF) {
    var dest = new createF();

    dest['element'].innerHTML = src['element'].innerHTML;

    return dest;
}

SCRAP.Element = function (tag, option, parent) {

    function fillOption(element, option) {
        var keys = Object.keys(option);

        for(var i in  keys) {
            if(typeof option[keys[i]] == "object")
                fillOption(element[keys[i]], option[keys[i]]);

            element[keys[i]] = option[keys[i]];
        }
    }

    var element = document.createElement(tag);

    fillOption(element, option);

    if(parent!=null) parent.appendChild(element);

    return element;
}

SCRAP.FadeObject = function(type, object, duration) {
    var fObject = new Object();
    fObject._type = type;
    fObject._object = object;
    fObject._elapsed = 0;
    fObject._duration = duration
    fObject.update = function(deltaTime) {
        fObject._elapsed += deltaTime;
        if(fObject._elapsed > fObject._duration) {
            if(type=='in') {
                fObject._object.element.style.opacity = 1;
            } else {
                fObject._object.element.style.opacity = 0;
            }
            return true;
        }
        if(type=='in') {
            fObject._object.element.style.opacity = fObject._elapsed / fObject._duration;
        } else {
            fObject._object.element.style.opacity = 1 - (fObject._elapsed / fObject._duration);
        }
        return false;
    }
    return fObject;
}

SCRAP.FaderCreate = function() {
    var Fader = new Object();
    Fader.group = [];
    var d = new Date();
    var n = d.getTime();
    Fader.curTime = n;
    Fader.fadeIn = function(object, duration) {
        var fObj = new SCRAP.FadeObject('in',object,duration);
        Fader.group.push(fObj);
    }
    Fader.fadeOut = function(object, duration) {
        var fObj = new SCRAP.FadeObject('out',object,duration);
        this.group.push(fObj);
    }
    Fader.update = function() {
        var d = new Date();
        var n = d.getTime();
        var deltaTime = n - this.curTime;
        Fader.curTime = n;
        for(var i=0; i<Fader.group.length; i++) {
            var fObj = Fader.group[i];
            var res = fObj.update(deltaTime);
            if(res) Fader.group.splice(i,1);
        }
    }
    return Fader;
}
SCRAP.Fader = new SCRAP.FaderCreate();

SCRAP.ResizeObject = function(object, from, to, duration) {
    var fObject = new Object();
    fObject._to = to;
    fObject._from = from;
    fObject._object = object;
    fObject._elapsed = 0;
    fObject._duration = duration
    fObject._object.position.x = -Math.abs(to - from) / 2;
    fObject.update = function(deltaTime) {
        fObject._elapsed += deltaTime;
        if(fObject._elapsed > fObject._duration) {
            fObject._object.element.style.width = to + "px";
            return true;
        }
        var diff = fObject._to - fObject._from;
        fObject._object.position.x = ((-0.5*fObject._object._width) + Math.abs(diff * (fObject._elapsed / fObject._duration))) * 0.5;
        fObject._object.element.style.width = fObject._from + ( diff * (fObject._elapsed / fObject._duration))  + "px";
        return false;
    }
    return fObject;
}

SCRAP.ResizerCreate = function() {
    var Resizer = new Object();
    Resizer.group = [];
    var d = new Date();
    var n = d.getTime();
    Resizer.curTime = n;
    Resizer._resizeObj = function(object, from, to, duration) {
        var fObj = new SCRAP.ResizeObject(object, from, to, duration);
        Resizer.group.push(fObj);
    }
    Resizer.update = function() {
        var d = new Date();
        var n = d.getTime();
        var deltaTime = n - Resizer.curTime;
        Resizer.curTime = n;
        for(var i=0; i<Resizer.group.length; i++) {
            var fObj = Resizer.group[i];
            var res = fObj.update(deltaTime);
            if(res) Resizer.group.splice(i,1);
        }
    }
    return Resizer;
}
SCRAP.Resizer = new SCRAP.ResizerCreate();


