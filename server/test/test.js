var assert = require('assert');
var request = require('supertest');
var app = require('../app');

//
describe('GET /todo', function() {
  it('responds with json', function(done) {
    request(app)
      .get('/todo')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('POST /api/account/signin', function() {
  it('responds with json', function(done) {
    request(app)
      .post('/api/account/signin')
      .send({
        email: 'l@l.com',
        password: 'eeee'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
