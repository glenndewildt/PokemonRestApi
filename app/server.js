/**
 * Created by Glenn on 21-3-2017.
 */
// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var https = require('https');
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var cors = require('cors');

var flash    = require('connect-flash');
var passport = require('passport');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

//mongoose setup
var mongoose   = require('mongoose');
var configDB = require('./config/database.js');

mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration
// onze folderstructuur is anders pas op

//Our models
var Pokemon     = require('./models/pokemon');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating


// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session



var port = process.env.PORT || 8080;        // set our port


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');

    next(); // make sure we go to the next routes and don't stop here
});



// on routes that end in /bears
// ----------------------------------------------------



router.route('/pokemons')


    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {

        var pokemon = new Pokemon();      // create a new instance of the Bear model
        pokemon.name = req.body.name;  // set the bears name (comes from the request)

        pokemon.longatude = 1.151515;
        pokemon.latetude = 2.251514141241241241241;

        // save the bear and check for errors
        pokemon.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Pokemon created!' });
        });

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

//routes for pokemons on the mapp
router.route('/pokemons/pokemonLocations')
//gets all pokemons from the PokemonApi
    .get(function(req, res) {
        Pokemon.find(function (err, pokemons) {
            if (err)
                res.send(err);

            res.json(pokemons);
        })
    })
    //post a new pokemon with location
    .post(function(req, res) {

    var pokemon = new Pokemon();      // create a new instance of the Bear model
    pokemon.name = req.body.name;  // set the bears name (comes from the request)

    pokemon.longatude = req.body.longatude;
    pokemon.latetude = req.body.latetude;

    // save the bear and check for errors
    pokemon.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Pokemon created!' });
    });

});


// on routes that end in /pokemon/:pokemon_id
// ----------------------------------------------------
router.route('/pokemons/:pokemon_id')
// get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
         https.get({
            host: 'pokeapi.co',
            path: '/api/v2/pokemon/'+req.params.pokemon_id+'/',
            method: 'GET'
        }, function(response) {
            // Continuously update stream with data
            var body = '';
            response.on('data', function (d) {
                body += d;

            });
            response.on('end', function () {

                // Data reception is done, do whatever with it!
                console.log(req.params.pokemon_id);
                console.log(body);

                try {
                    var parsed = JSON.parse(body);
                    res.json(parsed);
                } catch(e) {
                    console.log('malformed request', body);
                    return res.status(400).send('malformed request: ' + body);
                }

            });
        });

    })


// update the pokemon with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
.put(function(req, res) {

    // use our bear model to find the bear we want
    Pokemon.findById(req.params.pokemon_id, function(err, pokemon) {

        if (err)
            res.send(err);

        pokemon.name = req.body.name;  // update the bears info

        // save the bear
        pokemon.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Pokemon updated!' });
        });

    })
    // delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
    .delete(function(req, res) {
        Pokemon.remove({
            _id: req.params.pokemon_id
        }, function(err, pokemon) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
    //closing tag /pokemon/:pokemon_id
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
require('./routes.js')(app, passport);
app.use('/api', router);
// voor als de router werkt? require('./routes.js')(app, passport); // load our routes and pass in our app and fully


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);