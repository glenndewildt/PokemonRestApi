var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();

var app = require('express')();
var pokerouter = require('../pokerouter');
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

describe('get pokemon test', function(){
	describe('without params', function(){
		it('should return list of pokemon', function(done){
			
			makeRequest('/pokemon', 200, function(err, res){
				if(err){ return done(err); }

				expect(res.status).to.equal(expectedString);
				done();
			});
		});
	});
});

