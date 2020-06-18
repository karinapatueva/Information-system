const mysql = require("mysql");
const pool = mysql.createPool({
    host: "std-mysql.ist.mospolytech.ru",
    user: "std_227",
    database: "std_227",
    password: "12345678"
});

module.exports = pool

