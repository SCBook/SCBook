/**
 * Created by hansol on 15. 5. 9.
 */
exports.CommentCreate = function(req, res){
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

exports.CommentRead = function(req, res){
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

exports.CommentUpdate = function(req, res){

}

exports.CommentDelete = function(req, res){

}