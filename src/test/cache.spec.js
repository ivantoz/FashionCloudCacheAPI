const should = require('chai').should(); // eslint-disable-line no-unused-vars
const request = require('supertest');
const app = require('../app');

//  testsuite
describe('Testing to check Cache Endpoints', function()
{
  //  testcase
  it('Should return the cached data for a given key', function(done)
  {
    request(app)
      .get('/api/v1/healthcheck')
      .expect(200)
      .end((error, response) => {
        if(error) return done(error);
        const res = response.text;
        res.should.not.equal(null, 'response should contain a text message');
        res.should.equal('API is up and running', 'Should return working message')  
        done();
      });   
  });
});