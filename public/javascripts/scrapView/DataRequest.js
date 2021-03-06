/**
 * Created by user on 2015-04-29.
 */

/** 수신부 **/

// 사용자의 키워드를 받아오는 함수
function requestKeywords ( username ) {

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
            console.log(xmlhttp.responseText);
            var jsonRes = JSON.parse(xmlhttp.responseText);
            var _words = [];
            var _weights = [];
            for (var i=0; i<jsonRes.length; i++) {
                _words.push(jsonRes[i].keyword_name);
                _weights.push(jsonRes[i].keyword_weight);
            }

            SCRAP.DIRECTOR._curScene._initObject(_words, _weights);
        }
    }
    xmlhttp.open("POST","./word-cloud?username="+username,true);
    xmlhttp.send();

}

// 사용자와 관계를 가지는 사용자들의 리스트 받아오는 함수 ( 사용자 필터, 시간 필터 )

// 스크랩 데이터를 요약문 받아오는 함수 ( 사용자 필터, 키워드 필터, 시간 필터 )

// 스크랩 데이터 원문을 받아오는 함수
function requestScrap ( username, start, end, type) {
    console.log("requestScrap");
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
            var curScene = SCRAP.DIRECTOR._sceneList["main2"];
            var child = curScene.CSSScene.children[2];
            console.log(xmlhttp.responseText);
            var jsonObj = JSON.parse(xmlhttp.responseText);
            // scrap_arr.push({scrap_data :data, keyword1 : scrap.keyword1, keyword2 : scrap.keyword2,
            //keyword3 : scrap.keyword3, path:scrap.path, index:i}/*data*/);
            var rcvData = [];
            var rcvKeyword = [];
            var rcvPath = [];
            var rcvUser = [];
            var rcvIdx = [];
            for(var i=0; i<jsonObj.length; i++){
                rcvData.push(jsonObj[i].scrap_data);
                var keywordSet = [];
                for(var j=1; j<=3; j++) {
                    var name = "keyword"+j;
                    keywordSet.push(jsonObj[i][name]);
                }
                rcvKeyword.push(keywordSet);
                rcvPath.push(jsonObj[i].path);
                rcvUser.push(jsonObj[i].username);
                rcvIdx.push(jsonObj[i].index);
            }
            if(start < 0) curScene._postProc(rcvData, rcvKeyword, rcvPath, rcvUser, rcvIdx);
            else if(type=="old") curScene.CSSScene.children[2]._setList(rcvData, rcvKeyword, rcvPath, rcvUser, rcvIdx, true);
            else curScene.CSSScene.children[2]._setList(rcvData, rcvKeyword, rcvPath, rcvUser, rcvIdx, false);
        }
        else {
            console.log("no recived");
        }
    }
    xmlhttp.open("POST","./scrap-view?username="+username+"&start="+start+"&end="+end,true);
    xmlhttp.send();

}

function requestScrapImage ( username, start, end, type) {
    console.log("requestScrapImage");
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
            var curScene = SCRAP.DIRECTOR._sceneList["branch"];
            var child = curScene.CSSScene.children[2];
            console.log(xmlhttp.responseText);
            var jsonObj = JSON.parse(xmlhttp.responseText);
            // scrap_arr.push({scrap_data :data, keyword1 : scrap.keyword1, keyword2 : scrap.keyword2,
            //keyword3 : scrap.keyword3, path:scrap.path, index:i}/*data*/);
            var rcvData = [];
            var rcvKeyword = [];
            var rcvPath = [];
            var rcvUser = [];
            var rcvIdx = [];
            for(var i=0; i<jsonObj.length; i++){
                rcvData.push(jsonObj[i].scrap_data);
                var keywordSet = [];
                for(var j=1; j<=3; j++) {
                    var name = "keyword"+j;
                    keywordSet.push(jsonObj[i][name]);
                }
                rcvKeyword.push(keywordSet);
                rcvPath.push(jsonObj[i].path);
                rcvUser.push(jsonObj[i].username);
                rcvIdx.push(jsonObj[i].index);
            }
            //if(start < 0) curScene._postProc(rcvData, rcvKeyword, rcvPath, rcvUser, rcvIdx);
            if(type=="old") curScene.CSSScene.children[5]._setList(rcvData, rcvKeyword, rcvPath, rcvUser, rcvIdx, true);
            else curScene.CSSScene.children[5]._setList(rcvData, rcvKeyword, rcvPath, rcvUser, rcvIdx, false);
        }
        else {
            console.log("no recived");
        }
    }
    xmlhttp.open("POST","./Scrap?command=screenshot-read&username="+username+"&start="+start+"&end="+end,true);
    xmlhttp.send();
}


