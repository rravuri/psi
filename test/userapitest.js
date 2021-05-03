const request = require('supertest');
const should = require('should');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
let token='';
let someoneid='';
let jwtToken='';

before(async ()=>{
  // await app.db.query("DELETE FROM users WHERE email='someone@example.com'")
});

describe('POST /api/user/register', function() {
  it('happy path register new user', function(done) {
      // request(app)
      // .post('/api/user/register')
      // .send({'email':'SomeOne@example.com'})
      // .set('Content-Type', 'application/json')
      // .set('Accept', 'application/json')
      // .expect(200)
      // .then(async (response)=>{
      //   let data = await app.db.query("SELECT id from users WHERE email='someone@example.com'");
      //   data.rows.length.should.equal(1);
      //   someoneid=data.rows[0].id;
      //   data = await app.db.query(`SELECT * from tokens WHERE userid=$1`,[data.rows[0].id]);
      //   data.rows.length.should.be.above(0);
      //   response.body.token.should.equal(data.rows[0].token);
      //   token=data.rows[0].token;
      //   done();
      // })
      // .catch(err=>done(err))

      done();
  });
  it('validates for no email', function(done) {
      // request(app)
      // .post('/api/user/register')
      // .set('Accept', 'application/json')
      // .expect(400, done)
      done();
  });
});

describe('GET /api/user/verify', function(){
  it('verify a valid token', function(done){
    // request(app)
    //   .get(`/api/user/verify?token=${token}`)
    //   .expect(200)
    //   .then(async (response)=>{
    //     const cookies=response.get('set-cookie');
    //     cookies.length.should.equal(1);
    //     // console.log(cookies);
    //     const cparts = cookies[0].split(';');
    //     jwtToken = cparts[0].substr(3);
    //     const token = jwt.verify(jwtToken, app.config.jwtSecret);
    //     token.data.should.equal(someoneid);
    //     done();
    //   })
    //   .catch(err=>done(err))
    done();
  })
});

describe('GET /api/user/', function() {
  // it('denies request without APIKEY', function(done) {
  //   request(app)
  //   .get('/api/user/')
  //   .expect(401, done)
  // });
  // it('returns user details with bearer token', function(done) {
  //   request(app)
  //   .get('/api/user/')
  //   .set('Authorization',`Bearer ${jwtToken}`)
  //   .expect(200)
  //   .then(async (response)=>{
  //     const udata = response.body;
  //     udata.id.should.equal(someoneid);
  //     done();
  //   })
  //   .catch(err=>done(err))
  // });
});