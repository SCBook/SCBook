/**
 * Created by hansol on 15. 5. 9.
 */
// 기본적인 키워드 생성은 스크랩 페이지를 통해서 이루어진다.
// KeywordController의 create는 사용자가 수동으로 키워드를 입력할 때 작동한다.
var User = require('../models/user.js');
var Keyword = require('../models/keyword.js');
var Comment = require('../models/comment.js');
var fs = require('fs');
require('date-utils');

exports.KeywordCreate = function(req, res){

}

// 요청한 유저의 키워드를 가중치를 정해서 view에 전달한다.
exports.KeywordRead = function(req, res){
    var contact = req.query;
    var username = contact.username;
    var keyword_arr=[];
    var keyword_temp = [];
    var index = [];
    var keyword_res = [];

    User.findOne({'username' : username}, function(err, user){
        if(user){
            var overlap = 0, max= 0, independence=0;
            for(var i= 0; i<user.Keywords.length; i++){
                Keyword.findOne({'_id':user.Keywords[i]}, function(err, keyword){
                    if(keyword){
                        if(keyword_temp[keyword.keyword_name] == null){
                            keyword_temp[keyword.keyword_name] = {keyword_name : keyword.keyword_name, 'weight' : 1};
                            index.push(keyword.keyword_name);
                            independence++;
                        }else{
                            keyword_temp[keyword.keyword_name].weight++;
                            if(keyword_temp[keyword.keyword_name].weight > max) max =keyword_temp[keyword.keyword_name].weight;
                            overlap++;
                        }
                    }
                });
            }
            function check(){
                if (independence + overlap != user.Keywords.length && keyword_arr.length < 20){
                    setTimeout(check, 10);
                }
                else{
                    for(var i=0; i<independence; i++){
                        keyword_res.push(keyword_temp[index[i]]);
                    }
                    for(var j=0; j<independence; j++){
                        keyword_res[j].weight = keyword_res[j].weight/max;
                    }
                    console.log('===== ks ======');
                    console.log(keyword_res);
                    res.send(keyword_res);
                }
            }
            check();
        }
    });
}

exports.KeywordUpdate = function(req, res){

}

exports.KeywordDelete = function(req, res){

}