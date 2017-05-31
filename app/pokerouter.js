var express = require('express');
var pokerouter = express.Router();

var mongoose = require('mongoose');
var Pokemon  = require('./models/pokemon');
var https = require('https');

//model pokemon
var Pokemon  = require('./models/pokemon');
pokerouter.route('/pokemons')

// create a pokemon
    .post(function(req,res){
    console.log("HOI");
    var pokemon = new Pokemon();      // create a new instance of the Bear model
    pokemon.name = req.body.name;  // set the bears name (comes from the request)

    pokemon.longitude = req.body.longitude;
    pokemon.latitude = req.body.latitude;


    // save the bear and check for errors
    pokemon.save(function(err) {
        res.json({  message: 'Pokemon: '+req.body.name+' created! longitude: '+req.body.longitude});
                });
            })



//deletes pokemon
pokerouter.delete('/pokemons/:id', function(req, res){
        Pokemon.findByIdAndRemove(req.params.id , function (err, pokemon){
            if (err)
                res.json(err);

        });
    res.json();


})

//updates pokemon
pokerouter.put('/pokemons/:id',function(req, res){
    if(!req.body.name
        || !req.body.longitude
        || !req.body.latitude){
        res.status(400);
        res.json({message: 'bad request'});
    }
    else{
        Pokemon.findById(req.body.id, function(err, pokemon) {
            if (err)
                res.json(err);

            pokemon.name = req.body.name;
            pokemon.longitude = req.header().longitude;
            pokemon.latitude = req.body.latitude;

            pokemon.save(function(err) {
                if (err)
                    res.json(err);

                console.log("Save");

                res.json({  message: 'Pokemon: '+req.body.name+' updated! longitude: '+req.body.longitude});
            });
        })
    }
    res.send("respond with a resource");


})
pokerouter.get('/pokemons/:id', function(req, res) {
    let pokemon = new Pokemon();

    Pokemon.findById(req.params.id, function (err, pokemon) {
        if (err) {
            res.json('Pokemon not found');
        }
        res.json(pokemon);

    })
    res.send("respond with a resource");

})

//export this router to use in our index.js
module.exports = pokerouter;