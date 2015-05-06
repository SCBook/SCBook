/**
 * Created by chs-redball on 15. 2. 25.
 */
var mongoose = require('mongoose');
module.exports = mongoose.model('User', {
    username : String,
    password : String,
    email : String,
    title : String,
    path_profile_image : String,
    nickname : String,
    friends : [String],
    Keywords : [String],
    Scraps : [String]
});