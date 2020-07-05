const should = require('chai').should(); // eslint-disable-line no-unused-vars
const request = require('supertest');
const app = require('../app');
const { setupDB } = require("./test-setup");
const CacheModel = require('../models/cacheModel')
const { generateTtl, generateRandomString, handleCacheLimit } = require('../utils/common')



setupDB('testdb')

//  testsuite
describe('Testing to check Cache Endpoints', function()
{

  //  testcase
  it('Should return the cached data for a given key', async function(done)
  {
      cacheModel = new CacheModel({
          key: 'key1',
          value: 'test',
          ttl: generateTtl(),
          createdAt: new Date().getTime()
      })
      await cacheModel.save()
    request(app)
      .get('/api/v1/cache/key1')
      .expect(200)
      .end((error, response) => {
        if(error) return done(error);
        const res = response.text;
        res.should.not.equal(null, 'response should contain a text message');
        res.data.should.equal('test', 'Should return key value')
        done();
      });   
  });
});