const express = require('express');
const auth = express.Router();
const passport = require('passport');
auth.get('/signup', (req,res) =>{
    res.render('auth/signup'); //aqui renderizo la vista sign up
});

//este metodo post es algo nuevo porque es de modo autenticacion por lo que no necesitamos un req y un res, esos estan siendo llamados desde la libreria passport
auth.post('/signup', passport.authenticate('local.signup', { //con esto va a tomar el nombre del modulo que creamos que se llama "local.signup" para que sepa que tiene que hacer cuando lo llamemos
    successRedirect: '/profile', //con esto se redirecciona a profile si fue exitosa la autenticacion
    failureRedirect: '/signup',
    failureFlash: true //con esto podemos definir mensajes flash si algo falla a traves de passport
}));

auth.get('/profile', (req,res) => {
    res.send('se autentico');
});

module.exports = auth;
