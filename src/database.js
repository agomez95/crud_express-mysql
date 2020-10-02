const mysql = require('mysql');
const { database } = require('./keys'); //importo solo la propiedad database
const { promisify } = require('util'); //con este modulo node permite convertir codigo de callbacks a codigo de promesas

const pool = mysql.createPool(database); //con createPool es mucho mas cercano al entorno de produccion; 
                                           //lo que hace es tener un entorno de hilos que se van ejecutan cada uno y en secuencia para identificar fallos en produccion en el proceso de coneccion
pool.getConnection((err,connection) =>{
    if(err) { //manejo de errores
        if(err.code == 'PROTOCOL_CONNECTION_LOST') { //la coneccion se cerro
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if(err.code == 'ER_CON_COUNT_ERROR') { //la database tiene muchas conecciones abiertas
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        }
        if(err.code == 'ECONNREFUSED') { //la coneccion fue rechazada
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }

    if(connection) connection.release();
    console.log('DB is Connected')
    return;
});

//Promisify Pool Querys
pool.query = promisify(pool.query); //con esto transformare los callbacks a querys osea que cada que quiera hacer consultas puedo utilizar promesas o Async await

module.exports = pool; //exporto el pool para usar las consultas