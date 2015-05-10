/**
 * Created by redball on 15. 4. 8.
 */
var mongoose = require('mongoose');

module.exports = mongoose.model('keyword', {
    username : { type : String },
    keyword_name : { type : String },
    weight : { type : Number },
    path : { type : String },
    keyword_date : { type : String },
    parents_path : { type : String }
});