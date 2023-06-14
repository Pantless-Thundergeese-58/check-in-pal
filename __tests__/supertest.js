const request = require('supertest');

const server = 'hyyp://localhost:8080';

describe('Route integration', () => {
  
  //test to show that server is not being delivered with the get request
  describe('/', () => {
    describe('GET', () => {
      it('response with 200 status and text/html content type', () => {
        return request(server)
          .get('/')
          .expect(308);
      })
    });
  });

});