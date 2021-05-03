const uuid = require('uuid').v4;

before(async()=>{
  console.log('Tests started.');
  
  //setup test db
  // try{
  //   process.env.PG_TEST_IMAGE = "postgres:13.2-alpine";
  //   const setup = require('../node_modules/@databases/pg-test/lib/jest/globalSetup.js')
  //   await setup();
  //   console.info(`TESTDB: ${process.env.DATABASE_URL}`);
  // } catch(ex) {
  //   console.error(ex);
  // }

  // set the test variables
  process.env.SKIP_MAIL = true;
  process.env.COOKIE_SECRET= uuid();
  process.env.JWT_SECRET= uuid();

  const app = require('../src/app.js');
  global.app = app;
  // const dbsetup = require('../src/db.js').setup;

  // await dbsetup(app.db);

  // const tq=await app.db.query("SELECT * from users");
  // console.log(tq.rowCount);
});

after(async()=>{
  global.app=undefined;
  console.log('Tests finished.')
})