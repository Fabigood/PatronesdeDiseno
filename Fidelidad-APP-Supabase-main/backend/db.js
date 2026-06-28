const { Pool } = require('pg');
require('dotenv').config();

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect()
  .then(client => {
    console.log('Conectado a Supabase PostgreSQL');
    client.release();
  })
  .catch(err => {
    console.error('Error PostgreSQL:', err.message);
  });

module.exports = db;