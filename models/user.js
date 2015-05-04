/**
 * Created by chs-redball on 15. 2. 25.
 */
var mongoose = require('mongoose');
module.exports = mongoose.model('User', {
    username : String,
    password : String,
    email : String,
    Keywords : [String],
    Scraps : [String]
});