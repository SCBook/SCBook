/**
 * Created by hansol on 15. 5. 8.
 */
var User = require('../models/user.js');
var Scrap = require('../models/scrap.js');
var Keyword = require('../models/keyword.js');
var Comment = require('../models/comment.js');
var fs = require('fs');
require('date-utils');

exports.ScrapCreate = function(req, res){
    var contact = req.body;

    var user = contact.username;
    var url = contact.url;
    var keyword1 = contact.keyword1;
    var keyword2 = contact.keyword2;
    var keyword3 = contact.keyword3;

    var scrap_data = contact.scrap_data;
    var dt = new Date().toFormat('YYYY-MM-DD-HH24:MI:SS');

    var path_scrap = contact.path_scrap;

    console.log('========== pre_path scrap ================');
    console.log(path_scrap);

    if(path_scrap == "null"){
        path_scrap = './Userdir/'+user+'/scrap-'+keyword1+keyword2+keyword3+'-'+dt;

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
        var keyword_update1 = {$set : {keyword_name : keyword1, keyword_date : dt, path : path_keyword1}};
        var keyword_update2 = {$set : {keyword_name : keyword2, keyword_date : dt, path : path_keyword2}};
        var keyword_update3 = {$set : {keyword_name : keyword3, keyword_date : dt, path : path_keyword3}};

        // 스크랩한 내용을 Scrap모델에 넣는다.
        Scrap.update(scrap_query, scrap_update, option, function(){ });
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
        // 스크랩한 내용을 Keyword모델에 넣는다.
        if(keyword1){
            Keyword.update( keyword_query1, keyword_update1, option, function(){} );
            Keyword.findOne({'path' : path_keyword1}, function(err, keyword){
                if(keyword){
                    User.update(user_query,{$push : {Keywords : keyword._id}}, option,function(){});
                }else{
                    console.log('키워드를 유저에 넣는데 실패했어 : ' +path_keyword1);
                }
            });
        }
        if(keyword2){
            Keyword.update( keyword_query2, keyword_update2, option,function () {} );
            Keyword.findOne({'path' : path_keyword2}, function(err, keyword){
                if(keyword){
                    User.update(user_query,{$push : {Keywords : keyword._id}}, option,function(){});
                }
                else{
                    console.log('키워드를 유저에 넣는데 실패했어 : ' +path_keyword2);
                }
            });
        }
        if(keyword3){
            Keyword.update( keyword_query3, keyword_update3, option,function () {} );
            Keyword.findOne({'path' : path_keyword3}, function(err, keyword){
                if(keyword){
                    User.update(user_query,{$push : {Keywords : keyword._id}}, option,function(){});
                }
                else{
                    console.log('키워드를 유저에 넣는데 실패했어 : ' +path_keyword3);
                }
            });
        }
        return;
    }

    // 파일 저장
    console.log('============ scrap data ==============');
    console.log(scrap_data);
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

    User.findOne({'username' : contact.username}, function(err, user){
        if(user){
            if(start >= 0) {
                i = start;
                if(end >= user.Scraps.length) {
                    end = user.Scraps.length - 1;
                }
            }else {
                i = user.Scraps.length - end;
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
                                        } catch ( err ){
                                            console.log( err );
                                            res.send([]);
                                            return;
                                        }
                                    } else {
                                        scrap_arr.push({
                                            scrap_data: data, keyword1: scrap.keyword1, keyword2: scrap.keyword2,
                                            keyword3: scrap.keyword3, path: scrap.path, username: contact.username, index: i
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

exports.ScrapUpdate = function(req, res){

}

exports.ScrapDelete = function(req, res){

}