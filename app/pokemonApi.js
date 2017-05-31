var express = require('express');
var pokemonApi = express.Router();

var mongoose = require('mongoose');
var Pokemon  = require('./models/pokemon');
var https = require('https');

//model pokemon

pokemonApi.route('/pokemonApi')


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

//export this router to use in our index.js
module.exports = pokemonApi;