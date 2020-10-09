//creare mi clase helpers para almacenar mis metodos que me ayudaran en el proyecto
const bcrypt = require('bcryptjs'); //declaro el modulo de bcrypt

const helpers = {};

// recibo la contraseña como tal, dentro de la funcion vamos generar un patron(salt) ahora le daremos ese patron un metodo bcrypt para que cifre la contraseña en "finalPassword" y finalmente la retornamos 
helpers.encryptPassword = async (password) => { //por ejemplo aqui hago un metodo encrypt que recibira mi password y la va a encriptar
    const salt = await bcrypt.genSalt(10);//genero un hash con genSalt x veces(10) pero a mayor veces mas tiempo toma, asi que usaremos un async await para darle tiempo a que se ejecute el hash
    const finalPass = await bcrypt.hash(password, salt); //aqui cifrara el password con el hash "salt" y de igual forma el daremos un await
    return finalPass;
}

//aqui recibo la contraseña para logearme y con esta funcion vamos a compara la contraseña que recibo y la que tengo guardada en mi db
helpers.matchPassword = async (password, savePassword) => {
    //podria usar otro tipo de promises revisar luego...
    try {
        return await bcrypt.compare(password, savePassword); //aqui las comparo y la retorno
    } catch(e) {
        console.log(e);
    }
}

helpers.isLoggedIn = function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/signin');
}

helpers.isNotLoggedIn = function isNotLoggedIn(req,res,next) {
    if(!req.isAuthenticated()){
        return next();
    }
    return res.redirect('/profile');
}

module.exports = helpers;