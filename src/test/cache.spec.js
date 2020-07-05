const should = require('chai').should(); // eslint-disable-line no-unused-vars
const expect = require('chai').expect
const request = require('supertest');
const app = require('../app');
const { setupDB } = require("./test-setup");
const CacheModel = require('../models/cacheModel')
const { generateTtl, generateRandomString, handleCacheLimit } = require('../utils/common')



// setupDB('testdb')

//  testsuite
describe('Testing to check Cache Endpoints', function()
{
  //  testcase
  it('Should return the cached data for a given key', function(done)
  {
      cacheModel = new CacheModel({
          key: 'key1',
          value: 'test',
          ttl: generateTtl(),
          createdAt: new Date().getTime()
      })
      cacheModel.save()

    request(app)
      .get('/api/v1/cache/key1')
      .expect(200)
      .end((error, response) => {
        if(error) return done(error);
        const res = response.body;
        // console.log(res.data)
        res.should.not.equal(null, 'response should contain a text message');
        res.data.should.equal('test');
        expect(res.data).equal('test');
        done();
      });
  });
  it('Should return random string If the key is not found in the cache', function(done)
    {
        request(app)
            .get('/api/v1/cache/key2')
            .expect(200)
            .end((error, response) => {
                if(error) return done(error);
                const res = response.body;
                res.should.not.equal(null, 'response should contain a text message');
                expect(res.data).to.be.a('string');
                expect(res.message).equal('Key retrived successfully!');
                done();
            });
    });
});