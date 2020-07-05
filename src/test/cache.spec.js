const should = require('chai').should(); // eslint-disable-line no-unused-vars
const expect = require('chai').expect
const request = require('supertest');
const app = require('../app');
const { setupDB } = require("./test-setup");
const CacheModel = require('../models/cacheModel')
const { generateTtl, generateRandomString, handleCacheLimit } = require('../utils/common')



setupDB('fashion-cloud-api-testdb')

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
      cacheModel.save((err) => {
          if(err) { return done(); }
          // throw new Error('Should generate error!');
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

      })
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

    it('Should return all stored keys in the cache', function(done)
    {
        cacheModel = new CacheModel({
            key: 'key3',
            value: 'test3',
            ttl: generateTtl(),
            createdAt: new Date().getTime()
        })
        cacheModel.save()
        request(app)
            .get('/api/v1/cache/')
            .expect(200)
            .end((error, response) => {
                if(error) return done(error);
                const res = response.body;
                console.log('res ==>', res)
                res.should.not.equal(null, 'response should contain a text message');
                expect(res.data.length).equal(1);
                expect(res.data[0]).equal('key3');
                expect(res.message).equal('Cached keys retrieved successfully!');
                done();
            });
    });
    it('Should return empty array if no stored keys in the cache', function(done)
    {
        request(app)
            .get('/api/v1/cache/')
            .expect(200)
            .end((error, response) => {
                if(error) return done(error);
                const res = response.body;
                res.should.not.equal(null, 'response should contain a text message');
                expect(res.data.length).equal(0);
                expect(res.message).equal('Cached keys retrieved successfully!');
                done();
            });
    });
    it('Should update the data for a given key', function(done)
    {
        request(app)
            .post('/api/v1/cache/key4')
            .send({
                value: 'test4'
            })
            .expect(201)
            .end((error, response) => {
                if(error) return done(error);
                const res = response.body;
                expect(res.message).equal('Key is added successfully!');
                done();
            });
        let cacheDoc = CacheModel.findOne({ key: 'key4' })
        expect(cacheDoc).to.be.an('object');
    });
});