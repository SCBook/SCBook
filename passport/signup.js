var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
var messageErr = "Invalid user information";
var fs = require('fs');

module.exports = function(passport){
    passport.use('signup', new LocalStrategy({
                passReqToCallback : true // allows us to pass back the entire request to the callback
            },
            function(req, username, password, done) {
                findOrCreateUser = function(){
                    // find a user in Mongo with provided username
                    User.findOne({ 'username' : username }, function(err, user) {
                        // In case of any error, return using the done method
                        if (err){
                            console.log('Error in SignUp: '+err);
                            return done(err);
                        }
                        // already exists
                        if (user) {
                            console.log('User already exists with username: '+username);
                            return done(null, false, req.flash('message','User Already Exists'));
                        } else {
                            // if there is no user with that email
                            // create the user
                            var newUser = new User();
                            // set the user's local credentials

                            newUser.username = username;
                            newUser.password = password;
                            newUser.email = req.param('email');
                            newUser.ScrapNum = 0;
                            newUser.KeywordNum = 0;

                            // 유효하지 않은 계정을 입력받을 때의 처리
                            if(!regularEx(newUser)){
                                return done(null, false, req.flash('message',messageErr));
                            }

                            newUser.password = createHash(password);
                            // save the user
                            newUser.save(function(err) {
                                if (err){
                                    console.log('Error in Saving user: '+err);
                                    throw err;
                                }
                                console.log('User Registration succesful');
                                return done(null, newUser);
                            });
                            createMkdir(newUser.username);
                        }
                    });
                };
                // Delay the execution of findOrCreateUser and execute the method
                // in the next tick of the event loop
                process.nextTick(findOrCreateUser);
            })
    );
    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }
    // 새로운 유저정보를 정규표현식으로 검사. 성공 : true, 실패 : false
    var regularEx = function(newUser){
        if(!chk(/^[a-z0-9_]{5,12}$/, newUser.username)){
            messageErr = "5~12자 영문소문자, 숫자, 특수문자 _ 사용가능.";
            return false;
        }
        /*if(!chk(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/, newUser.email)){
            messageErr = "이메일 형식이 잘못되었습니다.";
            return false;
        }*/
        if(!chk(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-]|.*[0-9]).{6,24}$/, newUser.password)){
            messageErr = "비밀번호 형식이 잘못되었습니다 (6~16자 영문대소문자, 숫자, 특수문자 혼합하여 사용).";
            return false;
        }
        return true;
    }
    function chk(re, e){
        if(re.test(e)) return true;
        return false;
    }
}

var createMkdir = function (username) {
    var path = './Userdir/'+username+'/';
    var comp = false;

    fs.readdir(path, function (err, files) {
        // 사용자 등록시 사용자이름 디렉토리 생성.
        if(err){
            fs.mkdir(path ,function(err){
                if(err) throw err;
                console.log('Created new User directory : ./'+username);
                comp = true;
            });
        }
    });
    function MkdirChek(){
        if(comp == false){
            setTimeout(MkdirChek, 10);
        }else{
            fs.readdir(path+'image/', function(err, files){
                if(err){
                    fs.mkdir(path+'image/', function(err){
                        if(err) throw err;
                        console.log('Created new Image dir directory'+username);
                    });
                }
            });
        }
    }
    MkdirChek();
}