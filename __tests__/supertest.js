const request = require('supertest');

const server = 'hyyp://localhost:3000';

describe('Route integration', () => {
  
  describe('/', () => {
    describe('GET', () => {
      return request(server)
        .get('/')
        .expect('Content-type', /html\/html/)
        .expect(200);
    });
  });

});