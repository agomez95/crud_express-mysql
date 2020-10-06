const express = require('express');
const auth = express.Router();

auth.get('/signup', (req,res) =>{
    res.render('auth/signup'); //aqui renderizo la vista sign up
});

auth.post('/signup', (req,res) =>{
    console.log(req.body);
    res.send('Recibido');//aqui recibo los datos de registro
});

module.exports = auth;
