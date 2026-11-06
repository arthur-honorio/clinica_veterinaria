const { Pool } = require("pg");

const poll = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = poll;
