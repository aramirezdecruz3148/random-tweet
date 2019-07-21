require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
// const Tweet = require('../lib/models/Tweet')

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

  it('can create a tweet', () => {
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
});
