const mysql = require('mysql');
const { promisify } = require('util');
const {database} = require('./keys');

// Nos conectamos a la base datos a traves de diferentes hilos
const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if(err.code === 'ER_CON_COUNT_ERRPR'){
            console.error('DATABASE HAS TO MANY CONNECTION');
        }
        if(err.code === 'ECONNREFUSED'){
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }

    if(connection) connection.release();
    console.log('DB is Connected');
    return
});

// Convertimos las consultas para poder usar promesas
pool.query = promisify(pool.query);

module.exports = pool;

