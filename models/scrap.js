/**
 * Created by redball on 15. 4. 8.
 */
var mongoose = require('mongoose');

module.exports = mongoose.model('scrap', {
    keyword1 : { type : String },
    keyword2 : { type : String },
    keyword3 : { type : String },
    path_image : { type : String },
    comments : [String],
    url: { type : String },
    path : { type : String },
    sentence : { type : String },
    scrap_date : { type : String },
    scrap_weight : { type : Number },
    scrap_bit : {type : Number}
});