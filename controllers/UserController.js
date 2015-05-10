/**
 * Created by hansol on 15. 5. 8.
 */
var User = require('../models/user.js');
var manager = require('../controllers/Manager');
var fs = require('fs');
require('date-utils');

exports.UserUpdate = function(req, res){
    var origin_username = req.query.origin_username;
    var change_username = req.query.change_username;
    var sub_command = req.query.sub_command;
    var username_message;
    var password_message;
    var error_message='';

    if(change_username){
        username_message = manager.username_check(change_username);
        if(username_message == 'success'){
            User.update({'username':origin_username},{$set:{'username':change_username}},{upsert:false},function(){});
            // Userdir안에 디렉토리 이름도 바꿔준다. But, 파일이름은 그대로.
            fs.rename('./Userdir/'+origin_username, './Userdir/'+change_username, function(){});
        }else{
            error_message += username_message + ' ';
        }
    }
    if(req.query.password){
        password_message = manager.password_check(req.query.password);
        if(password_message == 'success'){
            var password = createHash(req.query.password);
            User.update({'username':origin_username},{$set:{'password':password}},{upsert:false},function(){});
        }else{
            error_message += password_message + ' ';
        }
    }
    if(req.query.email){
        User.update({'username':origin_username},{$set:{'email':req.query.email}},{upsert:false},function(){});
    }
    if(req.query.title){
        User.update({'username':origin_username},{$set:{'title':req.query.title}},{upsert:false},function(){});
    }
    if(req.files.userPhoto){
        User.update({'username':origin_username},{$set:{'path_profile_image':req.files.userPhoto.path}},{upsert:false},function(){});
    }
    if(req.query.nickname){
        User.update({'username':origin_username},{$set:{'nickname':req.query.nickname}},{upsert:false},function(){});
    }
    if(req.query.friend){
        // 친구추가 중복 방지
        User.findOne({'username':origin_username}, function(err, user){
            var i=0; var pass= true; var friend_jud = false;
            function For(){
                if(i<user.friend.length){
                    pass = false;
                    if(user.friend[i] == req.query.friend){
                        friend_jud = true; i = user.friend.length;
                    }else{
                        i++; pass = true;
                    }
                    setTimeout(2);
                }else{
                    if(friend_jud == false){
                        User.update({'username':origin_username}, {$push:{'friends':req.query.friend}},
                            {upsert:true}, function(){});
                    }
                    // 친구추가 해
                    if(friend_jud == true && sub_command == 'remove'){
                        User.update({'username':origin_username}, {$pull:{'friends':req.query.friend}},
                            {upsert:false}, function(){});
                    }
                }
            }
            For();
        });
    }

    if(error_message){
        res.send(error_message);
    }else{
        res.send('success');
    }

}

exports.UserRead = function(req, res){
    var contact = req.query;
    var username = contact.username;
    var friend = contact.reader;

    User.findOne({'username' : username}, function(err, user){
        if(err){
            res.send('User can\'nt find.'); return;
        }

        var i=0; var pass=true; var friend_jud = false;
        function For(){
            if(!user){
                var user_info = {};
                res.send(user_info)
                return;
            }
            if(user.friend!=null && i<user.friend.length){
                if( pass = true ){
                    pass = false;
                    if(user.friend[i] == friend){
                        friend_jud = true; i=user.friend.length; pass = true;
                    }else{
                        i++; pass = true;
                    }
                }
                setTimeout(5);
            }else {
                var user_info = {username : user.username, scraps : user.Scraps.length, comment : user.title, friend : friend_jud };
                res.send(user_info);
            }
        }
        For();
    });
}

exports.UserDelete = function(req, res){
    var contact = req.query;
    var username = contact.username;

    User.findOne({'username' : username}, function(err, user){
        if(err){
            res.send('User find err.'); return;
        }
        if(!user){
            res.send('User can\'t find.'); return;
        }
        var path = './Userdir/'+user.username+'/';

        fs.readdir(path, function(err, files){
            if(err){
                console.log('User directory already is removed.');
                res.send("User directory already is removed");
                return;
            }else{
                files.forEach(function(file, index, arr){
                    console.log('rm-file-name : '+ file);
                    if(file != 'image'){
                        fs.unlink(path+file, function(err){
                            if(err){
                                try{
                                    throw err;
                                }catch(err){
                                    console.log( 'file remove : ' + err );
                                    res.send("User file remove : " + err);
                                    return;
                                }
                            }
                            console.log('Successfully deleted '+ path+file+'\n');
                        });
                        if(index == arr.length - 1) ;
                    }
                });
            }

        });
        var path_image = path+'image/';
        fs.readdir(path_image, function(err, images){
            if(err){
                console.log('User image directory already is removed.');
                res.send('User image directory already is removed.');
                return;
            }else{
                images.forEach(function(image, index, arr){
                    console.log('rm-image-name : '+ image);
                    fs.unlink(path_image+image, function(err){
                        if(err) {
                            try {
                                throw err;
                            } catch ( err ){
                                console.log( 'image remove : ' + err );
                                res.send("User image file remove : " + err);
                                return;
                            }
                        }
                        console.log('Successfully deleted '+ path+image+'\n');
                    });
                    if(index == arr.length -1);
                });
            }
        });
        user.remove();
        res.send('User remove success');
    });
}