var express = require('express');
var pokerouter = express.Router();

var mongoose = require('mongoose');
var Pokemon  = require('./models/pokemon');
var https = require('https');

//model pokemon

pokerouter.route('/pokemons')

    // create a pokemon
    .post(function(req, res) {
        //|| !req.headers.longitude.toString().match(/^[0-9]{4}$/g) nog de juiste regex vinden voor lon/lat
        if(!req.headers.name 
            || !req.headers.longitude 
            || !req.headers.latitude){
            res.status(400);
            res.json({message: 'bad request'});
        }
        else{
        var pokemon = new Pokemon();      // create a new instance of the Bear model
        pokemon.name = req.headers.name;  // set the bears name (comes from the request)

        pokemon.longitude = req.headers.longitude;
        pokemon.latitude = req.headers.latitude;


        // save the bear and check for errors
        pokemon.save(function(err) {
            if (err)
                res.send(err);

            res.json({  message: 'Pokemon: '+req.headers.name+' created! longitude: '+req.headers.longitude});
        });
        }

    

})
    //gets all pokemons from the PokemonApi
.get(function(req, res) {
    return https.get({
        host: 'pokeapi.co',
        path: '/api/v2/pokemon/?limit='+req.query.limit+"&offset="+req.query.offset+'',
        method: 'GET'
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {
       console.log(req.query.limit);

            // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);
            res.json(parsed);
        });
    });
});

pokerouter.get('/pokemonLocations',(function(req, res){
        Pokemon.find(function (err, pokemons){
            if (err)
                res.send(err);

            res.json(pokemons);
        })
}))
pokerouter.get('/pokemonLocations/:id',(function(req, res){
        Pokemon.findById(req.params.id , function (err, pokemon){
            if (err)
                res.send(err);

            res.json(pokemon);
        })
}))
pokerouter.put('/pokemonLocations/:id',(function(req, res){
    if(!req.headers.name 
            || !req.headers.longitude 
            || !req.headers.latitude){
            res.status(400);
            res.json({message: 'bad request'});
        }
        else{
            Pokemon.findById(req.params.id, function(err, pokemon) {
        if (err)
            res.send(err);

            pokemon.name = req.headers.name;
            pokemon.longitude = req.headers.longitude;
            pokemon.latitude = req.headers.latitude;

            pokemon.save(function(err) {
            if (err)
                res.send(err);

            res.json({  message: 'Pokemon: '+req.headers.name+' updated! longitude: '+req.headers.longitude});
        });
        })       
        }
       
}))
pokerouter.delete('/pokemonLocations/:id',(function(req, res){
    
            Pokemon.findById(req.params.id, function(err, pokemon) {
        if (err)
            res.send(err);

           if(pokemon){
            pokemon.remove({
            _id: req.params.id
            })
            res.json({message:'pokemon deleted'});
        }else{
            res.json({message:'no pokemon with id: '+req.params.id})
        }
            
           
        })       
        
       
}))








//export this router to use in our index.js
module.exports = pokerouter;