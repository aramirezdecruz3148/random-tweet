require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Tweet = require('../lib/models/Tweet');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a tweet if random is false', () => {
    return request(app)
      .post('/api/v1/tweets')
      .send({
        handle: '@something-cool-as-hell',
        text: 'I am cool as HELL!'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          handle: '@something-cool-as-hell',
          text: 'I am cool as HELL!',
          __v: 0
        });
      });
  });

  it('can create a tweet using random Ron Swanson quote if random is true', async() => {
    return request(app)
      .post('/api/v1/tweets?random=true')
      .send({
        handle: '@something-cool-as-hell',
        text: ''
      })
      .then(res => {
        // eslint-disable-next-line no-console
        console.log(res.body);
        expect(res.body).toEqual({
          _id: expect.any(String),
          handle: '@something-cool-as-hell',
          text: expect.any(String),
          __v: 0
        });
      });
  });

  it('can get all tweets', async() => {
    const tweet = await Tweet.create([
      { 
        handle: '@something-cool-as-hell',
        text: 'I am cool as HELL!' 
      }, 
      {
        handle: '@something-cool-as-hell',
        text: 'I am cool as HELL!' 
      },
      { 
        handle: '@something-cool-as-hell',
        text: 'I am cool as HELL!' 
      }]);

    return request(app)
      .get('/api/v1/tweets')
      .then(res => {
        const tweetsJSON = JSON.parse(JSON.stringify(tweet));
        tweetsJSON.forEach(tweet => {
          expect(res.body).toContainEqual({ handle: tweet.handle, text: tweet.text, _id: tweet._id });
        });
      });
  });

  it('can get a tweet by id', async() => {
    const tweet = await Tweet.create({ 
      handle: '@something-cool-as-hell',
      text: 'I am cool as HELL!' 
    });

    return request(app)
      .get(`/api/v1/tweets/${tweet._id}`) 
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          handle: '@something-cool-as-hell',
          text: 'I am cool as HELL!'
        });
      });
  });

  it('can update a tweets text', async() => {
    const tweet = await Tweet.create({ 
      handle: '@something-cool-as-hell',
      text: 'I am cool as HELL!' 
    });

    return request(app)
      .patch(`/api/v1/tweets/${tweet._id}`)
      .send({ text: 'seriously though' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          handle: '@something-cool-as-hell',
          text: 'seriously though'
        });
      });
  });

  it('can delete a tweet', async() => {
    const tweet = await Tweet.create({ 
      handle: '@something-cool-as-hell',
      text: 'I am cool as HELL!' 
    });

    return request(app)
      .delete(`/api/v1/tweets/${tweet._id}`)
      .then(res => {
        expect(res.body.text).toEqual('I am cool as HELL!');
      });
  }); 
});
