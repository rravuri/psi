const host = process.env['DB_HOST'];
const port = process.env['DB_PORT'];
const user = process.env['DB_USER'];
const password = process.env['DB_PASSWORD'];
const database = process.env['DB_DB'];

const { Pool } = require('pg')
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${user}:${password}@${host}:${port}/${database}`,
});

const setup = async (db)=>{
  return db.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS users (
      id            UUID DEFAULT uuid_generate_v4 (),
      email         VARCHAR(100) NOT NULL,

      oid           BIGINT,
      firstname     VARCHAR(100),
      middlename    VARCHAR(64),
      lastname      VARCHAR(100),
      gender        VARCHAR(8),

      PRIMARY KEY (id),
      UNIQUE(email)
    );

    CREATE TABLE IF NOT EXISTS tokens (
      userid        UUID REFERENCES users(id) ON DELETE CASCADE,
      token         VARCHAR NOT NULL,
      createdat     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      verifiedat    TIMESTAMP WITH TIME ZONE DEFAULT NULL,
      verifiedfrom  JSONB
    );

    CREATE TABLE IF NOT EXISTS snapshots (
      sdate         DATE,
      userid        UUID REFERENCES users(id) ON DELETE CASCADE,

      title         VARCHAR(64),
      careerstage   VARCHAR(64),
      capability    VARCHAR(32),
      pc            VARCHAR(64),
      isContractor  BOOLEAN,
      supervisor    VARCHAR(128),
      supervisoroid BIGINT,

      joiningdate   DATE,
      homeregion    VARCHAR(12),
      currentregion VARCHAR(12),
      status        VARCHAR(32),
      lastpromoted  DATE,

      bu            VARCHAR(12),
      team          VARCHAR(32),
      pid           BIGINT,
      clientname    VARCHAR(128),
      projectname   VARCHAR(128),

      CONSTRAINT userid_sdate PRIMARY KEY(sdate,userid)

    );

  `);
}

module.exports = { 
  pool,
  setup
};