function requestScrapImageAll ( username, start, end, type) {
    console.log("requestScrapImage");
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
            var curScene = SCRAP.DIRECTOR._sceneList["branch"];
            var child = curScene.CSSScene.children[2];
            console.log(xmlhttp.responseText);
            var jsonObj = JSON.parse(xmlhttp.responseText);
            // scrap_arr.push({scrap_data :data, keyword1 : scrap.keyword1, keyword2 : scrap.keyword2,
            //keyword3 : scrap.keyword3, path:scrap.path, index:i}/*data*/);
            var rcvData = [];
            var rcvKeyword = [];
            var rcvPath = [];
            var rcvUser = [];
            var rcvIdx = [];
            for(var i=0; i<jsonObj.length; i++){
                rcvData.push(jsonObj[i].scrap_data);
                var keywordSet = [];
                for(var j=1; j<=3; j++) {
                    var name = "keyword"+j;
                    keywordSet.push(jsonObj[i][name]);
                }
                rcvKeyword.push(keywordSet);
                rcvPath.push(jsonObj[i].path);
                rcvUser.push(jsonObj[i].username);
                rcvIdx.push(jsonObj[i].index);
            }
            //if(start < 0) curScene._postProc(rcvData, rcvKeyword, rcvPath, rcvUser, rcvIdx);
            if(type=="old") curScene.CSSScene.children[5]._setList(rcvData, rcvKeyword, rcvPath, rcvUser, rcvIdx, true);
            else curScene.CSSScene.children[5]._setList(rcvData, rcvKeyword, rcvPath, rcvUser, rcvIdx, false);
        }
        else {
            console.log("no recived");
        }
    }
    xmlhttp.open("POST","./Scrap?command=screenshot-read&username="+username+"&start="+start+"&end="+end,true);
    xmlhttp.send();
}


function requestScrapImageFriend ( username, start, end, type) {
    console.log("requestScrapImage");
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
            var curScene = SCRAP.DIRECTOR._sceneList["branch"];
            var child = curScene.CSSScene.children[2];
            console.log(xmlhttp.responseText);
            var jsonObj = JSON.parse(xmlhttp.responseText);
            // scrap_arr.push({scrap_data :data, keyword1 : scrap.keyword1, keyword2 : scrap.keyword2,
            //keyword3 : scrap.keyword3, path:scrap.path, index:i}/*data*/);
            var rcvData = [];
            var rcvKeyword = [];
            var rcvPath = [];
            var rcvUser = [];
            var rcvIdx = [];
            for(var i=0; i<jsonObj.length; i++){
                rcvData.push(jsonObj[i].scrap_data);
                var keywordSet = [];
                for(var j=1; j<=3; j++) {
                    var name = "keyword"+j;
                    keywordSet.push(jsonObj[i][name]);
                }
                rcvKeyword.push(keywordSet);
                rcvPath.push(jsonObj[i].path);
                rcvUser.push(jsonObj[i].username);
                rcvIdx.push(jsonObj[i].index);
            }
            //if(start < 0) curScene._postProc(rcvData, rcvKeyword, rcvPath, rcvUser, rcvIdx);
            if(type=="old") curScene.CSSScene.children[5]._setList(rcvData, rcvKeyword, rcvPath, rcvUser, rcvIdx, true);
            else curScene.CSSScene.children[5]._setList(rcvData, rcvKeyword, rcvPath, rcvUser, rcvIdx, false);
        }
        else {
            console.log("no recived");
        }
    }
    xmlhttp.open("POST","./Scrap?command=screenshot-read&username="+username+"&start="+start+"&end="+end,true);
    xmlhttp.send();
}
// 스크랩 데이터 댓글을 받아오는 함수
function requestComment ( path, number ) {
    console.log("requestComment");
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
            console.log("rcved!!!");
            console.log(xmlhttp.responseText);
            var jsonObj = JSON.parse(xmlhttp.responseText);
            var resArr = [];
            for (var i=0; i<jsonObj.length; i++){
                var curContent = {
                    "post_name" : jsonObj[i].post_name,
                    "contents" :jsonObj[i].contents
                };
                resArr.push(curContent);
            }
            var curScene = SCRAP.DIRECTOR._sceneList["branch"].CSSScene;
            var child = curScene.children[7].children[0];
            child._add(resArr);
        }
    }
    xmlhttp.open("POST","./Comment?command=read&path="+path+"&number="+number,true);
    xmlhttp.send();

}

