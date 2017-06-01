var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();

var app = require('express')();
var pokerouter = require('../pokerouter.js');
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

describe('Pokemon route test', function(){
	describe('without params', function(){
		it('should not post a pokemon and return 400', function(done){
			
			makeRequest('/pokemon', 400, function(err, res){
				if(err){ return done(err); }

				
				expect(res.body.date).to.be.undefined;
				
				done();
			});
		});
	});
});