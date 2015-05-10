/**
 * Created by hansol on 15. 5. 8.
 */
var User = require('../models/user.js');
var Scrap = require('../models/scrap.js');
var Keyword = require('../models/keyword.js');
var Comment = require('../models/comment.js');
var fs = require('fs');
require('date-utils');

// 스크린샷은 Update가 없다.
exports.ScreenShotCreate = function(req, res){
    var contact = req.body;
    var dt = new Date().toFormat('YYYY-MM-DD-HH24:MI:SS');
    var path_scrap = contact.path_scrap;

    //var username = contact.username;

    var path_image = path_scrap+'.html';
    path_image = path_image.replace(/\/scrap-/gi, "/image/");
    var ScreenImage = contact.ScreenImage;

    // DB에 이미지 파일의 경로를 추가한다.
    // DB에 이미지 파일의 경로를 추가하기 전에, 스크랩 html의 내용이 먼저 DB에 저장되어야한다.
    Scrap.update({path : path_scrap},{$set : {'path_image' : path_image}},{upsert : true},function(){});

    ScreenImage = ScreenImage.replace(/ /gi, "+"); //행바꿈제거
    //ScreenImage = ScreenImage.replace(/img+src/gi," ");
    ScreenImage = ScreenImage.replace(/\n/gi, "");
    ScreenImage = ScreenImage.replace(/\r/gi, "");

    console.log('============= ScreenImage ============');
    console.log(ScreenImage);
    console.log('======================================');
    if(ScreenImage){
        fs.open(path_image, 'a+', function(err, fd){
            if(err) throw err;
            var buf = new Buffer(ScreenImage);
            fs.write(fd, buf, 0, buf.length, null, function(err, written, buffer){
                if(err) throw err;
                fs.close(fd, function(){
                });
            });
        });
    }
    res.send('Image transfer success.');
}

exports.ScreenShotRead = function(req,res){
    var contact = req.query;
    var start = contact.start;
    var end = contact.end;
    var scrap_arr=[];
    var i;

    if(contact.username == 'all'){
        Scrap.find({}, function(err, scrap){
           if(scrap){
               if(start >= 0) {
                   i = start;
                   if(end >= scrap.length) {
                       end = scrap.length - 1;
                   }
               }else {
                   i = scrap.length - end;
                   if(i < 0 ) i = 0;
                   end = scrap.length;
               }
               var critical_section = true;
               function For(){
                   if (i < end) {
                       if (critical_section) {
                           critical_section = false;
                           Scrap.findOne({'_id': scrap[i]}, function (err, find_scrap) {
                               /*console.log('=================== scrap ==================');
                                console.log(scrap);*/
                               if (find_scrap) {
                                   if(find_scrap.path_image){
                                       /*console.log('=================== path_imag ==================');
                                        console.log(scrap.path_image);*/
                                       fs.readFile(find_scrap.path_image, 'utf8', function (err, data) {
                                           if (err) {
                                               throw err;
                                           } else {
                                               scrap_arr.push({
                                                   scrap_data: " <img src = \" "+data+"\">", keyword1: find_scrap.keyword1, keyword2: find_scrap.keyword2,
                                                   keyword3: find_scrap.keyword3, path: find_scrap.path, username: contact.username, index: i
                                               });
                                               i++; critical_section = true;
                                           }
                                       });
                                   }
                                   else{
                                       i++; critical_section = true;
                                   }
                               }
                           });
                       }
                       setTimeout(For, 10);
                   } else {
                       /*console.log('=== scrap arr ===');
                        ;                    console.log(scrap_arr);*/
                       res.send(scrap_arr);
                   }
               }
               For();
           }
        });
    }
    else if(contact.username == 'friend'){

        Scrap.find({}, function(err, scrap){

        });
    }
    else{
        /*console.log('===screenshot===');
         console.log(contact);*/
        User.findOne({'username' : contact.username}, function(err, user){
            /*console.log('====== user =======');
             console.log(user);*/
            if(user){
                if(start >= 0) {
                    i = start;
                    if(end >= user.Scraps.length) {
                        end = user.Scraps.length - 1;
                    }
                }else {
                    i = user.Scraps.length - end;
                    if(i < 0 ) i = 0;
                    end = user.Scraps.length;
                }
                var pass_state = true;

                function check_scrap1() {
                    if (i < end) {
                        if (pass_state) {
                            pass_state = false;
                            Scrap.findOne({'_id': user.Scraps[i]}, function (err, scrap) {
                                /*console.log('=================== scrap ==================');
                                 console.log(scrap);*/
                                if (scrap) {
                                    if(scrap.path_image){
                                        /*console.log('=================== path_imag ==================');
                                         console.log(scrap.path_image);*/
                                        fs.readFile(scrap.path_image, 'utf8', function (err, data) {
                                            if (err) {
                                                throw err;
                                            } else {
                                                scrap_arr.push({
                                                    scrap_data: " <img src = \" "+data+"\">", keyword1: scrap.keyword1, keyword2: scrap.keyword2,
                                                    keyword3: scrap.keyword3, path: scrap.path, username: contact.username, index: i
                                                });
                                                i++; pass_state = true;
                                            }
                                        });
                                    }
                                    else{
                                        i++; pass_state = true;
                                    }
                                }
                            });
                        }
                        setTimeout(check_scrap1, 10);
                    } else {
                        /*console.log('=== scrap arr ===');
                         ;                    console.log(scrap_arr);*/
                        res.send(scrap_arr);
                    }
                }
                check_scrap1();
            }
        });
    }
}

