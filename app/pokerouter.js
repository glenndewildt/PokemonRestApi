var express = require('express');
var pokerouter = express.Router();

var mongoose = require('mongoose');
var Pokemon  = require('./models/pokemon');
var https = require('https');

//model pokemon
var Pokemon  = require('./models/pokemon');



/**
 * @swagger
 * definition:
 *   Pokemon:
 *     required:
 *       -latitude
 *       -longitude
 *     properties:
 *       name:
 *         type: string
 *         example: Venusaur
 *       type:
 *         type: string
 *         example: Grass
 *       longitude:
 *         type: integer
 *         example: '71.49'
 *       latitude:
 *         type: string
 *         example: '34.16'
 */

/**
 * @swagger
 * /pokemons:
 *   post:
 *     tags:
 *       - Pokemon
 *     summary: Add a new pokemon 
 *     description: Adds a single pokemon
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - in: "body"
 *         name: "name"
 *         description: "name pokemon to be added"
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Pokemon'
 *     responses:
 *       '200':
 *         description: "successful operation"
 *       '400':
 *           description: "Invalid ID supplied"
 */
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



/**
 * @swagger
 * '/pokemons/{pokemonid}':
 *   delete:
 *     tags:
 *       - Pokemon
 *     summary: Delete by ID
 *     description: Deletes a single pokemon
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - name: "pokemonID"
 *         in: "path"
 *         description: "ID of pokemon to delete"
 *         required: true
 *         type: "integer"
 *         format: "int64"
 *     responses:
 *       '200':
 *         description: "succesfully deleted"
 *       '400':
 *           description: "Invalid ID supplied"
 */
pokerouter.delete('/pokemons/:id', function(req, res){
        Pokemon.findByIdAndRemove(req.params.id , function (err, pokemon){
            if (err)
                res.json(err);

        });
    res.json();


})

/**
 * @swagger
 * '/pokemons/{pokemonid}':
 *   put:
 *     tags:
 *       - Pokemon
 *     summary: Update pokemon by ID
 *     description: Updates a single pokemon
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - name: "pokemonID"
 *         in: "path"
 *         description: "ID of pokemon to update"
 *         required: true
 *         type: "integer"
 *         format: "int64"
 *     responses:
 *       '200':
 *         description: "successful operation"
 *         schema:
 *           $ref: '#/definitions/Pokemon'
 *       '400':
 *           description: "Invalid ID supplied"
 */
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
                res.status(200);
                res.json({  message: 'Pokemon: '+req.body.name+' updated! longitude: '+req.body.longitude});
            });
        })
    }
    res.send("respond with a resource");


})

/**
 * @swagger
 * '/pokemons/{pokemonid}':
 *   get:
 *     tags:
 *       - Pokemon
 *     summary: Find pokemon by ID
 *     description: Returns a single pokemon
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - name: "pokemonID"
 *         in: "path"
 *         description: "ID of pokemon to return"
 *         required: true
 *         type: "integer"
 *         format: "int64"
 *     responses:
 *       '200':
 *         description: "successful operation"
 *         schema:
 *           $ref: '#/definitions/Pokemon'
 *       '400':
 *           description: "Invalid ID supplied"
 */
pokerouter.get('/pokemons/:id', function(req, res) {
    let pokemon = new Pokemon();

    Pokemon.findById(req.params.id, function (err, pokemon) {
        if (err) {
            res.json('Pokemon not found');
        }
        res.status(200);
        res.json(pokemon);

    })

})
/**
 * @swagger
 * /pokemons:
 *   get:
 *     tags:
 *       - Pokemon
 *     summary: Find pokemons
 *     description: Returns all pokemon
 *     produces:
 *       - "application/json"
 *     parameters:
 *     responses:
 *       '200':
 *         description: "successful operation"
 *         schema:
 *           $ref: '#/definitions/Pokemon'
 *       '400':
 *           description: "Invalid ID supplied"
 */
pokerouter.get('/pokemons', function(req, res) {


    Pokemon.find(function (err, pokemon) {
        if (err) {
            res.status(400);
            res.json('Pokemon not found');
        }
        res.status(200);
        res.json(pokemon);

    })
    

})

//export this router to use in our index.js
module.exports = pokerouter;