/**
 * Created by user on 2015-04-08.
 */


function checkID() {
    var curScene = SCRAP.DIRECTOR._sceneList["intro"];
    var group = curScene.CSSScene.children[1];
    var id = group._getId();

    if(id=="") {
        var alert = curScene.CSSScene.children[5];
        alert._alert("???");
        return;
    }
}

function requestJoin() {

    var curScene = SCRAP.DIRECTOR._sceneList["intro"];
    var group = curScene.CSSScene.children[1];
    var id = group._getId();
    var pw = group._getPw();
    var alert = curScene.CSSScene.children[5];

    if(id=="") {

        alert._alert("아이디를 입력하세요");
        return;
    }

    if(pw=="") {
        alert._alert("비밀번호를 입력하세요");
        return;
    }
curScene.CSSScene
    requestJoinAuth(id, pw);
}

function requestJoinAuth(id, pw)
{

    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            joinCallback(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET","./signup?username="+id+"&password="+pw,true);
    xmlhttp.send();
}

function joinCallback(res)
{

    var curScene = SCRAP.DIRECTOR._sceneList["intro"];
    var alert = curScene.CSSScene.children[5];
    alert._alert(res);

}

function sessionCheck() {
    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            sessionCallback(xmlhttp.responseText);
        }
    }
    xmlhttp.open("POST","./session-check",true);
    xmlhttp.send();
}

function sessionCallback(res) {
    console.log(res);
    var curScene = SCRAP.DIRECTOR._sceneList["intro"];
    var _res = JSON.parse(res);
    console.log(_res.user);
    if(_res.response=="session-ok") {
        SCRAP.DIRECTOR._curuser = _res.data.username;
        SCRAP.DIRECTOR._sceneTransition("main2");
    }
}

function requestLogin() {

    var curScene = SCRAP.DIRECTOR._sceneList["intro"];
    var group = curScene.CSSScene.children[1];
    var id = group._getId();
    var pw = group._getPw();
    var alert = curScene.CSSScene.children[5];

    if(id=="") {
        alert._alert("아이디를 입력하세요");
        return;
    }

    if(pw=="") {
        alert._alert("비밀번호를 입력하세요");
        return;
    }

    requestAuth(id, pw);
}

function requestAuth(id, pw) {

    var curScene = SCRAP.DIRECTOR._sceneList["intro"];
    var group = curScene.CSSScene.children[3];
    group._start();

    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            loginCallback(xmlhttp.responseText);
        }
    }
    xmlhttp.open("POST","./login-view?username="+id+"&password="+pw,true);
    xmlhttp.send();
}

function loginCallback( res ) {

    console.log(res);

    var jsonObj = JSON.parse(res);

    var curScene = SCRAP.DIRECTOR._sceneList["intro"];
    var group = curScene.CSSScene.children[3];
    group._exit();
    if(jsonObj.response=="login-success"){
        var l_group = curScene.CSSScene.children[1];
        var b_group = curScene.CSSScene.children[2];
        l_group._exit();
        b_group._exit();
        SCRAP.DIRECTOR._curuser = jsonObj.user.username;
        SCRAP.DIRECTOR._sceneTransition("main2");
        return;
    }
    var alert = curScene.CSSScene.children[5];
    alert._alert(jsonObj.response);
}