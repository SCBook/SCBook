var http = require('http');
http.post = require('http-post');

var User = require('../models/user.js');
var Scrap = require('../models/scrap.js');
var Keyword = require('../models/keyword.js');
var Comment = require('../models/comment.js');
var fs = require('fs');
require('date-utils');

// 한솔이 수 // 궁금하네요
exports.word_cloud = function(req, res){
    var contact = req.query;
    var username = contact.username;
    var keyword_arr=[];
    var keyword_temp = [];
    User.findOne({'username' : username}, function(err, user){
        if(user){
            for(var i= 0, j=0; i<user.Keywords.length; i++){
                Keyword.findOne({'_id':user.Keywords[i]}, function(err, keyword){
                    if(keyword){
                        if(keyword_temp[keyword] == null){
                            keyword_arr.push(keyword);
                            keyword_temp[keyword] = 1;
                        }
                    }
                });
            }
            function check(){
                if (keyword_arr.length < user.Keywords.length && keyword_arr.length < 20){
                    setTimeout(check, 10);
                }
                else{
                    res.send(keyword_arr);
                }
            }
            check();
        }
    });
}

exports.scrap_view = function(req, res){
    var contact = req.query;
    var start = contact.start;
    var end = contact.end;
    var scrap_arr=[];
    var i;
    // 내가 달아버린 주석은 여기 있습니다.
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
                                    // 환상적인 코드네요!!
                                    // 왜 안되지...
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
                                        }/*data*/);
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

exports.comment_view = function(req, res){
    var contact = req.query;
    var scrap_path = contact.path;
    var comment_number = contact.number; // view에 게시된 comment수
    var comment_arr = [];

    Scrap.findOne({'path' : scrap_path}, function(err, scrap){
        if(scrap.comments==null){
            res.send(comment_arr);
            return;
        }

        if(scrap.comments.length>=1){
            var i=scrap.comments.length - 1;
            var isFree = true;
            function check() {
                if (comment_arr.length >= scrap.comments.length - comment_number) {
                    console.log('comment_arr : ' + comment_arr);
                    res.send(comment_arr);
                }
                else{
                    if(isFree){
                        isFree = false;
                        Comment.findOne({'_id' : scrap.comments[i]}, function(err, comment){
                            if(comment){
                                comment_arr.push(comment);
                                isFree = true;
                                i--;
                            }
                        });
                    }
                    setTimeout(check, 10);
                }
            }
            check();
        }
        else{
            res.send(comment_arr);
        }

    });
}