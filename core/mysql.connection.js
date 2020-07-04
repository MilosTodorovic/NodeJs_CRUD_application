exports.MysqlConnection = function () {
    const mysql = require('mysql');

    let dbcon = mysql.createConnection({
        host: 'localhost',
        user: 'nonreldb',
        password: '242242',
        database: 'TEST'
    });

    dbcon.connect((err) => {
        if (!err) {
            console.log('MySQL database is successfully connected!');
        } else {
            console.log(err);
        }
    });

    return dbcon;
}