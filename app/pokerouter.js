var express = require('express');
var pokerouter = express.Router();

var mongoose = require('mongoose');
var Pokemon  = require('./models/pokemon');
var https = require('https');

//model pokemon
var Pokemon  = require('./models/pokemon');
pokerouter.route('/pokemons')

// create a pokemon
pokerouter.post((function(req,res){
    var pokemon = new Pokemon();      // create a new instance of the Bear model
    pokemon.name = req.body.name;  // set the bears name (comes from the request)

    pokemon.longitude = req.body.longitude;
    pokemon.latitude = req.body.latitude;


    // save the bear and check for errors
    pokemon.save(function(err) {
        res.json({  message: 'Pokemon: '+req.body.name+' created! longitude: '+req.body.longitude});
                });
            }))


//deletes pokemon
pokerouter.delete('/:id',(function(req, res){
        Pokemon.findById(req.params.id , function (err, pokemon){
            if (err)
                res.send(err);

            res.json(pokemon);
        }).remove().exec();
}))
//updates pokemon
pokerouter.put('/:id',(function(req, res){
    if(!req.body.name
        || !req.body.longitude
        || !req.body.latitude){
        res.status(400);
        res.json({message: 'bad request'});
    }
    else{
        Pokemon.findById(req.body.id, function(err, pokemon) {
            if (err)
                res.send(err);

            pokemon.name = req.body.name;
            pokemon.longitude = req.body.longitude;
            pokemon.latitude = req.body.latitude;

            pokemon.save(function(err) {
                if (err)
                    res.send(err);

                res.json({  message: 'Pokemon: '+req.body.name+' updated! longitude: '+req.body.longitude});
            });
        })
    }
       
}))


//export this router to use in our index.js
module.exports = pokerouter;