// 스크린샷은 Scrap이 삭제될 때만 삭제되므로 외부에 노출될 필요는 없다.
var ScreenShotDelete = function(path_image){
    if(path_image){
        fs.unlink(path_image + '.html', function(err){
            if(err){
                try{
                    throw err;
                }catch(err){
                    console.log('Image delete fail : ' + scrap.path_image);
                    return;
                }
            }
        });
    }
}

exports.ScrapCreate = function(req, res){
    console.log('스크랩 크리에이트 함수 실행됨.');
    var contact = req.body;
    var dt = new Date().toFormat('YYYY-MM-DD-HH24:MI:SS');

    var path_scrap = contact.path_scrap;

    console.log('=========== path_scrap =============');
    console.log(path_scrap);

    if(path_scrap == "null"){
        var user = contact.username;
        var url = contact.url;
        var keyword1 = contact.keyword1;
        var keyword2 = contact.keyword2;
        var keyword3 = contact.keyword3;

        path_scrap = './Userdir/'+user+'/scrap-'+keyword1+keyword2+keyword3+'-'+dt;
        // 키워드 식별자
        var path_keyword1 = './Userdir/'+user+'/scrap-path:'+path_scrap+"-"+keyword1;
        var path_keyword2 = './Userdir/'+user+'/scrap-path:'+path_scrap+"-"+keyword2;
        var path_keyword3 = './Userdir/'+user+'/scrap-path:'+path_scrap+"-"+keyword3;

        var scrap_query = {'path' : path_scrap};
        var scrap_update = {$set : {'keyword1' : keyword1, 'keyword2' : keyword2, 'keyword3' : keyword3,
            'path' : path_scrap, 'url':url, 'scrap_date' : dt}};

        var option = {upsert : true};

        var user_query = {'username': user};
        var keyword_query1 = { path : path_keyword1 };
        var keyword_query2 = { path : path_keyword2 };
        var keyword_query3 = { path : path_keyword3 };
        var keyword_update1 = {$set : {keyword_name : keyword1, keyword_date : dt, path : path_keyword1,
            parents_path : path_scrap}};
        var keyword_update2 = {$set : {keyword_name : keyword2, keyword_date : dt, path : path_keyword2,
            parents_path : path_scrap}};
        var keyword_update3 = {$set : {keyword_name : keyword3, keyword_date : dt, path : path_keyword3,
            parents_path : path_scrap}};


        // 스크랩한 내용을 Scrap모델에 넣는다.
        Scrap.update(scrap_query, scrap_update, option, function(){
            // 위에서 넣은 스크랩 내용의 _id를 찾는다.
            Scrap.findOne(scrap_query, function(err, scrap){
                // 찾은 _id를 유저의 Scraps필드에 넣는다.
                if(scrap){
                    console.log(scrap.path);
                    User.update(user_query, {$push : {Scraps : scrap._id}}, option, function(){
                        console.log("send : " + path_scrap);
                        res.send({'state' : 'path', 'path' : path_scrap});
                    });
                }
                else{
                    console.log('유저모델에 스크랩_id넣는데 실패했어. :' +scrap_query);
                }
            });
        });
        // 스크랩한 내용을 Keyword모델에 넣는다.
        if(keyword1){
            Keyword.update( keyword_query1, keyword_update1, option, function(){
                Keyword.findOne({'path' : path_keyword1}, function(err, keyword){
                    if(keyword){
                        User.update(user_query,{$push : {Keywords : keyword._id}}, option,function(){});
                    }else{
                        console.log('키워드를 유저에 넣는데 실패했어 : ' +path_keyword1);
                    }
                });
            } );
        }
        if(keyword2){
            Keyword.update( keyword_query2, keyword_update2, option,function () {
                Keyword.findOne({'path' : path_keyword2}, function(err, keyword){
                    if(keyword){
                        User.update(user_query,{$push : {Keywords : keyword._id}}, option,function(){});
                    }
                    else{
                        console.log('키워드를 유저에 넣는데 실패했어 : ' +path_keyword2);
                    }
                });
            } );
        }
        if(keyword3){
            Keyword.update( keyword_query3, keyword_update3, option,function () {
                Keyword.findOne({'path' : path_keyword3}, function(err, keyword){
                    if(keyword){
                        User.update(user_query,{$push : {Keywords : keyword._id}}, option,function(){});
                    }
                    else{
                        console.log('키워드를 유저에 넣는데 실패했어 : ' +path_keyword3);
                    }
                });
            });
        }
        return;
    }

    var scrap_data = contact.scrap_data;
    // 파일 저장
    /*console.log('============ scrap data ==============');
    console.log(scrap_data);*/
    scrap_data = scrap_data.replace(/;scb;/gi, "&");
    fs.open(path_scrap+'.html', 'a+', function(err, fd){
        if(err) throw err;
        var buf = new Buffer(scrap_data);
        fs.write(fd, buf, 0, buf.length, null, function(err, written, buffer){
            if(err) throw err;
            fs.close(fd, function(){});
        });
    });
    res.send({'state' : 'path', 'path' : path_scrap});
}

