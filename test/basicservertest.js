const request = require('supertest');
const should = require('should');

describe('GET /ping', function() {
    it('responds with pong', function(done) {
        request(app)
        .get('/ping')
        .expect('Content-Type', /text/)
        .expect(200)
        .then(response => {
          response.text.should.equal('pong');
          done();
        })
        .catch(err=>done(err));
    });
});
describe('GET /api-docs', function() {
    it('responds with swagger ui html', function(done) {
        request(app)
        .get('/api-docs/')
        .expect('Content-Type', /html/)
        .expect(200)
        .then(response => {
          // response.text.should.equal('pong');
          done();
        })
        .catch(err=>done(err));
    });
});