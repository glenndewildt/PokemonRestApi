var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();

var app = require('express')();
var pokerouter = require('./pokerouter.js');
var Pokemon = require('./models/pokemon.js')
app.use('/', pokerouter);

function makeRequest(route, statusCode, done){
	request(app)
		.get(route)
		.expect(statusCode)
		.end(function(err, res){
			if(err){ return done(err); }

			done(null, res);
		});
};

describe('Testing poke route', function(){
	describe('without params', function(){
		it('Should be able to get pokemon', function(done){
			var pokemon = new Pokemon();      // create a new instance of the Bear model
        		pokemon.name = 'Testpokemon';  
        		pokemon.longitude = 11.11;
        		pokemon.latitude = 12.12;


			makeRequest('/pokemons', 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body).to.have.property('name');
				expect(res.body.name).to.not.be.undefined;
				done();
			});
		});
	});

	describe('with invalid params', function(){
		it('should return invalid', function(done){
			makeRequest('/pokemons/asdasd', 400, done);
		});
	});

	

});

