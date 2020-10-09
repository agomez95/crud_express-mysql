const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/helpers');

router.get('/',isLoggedIn, (req,res) =>{
    res.render('/signin');
});

module.exports = router;
