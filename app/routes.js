// app/routes.js
var http = require('http');

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

            res.render('crud.hbs',{pokemons: pokemons, error: null});
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
    app.get('/admin/pokemon/delete/:id',isLoggedIn, function(req, res){

        http.get({
                host: 'localhost',
                 port:8080,
                path: 'api/pokemons/'+req.params.id,
                method: 'DELETE'
            }, function(response) {
                // Continuously update stream with data
                var body = '';
                response.on('data', function (d) {
                    body += d;
                });
                response.on('end', function () {
                    console.log(req.query.limit);

                    // Data reception is done, do whatever with it!

                });
            });
        Pokemon.find(function (err, pokemons){
            if (err)
                res.send(err);

            res.render('crud.hbs',{pokemons: pokemons, msg: "Pokemon Deleted"});
        })


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