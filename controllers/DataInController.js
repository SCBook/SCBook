/**
 * Created by redball on 15. 4. 9.
 */
var User = require('../models/user.js');
var Scrap = require('../models/scrap.js');
var Keyword = require('../models/keyword.js');
var Comment = require('../models/comment.js');
var fs = require('fs');
require('date-utils');

exports.scraps = function(req, res){
    var contact = req.body;

    var user = contact.username;
    var url = contact.url;
    var keyword1 = contact.keyword1;
    var keyword2 = contact.keyword2;
    var keyword3 = contact.keyword3;

    var scrap_data = contact.scrap_data;
    var dt = new Date().toFormat('YYYY-MM-DD-HH24:MI:SS');

    var path_scrap = contact.path_scrap;
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

    console.log('========== pre_path scrap ================');
    console.log(path_scrap);
    if(path_scrap == "null"){
        path_scrap = './Userdir/'+user+'/scrap-'+keyword1+keyword2+keyword3+'-'+dt;

        // 스크랩한 내용을 Scrap모델에 넣는다.
        Scrap.update(scrap_query, scrap_update, option, function(){});
        // 위에서 넣은 스크랩 내용의 _id를 찾는다.
        Scrap.findOne(scrap_query, function(err, scrap){
            // 찾은 _id를 유저의 Scraps필드에 넣는다.
            if(scrap){
                User.update(user_query, {$push : {Scraps : scrap._id}}, option, function(){});
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
                    if(keyword.keyword_bit != 1){
                        Keyword.update(path_keyword1,{$set : {keyword_bit : 1}},option, function(){})
                        User.update(user_query,{$push : {Keywords : keyword._id}}, option,function(){});
                    }

                }else{
                    console.log('키워드를 유저에 넣는데 실패했어 : ' +path_keyword1);
                }
            });
        }
        if(keyword2){
            Keyword.update( keyword_query2, keyword_update2, option,function () {} );
            Keyword.find({'path' : path_keyword2}, function(err, keyword){
                if(keyword.keyword_bit != 1){
                    Keyword.update(path_keyword2,{$set : {keyword_bit : 1}},option, function(){})
                    User.update(user_query,{$push : {Keywords : keyword._id}}, option,function(){});
                }
                else{
                    console.log('키워드를 유저에 넣는데 실패했어 : ' +path_keyword1);
                }
            });
        }
        if(keyword3){
            Keyword.update( keyword_query3, keyword_update3, option,function () {} );
            Keyword.find({'path' : path_keyword3}, function(err, keyword){
                if(keyword.keyword_bit != 1){
                    Keyword.update(path_keyword3,{$set : {keyword_bit : 1}},option, function(){})
                    User.update(user_query,{$push : {Keywords : keyword._id}}, option,function(){});
                }
                else{
                    console.log('키워드를 유저에 넣는데 실패했어 : ' +path_keyword1);
                }
            });
        }

        res.send({'state' : 'path', 'path' : path_scrap});
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

exports.image = function(req, res){
    var contact = req.body;
    var dt = new Date().toFormat('YYYY-MM-DD-HH24:MI:SS');
    var path_scrap = contact.path_scrap;

    var username = contact.username;

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

exports.comment_input = function(req, res){
    var contact = req.query;
    var comment_user = contact.username;
    var comment_data = contact.data;
    var comment_path = contact.path;
    var dt = new Date().toFormat('YYYY-MM-DD-HH24:MI:SS');

    var comment_query = {'contents' : comment_data};
    var comment_update = {$set:{post_name : comment_user, contents : comment_data, comment_date : dt, scrap_name : comment_path}};
    var option = {upsert : true};

    Comment.update(comment_query, comment_update, option, function(){});
    Comment.find({'scrap_name':comment_path}, function(err, comment){
        if(comment){
            //console.log('find comments...'+ comment);
            //console.log('comment.length : ' + comment.length);

            for(var i=0; i < comment.length; i++){
                if(comment[i].post_name == contact.username && comment[i].contents == comment_data && comment[i].scrap_name ==comment_path){
                    //console.log('Comment : ' + comment[i]);
                    Scrap.update({'path':comment_path},{$push : {comments : comment[i]._id}},option,function(){});
                }
            }
        }
    });
    res.send('requestHandled!');
}
