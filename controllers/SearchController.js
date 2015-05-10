/**
 * Created by hansol on 15. 5. 10.
 */
var User = require('../models/user.js');
var Scrap = require('../models/scrap.js');
var Keyword = require('../models/keyword.js');
var Comment = require('../models/comment.js');
var fs = require('fs');
require('date-utils');

exports.ResearchUser = function(req, res){
    var username = req.query.username;
    var user_arr = [];

    User.find({'username':username}, function(err, user){
        res.send(user);
    });
}

exports.ResearchScrap = function(req, res){

}

exports.ResearchKeyword = function(req, res){

}