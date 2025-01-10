const { Pool } = require('pg');

const pool = new Pool({
    user: 'form_user',
    host: 'localhost',
    database: 'form_db',
    password: 'password123',
    port: 5432, // Default PostgreSQL port
});

module.exports = pool;
