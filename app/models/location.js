/**
 * Created by Glenn on 23-3-2017.
 */
// app/models/location.js

//local variable
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var LocationSchema   = new Schema({
    longatude: int,
    latetude: int


});



module.exports =  mongoose.model('Lacation', LocationSchema);