exports.ScrapRead = function(req, res){
    var contact = req.query;
    var start = contact.start;
    var end = contact.end;
    var scrap_arr=[];
    var i;

    if(contact.username == 'all'){
        Scrap.find({},function(err, scrap){
            if(start >= 0){
                i = start;
                if(end >= scrap.length){
                    end = scrap.length -1;
                }else{
                    i = scrap.length -end;
                    if( i<0 ) i =0;
                    end = scrap.length -1;
                }
                var pass_state = true;

                function check_scrap2(){
                    if(i < end){

                    }
                }
                //check_scrap2();
            }
        });
    }else if(contact.username == 'friend'){

    }else{
        User.findOne({'username' : contact.username}, function(err, user){
            if(user){
                if(start >= 0) {
                    i = start;
                    if(end >= user.Scraps.length) {
                        end = user.Scraps.length - 1;
                    }
                }else {
                    i = user.Scraps.length -end;
                    if(i < 0 ) i = 0;
                    end = user.Scraps.length - 1;
                }
                var pass_state = true;

                function check_scrap1() {
                    if (i < end) {
                        if (pass_state) {
                            pass_state = false;
                            Scrap.findOne({'_id': user.Scraps[i]}, function (err, scrap) {
                                if (scrap) {
                                    fs.readFile(scrap.path + '.html', 'utf8', function (err, data) {
                                        if (err) {
                                            try {
                                                throw err;
                                            } catch (err) {
                                                console.log(err);
                                                res.send([]);
                                                return;
                                            }
                                        } else {
                                            scrap_arr.push({
                                                scrap_data: data,
                                                keyword1: scrap.keyword1,
                                                keyword2: scrap.keyword2,
                                                keyword3: scrap.keyword3,
                                                path: scrap.path,
                                                username: contact.username,
                                                index: i
                                            });
                                            i++;
                                            pass_state = true;
                                        }

                                    });
                                }
                            });
                        }
                        setTimeout(check_scrap1, 10);
                    } else {
                        res.send(scrap_arr);
                    }
                }
                check_scrap1();
            }
        });
    }
}

exports.ScrapUpdate = function(req, res){

}

exports.ScrapDelete = function(req, res){
    var contact = req.query;
    var username = contact.username;
    var path_scrap = contact.path_scrap;
    var id_scrap;

    // 주어진 path_scrap으로 스크랩 기사를 찾아 파일을 삭제, id를 찾는다.

    Scrap.findOne({'path':path_scrap},function(err, scrap){
        if(!scrap) return;

        // 스크린샷 이미지와 스크랩 페이지 파일을 삭제한다.
        ScreenShotDelete(scrap.path_image);
        if(path_scrap){
            fs.unlink(path_scrap + '.html', function(err){
                if(err){
                    try{
                        throw err;
                    }catch(err){
                        console.log('Scrap delete fail : ' + scrap.path);
                        return;
                    }
                }
            });
        }

        // 유저 모델에서 스크랩 _id를 찾고 배열에서 요소삭제를 한다.
        User.findOne({'username':username}, function(err, user){
            if(!user)return;

            for(var i=0; i<user.Scraps.length; i++){
                if(user.Scraps[i] == scrap._id){
                    //user.Scraps.removeElement(i); // 해당 요소 삭제
                    User.update(
                        {'username':username},
                        { $pull: {'Scraps' : scrap._id}},
                        {upsert : false}, function(){}
                    );
                }
            }
        });
        // 스크랩 도큐먼트를 삭제한다.
        Scrap.remove({'path':path_scrap},function(){
            res.redirect('/all-users');
        });
    });
    Keyword.find({'parents_path': path_scrap}, function(err,keyword){
        if(keyword){
            for(var i=0; i<keyword.length; i++){
                /*console.log('======= 키워드 삭제 ========');
                console.log(keyword[i]);*/
                User.update(
                    {'username':username},
                    {$pull : { 'Keywords': keyword[i]._id}},
                    {upsert : false}, function(){}
                );
            }
        }
        Keyword.remove({'parents_path': path_scrap},function(){})
    });
}