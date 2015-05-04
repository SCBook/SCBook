var express = require('express');
var router = express.Router();
var cont = require('../controllers/cont');
var dataincontroller = require('../controllers/DataInController');
var dataoutcontroller = require('../controllers/DataOutController');

var http = require('http');
http.post = require('http-post');

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

    router.post('/signout',isAuthenticated, function(req, res) {
        req.logout();
        res.send("logout complete!");
    });

    router.post('/session-check', isAuthenticated, function(req, res){
        console.log("request");
        //console.log(req);
        var _res = {"response":"session-ok","data":req.user,"state" : "session-ok"};
        res.send(_res);
    });

    router.get('/createUser', function(req, res, next){
        cont.createUser(req, res);
    });

    router.get('/all-users', function(req, res, next){
        cont.listUser(req, res);
    });

    router.get('/all-remove', function(req, res, next){
        cont.removeAll(req, res);
    });

    // Java Server에서 보내는 데이터를 임시로 만들었음.
    // 이 명령 후 2분후에 events.js:72 throw er; // Unhandled 'error' event 발생
    // 에러 내용은 두 개의 터미널에서 같은 포트로 Node.js의 웹을 실행할 때 발생한다고 한다.
    // 분명 터미널은 하나만 틀었는데 이런 문제가 발생하는 것을 보면 아래의 코드에서 터미널을 강제로 발생시키고 종료시키지 않은 것 같다.
    router.get('/post1', function(req, res, next){
        var username = "hansolchoi";
        fs.readFile('./webscrap/dumy1.html', 'utf8', function(err, data){
            if(err){
                throw err;
            }else{
                var scrap = {
                    username : username,
                    keyword1: "컴퓨터 시스템",
                    keyword2: "운영체제",
                    url:"http://navercast.naver.com/contents.nhn?rid=47&contents_id=865031",
                    scrap_data : data
                }
                http.post('http://localhost:3000/scraps',scrap, function(res){
                    return res;
                });
            }
        });
        fs.readFile('./webscrap/dumy2.html', 'utf8', function(err, data){
            if(err){
                throw err;
            }else{
                var scrap = {
                    username : username,
                    keyword1: '운영체제',
                    keyword3 : "수분",
                    url:"http://navercast.naver.com/contents.nhn?rid=47&contents_id=865034",
                    scrap_data : data
                }
                http.post('http://localhost:3000/scraps',scrap, function(res){
                    return res;
                });
            }
        });
        fs.readFile('./webscrap/dumy3.html', 'utf8', function(err, data){
            if(err){
                throw err;
            }else{
                var scrap = {
                    username : username,
                    keyword1: "운영체제",
                    Keyword2: "운영체제",
                    keyword3: "모니터",

                    url:"http://navercast.naver.com/contents.nhn?rid=47&contents_id=865035",
                    scrap_data : data
                }
                http.post('http://localhost:3000/scraps',scrap, function(res){
                    return res;
                });
            }
        });
        fs.readFile('./webscrap/dumy4.html', 'utf8', function(err, data){
            if(err){
                throw err;
            }else{
                var scrap = {
                    username : username,
                    keyword1: "아이유",
                    url:"http://navercast.naver.com/contents.nhn?rid=47&contents_id=865036",
                    scrap_data : data
                }
                http.post('http://localhost:3000/scraps',scrap, function(res){
                    return res;
                });
            }
        });
        fs.readFile('./webscrap/dumy5.html', 'utf8', function(err, data){
            if(err){
                throw err;
            }else{
                var scrap = {
                    username : username,
                    keyword1: "노트북",

                    url:"http://navercast.naver.com/contents.nhn?rid=47&contents_id=865037",
                    scrap_data : data
                }
                http.post('http://localhost:3000/scraps',scrap, function(res){
                    return res;
                });
            }
        });
        res.redirect('/list-scrap');
    });

    /*router.get('/post2', function(req, res, next){
        var username = "hansolchoi";
        fs.readFile('./webscrap/dumy6.html', 'utf8', function(err, data){
            if(err){
                throw err;
            }else{
                var scrap = {
                    username : username,
                    keyword: "Operating_System",
                    url:"http://navercast.naver.com/contents.nhn?rid=47&contents_id=865038",
                    scrap_data : data
                }
                http.post('http://localhost:3000/scrap',scrap, function(res){
                    return res;
                });
            }
        });
        fs.readFile('./webscrap/dumy7.html', 'utf8', function(err, data){
            if(err){
                throw err;
            }else{
                var scrap = {
                    username : username,
                    keyword: "Scheduler",
                    url:"http://navercast.naver.com/contents.nhn?rid=47&contents_id=865039",
                    scrap_data : data
                }
                http.post('http://localhost:3000/scrap',scrap, function(res){
                    return res;
                });
            }
        });
        fs.readFile('./webscrap/dumy8.html', 'utf8', function(err, data){
            if(err){
                throw err;
            }else{
                var scrap = {
                    username : username,
                    keyword: "File_system",
                    url:"http://navercast.naver.com/contents.nhn?rid=47&contents_id=865040",
                    scrap_data : data
                }
                http.post('http://localhost:3000/scrap',scrap, function(res){
                    return res;
                });
            }
        });
        fs.readFile('./webscrap/dumy9.html', 'utf8', function(err, data){
            if(err){
                throw err;
            }else{
                var scrap = {
                    username : username,
                    keyword: "Memory_manager",
                    url:"http://navercast.naver.com/contents.nhn?rid=47&contents_id=865041",
                    scrap_data : data
                }
                http.post('http://localhost:3000/scrap',scrap, function(res){
                    return res;
                });
            }
        });
        fs.readFile('./webscrap/dumy10.html', 'utf8', function(err, data){
            if(err){
                throw err;
            }else{
                var scrap = {
                    username : username,
                    keyword: "Round_Robin",
                    url:"http://navercast.naver.com/contents.nhn?rid=47&contents_id=865042",
                    scrap_data : data
                }
                http.post('http://localhost:3000/scrap',scrap, function(res){
                    return res;
                });
            }
        });
    });
    router.get('/post2', function(req, res, next){
        var username = "hansolchoi";
        fs.readFile('./webscrap/dumy11.html', 'utf8', function(err, data){
            if(err){
                throw err;
            }else{
                res.send(data);
            }
        });
    });*/

    // 회원가입
    router.get('/signup', passport.authenticate('signup', {
        successRedirect: '/signup-success',
        failureRedirect: '/signup-fail',
        failureFlash : true
    }));

    router.get('/signup-success', function(req, res, next){
       return res.send('join-success');
    });

    router.get('/signup-fail', function(req, res, next){
        var _res = req.flash('message');
        return res.send(_res);
    });


    router.get('/list-scrap', function(req, res, next){
        cont.listScrap(req, res);
    });

    router.get('/list-keyword', function(req, res, next){
        cont.listKeyword(req, res);
    });

    router.post('/scrap', isAuthenticated, function(req, res, next){
        dataincontroller.scraps(req, res);
    });

    router.post('/scraps', function(req, res, next){
        cont.scraps(req, res);
    });

    //
    router.post('/word-cloud', function(req, res, next){
        dataoutcontroller.word_cloud(req, res);
    });

    router.post('/scrap-view', function(req, res, next){
        dataoutcontroller.scrap_view(req, res);
    });

    router.post('/comment-view', function(req, res, next){
        dataoutcontroller.comment_view(req, res);
    });

    router.post('/comment-input', function(req, res, next){
        dataincontroller.comment_input(req, res);
    });

    router.get('/comment-rm', function(req, res, next){
       cont.comment_rm(req, res);
    });

    router.get('/weighting', function(req, res, next){

    });

    router.post('/image', function(req, res, next){
        dataincontroller.image(req,res);
    });

    return router;
}