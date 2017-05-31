// app/routes.js

var request = require('request');

module.exports = function(app, passport) {

    var Pokemon  = require('./models/pokemon');
    var pokemonList = '';
    Pokemon.find(function (err, pokemons){
            if (err)
                

            pokemonList = pokemons;
        })

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });
    app.get('/admin',isLoggedIn, function(req, res){
        Pokemon.find(function (err, pokemons){
            if (err)
                res.send(err);

            res.render('crud.hbs',{pokemons: pokemons});
        })


    });
    app.get('/admin/create',isLoggedIn, function(req, res){

            res.render('createPokemon.hbs');

    });
    app.get('/admin/update/:id',isLoggedIn, function(req, res){


        let pokemon = new Pokemon();

        Pokemon.findById(req.params.id, function (err, pokemon) {
            if (err) {
                res.render('404');
            }

            res.render('updatePokemon.hbs', {
                pokemon: pokemon
            });
        })


    });
    app.post('/admin/update/pokemon/:id',isLoggedIn, function(req, res){

        let pokemon = new Pokemon();

        if(!req.body.name
            || !req.body.longitude
            || !req.body.latitude){
            res.status(400);
            res.json({message: 'bad request'});
        }
        else{
            Pokemon.findById(req.params.id, function(err, pokemon) {
                if (err)
                    res.json(err);

                pokemon.name = req.body.name;
                pokemon.longitude = req.body.longitude;
                pokemon.latitude = req.body.latitude;

                pokemon.save(function(err) {
                    if (err)
                        res.json(err);

                    res.render('updatePokemon.hbs', {
                        pokemon: pokemon
                    });                });
            })
        }


    });
    app.get('/admin/pokemon/delete/:id',isLoggedIn, function(req, res){


                request.delete('http://localhost:8080/api/pokemons/'+req.params.id).on('response',function (response) {
                    Pokemon.find(function (err, pokemons){
                        if (err){
                            res.render('crud.hbs',{pokemons: pokemons, msg: "Pokemon deleted"});



                        }
                         })});



    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {

        res.render('profile.ejs', {
            user : req.user, // get the user out of session and pass to template
            
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
        // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

};



// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}