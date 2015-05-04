/**
 * Created by redball on 15. 3. 20.
 */
var User = require('../models/user.js');
var Scrap = require('../models/scrap.js');
var Keyword = require('../models/keyword.js');
var Comment = require('../models/comment.js');
var fs = require('fs');
require('date-utils');

// 관리자가 임의로 쉽게 사용자 만들기.
exports.createUser = function(req, res){
    var username = req.query.username;

    User.findOne({'username' : username},function(err, user){
            if(user){
                res.send('이미 있어 임마.');
            }else{
                var newUser = new User();
                newUser.username = username;
                newUser.password = "1234";
                newUser.save();

                var path = './Userdir'+username+'/';
                fs.readdir(path, function (err, files) {
                    // 사용자 등록시 사용자이름 디렉토리 생성.
                    if(err){
                        fs.mkdir('./'+username ,function(err){
                            if(err) throw err;
                            console.log('Created newdir : ./'+username);
                        });
                    }
                });

                res.send(newUser);
            }
        }
    );
}

exports.removeAll = function(req, res){
    User.find({}, function(err, user){
        if(err) throw err;
        if(user){
            for(var i= 0; i < user.length; i++){
                // 우선 해당 유저 디렉토리 안의 파일들을 모두 삭제한다.
                var path = './Userdir/'+user[i].username+'/';
                fs.readdir(path, function(err, files){
                    if(err){
                        console.log('User directory already is removed.');
                    }else{

                        files.forEach(function(file, index, arr){
                            console.log('rm-file-name : '+ file);
                            if(file != 'image'){
                                fs.unlink(path+file, function(err){
                                    if(err) throw err;
                                    console.log('Successfully deleted '+ path+file+'\n');
                                });
                                if(index == arr.length - 1) ;
                            }
                        });
                    }

                });
                /*path = path+'image/';
                fs.readdir(path, function(err, images){
                   if(err){
                       console.log('User image directory already is removed.');
                   }else{
                       images.forEach(function(image, index, arr){
                           console.log('rm-image-name : '+ image);
                           fs.unlink(path+image, function(err){
                               if(err) throw err;
                               console.log('Successfully deleted '+ path+image+'\n');
                           });
                           if(index == arr.length -1);
                       });
                   }
                });*/
                user[i].remove();
            }
        }
    });
    Scrap.find({}, function(err, scrap){
        if(err) throw err;
        if(scrap){
            for(var i=0; i < scrap.length; i++){
                scrap[i].remove();
            }
        }
    });

    Keyword.find({}, function(err, keyword){
        if(err) throw err;
        if(keyword){
            for(var i=0; i<keyword.length; i++){
                keyword[i].remove();
            }
        }
    });
    Comment.find({}, function(err, comment){
        if(err) throw err;
        if(comment){
            for(var i=0; i<comment.length; i++){
                comment[i].remove();
            }
        }
    });
    res.redirect('/');
}

exports.comment_rm = function(req, res){
    var path_name = './Userdir/hansolchoi/노트북-2015-05-02-05:15:21.html';
    Scrap.findOne({'path': path_name}, function(err, scrap){
        console.log('여기'+scrap);
        for(var i=0; i<scrap.comments.length; i++){
            Scrap.update({'path': path_name},{$pop : {'comments' : 1}},{upsert:true},function(){});
        }
    });
    res.redirect('/list-scrap');
}

exports.listUser = function(req, res){
    User.find({}, function(err, user){
        res.send(user);
    });
}

exports.listScrap = function(req, res){
    Scrap.find({}, function(err, scrap){
       return res.send(scrap);
    });
}

exports.listKeyword = function(req, res){
    Keyword.find({}, function(err, keyword){
        return res.send(keyword);
    });
}

exports.scraps = function(req, res){
    var contact = req.body;

    var user = contact.username;
    var url = contact.url;
    var keyword1 = contact.keyword1;
    var keyword2 = contact.keyword2;
    var keyword3 = contact.keyword3;

    var scrap_data = contact.scrap_data;

    var dt = new Date().toFormat('YYYY-MM-DD-HH24:MI:SS');

    var path_scrap = './Userdir/'+user+'/'+keyword1+keyword2+keyword3+'-'+dt;

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

    // 스크랩한 내용을 Scrap모델에 넣는다.
    Scrap.update(scrap_query, scrap_update, option, function(){});
    // 위에서 넣은 스크랩 내용의 _id를 찾는다.
    Scrap.findOne(scrap_query, function(err, scrap){
        // 찾은 _id를 유저의 Scraps필드에 넣는다.
        if(scrap){
            User.update(user_query, {$push : {Scraps : scrap._id}}, option, function(){});
        }else{
            console.log('유저모델에 스크랩_id넣는데 실패했어. :' +scrap_query.path);
        }
    });

    // 스크랩한 내용을 Keyword모델에 넣는다.
    if(keyword1){
        Keyword.update( keyword_query1, keyword_update1, option, function(){} );
        Keyword.findOne({'path' : path_keyword1}, function(err, keyword){
            if(keyword){
                User.update(user_query,{$push : {Keywords : keyword._id}}, option,function(){});
            }else{
                console.log('키워드1를 유저에 넣는데 실패했어 : ' +path_keyword1);
            }
        });
    }
    if(keyword2){
        Keyword.update( keyword_query2, keyword_update2, option,function () {} );
        Keyword.findOne({'path' : path_keyword2}, function(err, keyword){
            if(keyword){
                User.update(user_query,{$push : {Keywords : keyword._id}}, option,function(){});
            }else{
                console.log('키워드2를 유저에 넣는데 실패했어 : ' +path_keyword2);
            }
        });
    }
    if(keyword3){
        Keyword.update( keyword_query3, keyword_update3, option,function () {} );
        Keyword.findOne({'path' : path_keyword3}, function(err, keyword){
            if(keyword){
                User.update(user_query,{$push : {Keywords : keyword._id}}, option,function(){});
            }else{
                console.log('키워드3를 유저에 넣는데 실패했어 : ' +path_keyword3);
            }
        });
    }
    // 파일 저장
    console.log('============ scrap data ==============');
    console.log(scrap_data);
    fs.open(path_scrap+'.html', 'w', function(err, fd){
        if(err) throw err;
        var buf = new Buffer(scrap_data);
        fs.write(fd, buf, 0, buf.length, null, function(err, written, buffer){
            if(err) throw err;
            fs.close(fd, function(){});
        });
    });

    //res.send({'state' : 'path', 'path' : path_scrap});
}

exports.weighting = function(req, res){

}

exports.image = function(req, res){
    var contact = req.body;
    var user = contact.username;
    var url = contact.url;
    var keyword = contact.keyword1;
    var dt = new Date().toFormat('YYYY-MM-DD-HH24:MI:SS');
    var path_scrap = './Userdir/'+user+'/image/'+keyword+'-'+dt+'.html';
    var ScreenImage = contact.ScreenImage;
    console.log('============== contact ===========');
    console.log(contact);

    ScreenImage = ScreenImage.replace(/ /gi, "+");//행바꿈제거
    ScreenImage = ScreenImage.replace(/\n/gi, "");
    ScreenImage = ScreenImage.replace(/\r/gi, "");

    if(ScreenImage){
        fs.open(path_scrap, 'a+', function(err, fd){
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