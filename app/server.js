/**
 * Created by Glenn on 21-3-2017.
 */
// server.js

var https = require('https');
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var cors = require('cors');
const exphbs = require('express-handlebars');




//passport vars
var flash    = require('connect-flash');
var passport = require('passport');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        select: function(selected, options) {
            return options.fn(this).replace(
                new RegExp(' value=\"' + selected + '\"'),
                '$& selected="selected"');
        },
    }
});

//mongoose setup
var mongoose   = require('mongoose');
var configDB = require('./config/database.js');
var pokerouter = require('./pokerouter.js');

mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration
// onze folderstructuur is anders pas op

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

//app.get('*', function(req, res){
//    res.send('Sorry, this is an invalid URL.');
//});

var port = process.env.PORT || 8080;        // set our port

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api

require('./routes.js')(app, passport);
//app.use('/mon', router);
app.use('/api', pokerouter);

// voor als de router werkt? require('./routes.js')(app, passport); // load our routes and pass in our app and fully

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);