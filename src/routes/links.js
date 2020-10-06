const express = require('express');
const links = express.Router();

const pool = require('../database'); //con esto conecto la base de datos

links.get('/add', (req,res) => {
    res.render('links/add'); //aqui agregaremos los archivos links 
});

links.post('/add', async (req,res) => {
    const { title, url, description } = req.body; //con esto recivo los datos del formuario a estos objetos que estoy creadno
    const newLink = { //en este objeto almaceno los 3 que recibi
        title,
        url,
        description
    }
    await pool.query('INSERT INTO links set?', [newLink]); //aqui mando el query mediante la promesa y el objeto a agregar
    req.flash('succes', 'El link ha sido guardado satisfactoriamente');
    res.redirect('/links');
});

links.get('/', async (req,res) => {
    const links = await pool.query('SELECT * FROM links'); //aqui mando un query para hacer un list de todos los links
    //console.log(list);
    res.render('links/list', {links: links}); //renderizo la vista y envio el objeto links
});

links.get('/delete/:id', async (req,res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE id = ?', [id]);
    req.flash('succes', 'El link ha sido removido satisfactoriamente');
    res.redirect('/links');
});

links.get('/edit/:id', async (req,res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    res.render('links/edit', {link: links[0]});//links[0] recibo un unico objeto
});

links.post('/edit/:id', async (req,res) => {
    const { id } = req.params;
    const { title, description, url } = req.body; //con esto recivo los datos del formuario a estos objetos que estoy editando
    const editLink = { //en este objeto almaceno los 3 que recibi
        title,        
        description,
        url
    }
    await pool.query('UPDATE links set ? WHERE id = ?', [editLink, id]); //aqui mando el query mediante la promesa pero esta vez envio 2 objetos de la siguiente forma
    req.flash('succes', 'El link ha sido actualizado satisfactoriamente');
    res.redirect('/links');
});

module.exports = links;
