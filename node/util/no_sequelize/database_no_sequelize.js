const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'mysql_host',
  user: 'root',
  database: 'node-complete',
  password: 'example',
});

module.exports = pool.promise();
