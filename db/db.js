const mysql = require("mysql2");

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root', // MySQL username,
      password: '', // MySQL password
      database: 'hwk12_db'
    },
    console.log(`Connected to the courses_db database.`)
  );

module.exports = db;