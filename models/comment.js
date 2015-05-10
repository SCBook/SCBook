/**
 * Created by redball on 15. 4. 8.
 */
var mongoose = require('mongoose');

module.exports = mongoose.model('comment', {
    post_name: { type : String },
    contents : { type : String },
    scrap_path : { type : String },
    comment_date : { type : String },
    index : { type : Number }
});