var express = require('express');
var router = express.Router();

var manager = require('../controllers/Manager');
var usercontroller = require('../controllers/UserController');
var scrapcontroller = require('../controllers/ScrapController');
var keywordcontroller = require('../controllers/KeywordController');
var commantcontroller = require('../controllers/CommentController');

var multer = require('multer');
var fs = require('fs');

var isAuthenticated = function (req, res, next) {
// if user is authenticated in the session, call the next() to call the next request handler
// Passport adds this method to request object. A middleware is allowed to add properties to
// request and response objects
    var _res = {"response":"session-fail","data":req.user,"state" : "session-fail"};
    if (req.isAuthenticated()){
        return next();
    }
// if the user is not authenticated then redirect him to the login page
    res.send(_res);
}

module.exports = function(passport){
    router.get('/', function(req, res) {
        res.render('index', {});
    });

    router.get('/browserError', function(req, res) {
        res.render('browserError', {});
    });

    // web에서 접근하는 로그인
    router.post('/login-view', function(req, res, next) {
        passport.authenticate('login', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) {
                //console.log("no user : " + req.query.username + " , " + req.query.password + "\n");
                return res.send({"response":"login-fail"});
            }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.send({"response":"login-success","user":req.user});
            });
        })(req, res, next);
    });

    // 크롬 extention에서 접근하는 로그인
    router.post('/login-view1', function(req, res, next) {
        var success = { state : 'LoginSuccess', user_id : req.body.username, user_pw : req.body.password};
        var fail = { state : 'LoginFail', user_id : req.body.username, user_pw : req.body.password};

        passport.authenticate('login', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) {
                return res.send(fail);
            }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.send(success);
            });
        })(req, res, next);
    });

    // 로그아웃
    router.post('/signout',isAuthenticated, function(req, res) {
        req.logout();
        res.send("logout complete!");
    });

    router.post('/session-check', isAuthenticated, function(req, res){
        var _res = {"response":"session-ok","data":req.user,"state" : "session-ok"};
        res.send(_res);
    });

    // 회원가입
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/signup-success',
        failureRedirect: '/signup-fail',
        failureFlash : true
    }));

    router.get('/signup-success', function(req, res, next){
       return res.send({"response":"signup-success","user":req.user});
    });

    router.get('/signup-fail', function(req, res, next){
        var _res = req.flash('message');
        return res.send(_res);
    });

    router.get('/manager', function(req, res, next){
        var command = req.query.command;

        if(command == 'user-list'){
            manager.listUser(req, res);
        }else if(command == 'scrap-list'){
            manager.listScrap(req, res);
        }else if(command == 'keyword-list'){
            manager.listKeyword(req, res);
        }else if(command == 'all-remove'){
            manager.removeAll(req, res);
        }
    });

    router.post('/User', multer({changeDest: function(dest, req, res){}}, {rename: function(fieldname, filename){}}), function(req, res, next){
        var command = req.query.command;

        if(command == 'update'){
            usercontroller.UserUpdate(req, res);
        }else if(command == 'read'){
            usercontroller.UserRead(req, res);
        }else if(command == 'delete'){
            usercontroller.UserDelete(req,res);
        }
    });

    router.post('/Scrap', function(req, res, next){
        var command = req.query.command;
        if(!command) command = req.body.command;

        if(command == 'create'){
            scrapcontroller.ScrapCreate(req, res);
        }else if(command == 'read'){
            scrapcontroller.ScrapRead(req, res);
        }else if(command == 'update'){
            scrapcontroller.ScrapUpdate(req, res);
        }else if(command == 'delete'){
            scrapcontroller.ScrapDelete(req, res);
        }else if(command == 'screenshot-create'){
            scrapcontroller.ScreenShotCreate(req, res);
        }else if(command == 'screenshot-read'){
            scrapcontroller.ScreenShotRead(req, res);
        }
    });

    router.post('/Keyword', function(req,res,next){
        var command = req.query.command;

        if(command == 'create'){
            keywordcontroller.KeywordCreate(req, res);
        }else if(command == 'read'){
            keywordcontroller.KeywordRead(req,res);
        }else if(command == 'update'){
            keywordcontroller.KeywordUpdate(req,res);
        }else if(command == 'delete'){
            keywordcontroller.KeywordDelete(req, res);
        }
    });

    router.post('/Comment', function(req, res, next){
       var command = req.query.command;

        if(command == 'create'){
            commantcontroller.CommentCreate(req, res);
        }else if(command == 'read'){
            commantcontroller.CommentRead(req, res);
        }else if(command == 'update'){
            commantcontroller.CommentUpdate(req, res);
        }else if(command == 'delete'){
            commantcontroller.CommentDelete(req, res);
        }
    });

    router.get('/test-range', function(req, res, next){
        manager.test_range(req,res);
    });
    return router;
}