/** 송신부 **/

// 스크랩 데이터에 댓글을 다는 기능
function sendComment ( path, data, username ) {
    console.log("sendComment : " + data);
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
            console.log("rcved!!!");
            console.log(xmlhttp.responseText);
            var curScene = SCRAP.DIRECTOR._sceneList["branch"].CSSScene;
            var child = curScene.children[7].children[0];
            child._start();
        }
    }
    xmlhttp.open("POST","./Comment?command=create&path="+path+"&data="+data+"&username="+username,true);
    xmlhttp.send();

}

// 스크랩 데이터를 스크랩하는 기능

// 스크랩 데이터의 사용자를 팔로우 하는 기능

function requestFriend( username, myName, callback) {
    setTimeout(callback, 300);
}


function requestUnfriend( username, myName, callback) {
    setTimeout(callback, 300);
}

function requestUser( username, curUser ) {

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
            console.log("rcved!!!");
            var jsonObj = JSON.parse(xmlhttp.responseText);
            var userData = {
                "comment" : jsonObj.comment,
                "scraps" : jsonObj.scraps,
                "user" : jsonObj.username
            }
            requestKeyword(username, userData, jsonObj.friend);
        }
    }
    console.log(username);
    console.log(curUser);
    xmlhttp.open("POST","./User?command=read&username="+username+"&curUser="+curUser,true);
    xmlhttp.send();

    // username, scraps, comment, - userData
    // words, weight( 0 ~ 1 )
    // flag ( username, reader )
}


function requestKeyword( username, userData, flag ) {

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
            var jsonObj = JSON.parse(xmlhttp.responseText);
            var words = [];
            var weights = [];
            var len = (jsonObj.length < 10)?    jsonObj.length : 10;
            for(var i=0; i<len; i++) {
                words.push(jsonObj[i].keyword_name);
                weights.push(jsonObj[i].weight);
            }
            var curScene = SCRAP.DIRECTOR._sceneList["branch"].CSSScene;
            var child = curScene.children[8];
            child._afterStart(userData, words, weights, flag);
        }
    }
    xmlhttp.open("POST","./Keyword?command=read&username="+username,true);
    xmlhttp.send();

}

