/**
 * Created by Glenn on 23-3-2017.
 */
// app/models/location.js

//local variable
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var LocationSchema   = new Schema({
    longitude: double,
    latitude: double,
});



module.exports =  mongoose.model('location', LocationSchema);