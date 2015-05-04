/**
 * Created by redball on 15. 4. 8.
 */
var mongoose = require('mongoose');

module.exports = mongoose.model('keyword', {
    keyword_name : { type : String },
    repeat : { type : Number },
    path : { type : String },
    keyword_date : { type : String },
    keyword_bit : {type : Number}
});