function requestScrapImagePreviewAll( username, start, end, type ) {
    console.log("requestScrapImage");
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
            var curScene = SCRAP.DIRECTOR._sceneList["branch"];
            var jsonObj = JSON.parse(xmlhttp.responseText);
            // scrap_arr.push({scrap_data :data, keyword1 : scrap.keyword1, keyword2 : scrap.keyword2,
            //keyword3 : scrap.keyword3, path:scrap.path, index:i}/*data*/);
            var rcvData = [];
            var rcvKeyword = [];
            var rcvPath = [];
            var rcvUser = [];
            var rcvIdx = [];
            for(var i=0; i<jsonObj.length; i++){
                rcvData.push(jsonObj[i].scrap_data);
                var keywordSet = [];
                for(var j=1; j<=3; j++) {
                    var name = "keyword"+j;
                    keywordSet.push(jsonObj[i][name]);
                }
                rcvKeyword.push(keywordSet);
                rcvPath.push(jsonObj[i].path);
                rcvUser.push(jsonObj[i].username);
                rcvIdx.push(jsonObj[i].index);
            }
            curScene.CSSScene.children[2]._init(10, rcvData, rcvIdx);
            curScene.CSSScene.children[9]._countCnt(0, jsonObj.length);
        }
        else {
            console.log("no recived");
        }
    }
    xmlhttp.open("POST","./Scrap?command=screenshot-read&username="+username+"&start="+start+"&end="+end,true);
    xmlhttp.send();
}

function requestScrapImagePreviewFriend( username, start, end, type) {
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
            var curScene = SCRAP.DIRECTOR._sceneList["branch"];
            var jsonObj = JSON.parse(xmlhttp.responseText);
            // scrap_arr.push({scrap_data :data, keyword1 : scrap.keyword1, keyword2 : scrap.keyword2,
            //keyword3 : scrap.keyword3, path:scrap.path, index:i}/*data*/);
            var rcvData = [];
            var rcvKeyword = [];
            var rcvPath = [];
            var rcvUser = [];
            var rcvIdx = [];
            for(var i=0; i<jsonObj.length; i++){
                rcvData.push(jsonObj[i].scrap_data);
                var keywordSet = [];
                for(var j=1; j<=3; j++) {
                    var name = "keyword"+j;
                    keywordSet.push(jsonObj[i][name]);
                }
                rcvKeyword.push(keywordSet);
                rcvPath.push(jsonObj[i].path);
                rcvUser.push(jsonObj[i].username);
                rcvIdx.push(jsonObj[i].index);
            }
            curScene.CSSScene.children[3]._init(10, rcvData, rcvIdx);
            curScene.CSSScene.children[9]._countCnt(2, jsonObj.length);
        }
        else {
            console.log("no recived");
        }
    }
    xmlhttp.open("POST","./Scrap?command=screenshot-read&username="+username+"&start="+start+"&end="+end,true);
    xmlhttp.send();
}

function requestScrapImagePreview( username, start, end, type) {
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
            var curScene = SCRAP.DIRECTOR._sceneList["branch"];
            var jsonObj = JSON.parse(xmlhttp.responseText);
            // scrap_arr.push({scrap_data :data, keyword1 : scrap.keyword1, keyword2 : scrap.keyword2,
            //keyword3 : scrap.keyword3, path:scrap.path, index:i}/*data*/);
            var rcvData = [];
            var rcvKeyword = [];
            var rcvPath = [];
            var rcvUser = [];
            var rcvIdx = [];
            for(var i=0; i<jsonObj.length; i++){
                rcvData.push(jsonObj[i].scrap_data);
                var keywordSet = [];
                for(var j=1; j<=3; j++) {
                    var name = "keyword"+j;
                    keywordSet.push(jsonObj[i][name]);
                }
                rcvKeyword.push(keywordSet);
                rcvPath.push(jsonObj[i].path);
                rcvUser.push(jsonObj[i].username);
                rcvIdx.push(jsonObj[i].index);
            }
            curScene.CSSScene.children[1]._init(10, rcvData, rcvIdx);

            console.log(len);
            var len = rcvData.length;
            curScene.CSSScene.children[9]._countCnt(1, jsonObj.length);
        }
        else {
            console.log("no recived");
        }
    }
    xmlhttp.open("POST","./Scrap?command=screenshot-read&username="+username+"&start="+start+"&end="+end,true);
    xmlhttp.send();
}