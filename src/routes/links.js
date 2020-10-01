const express = require('express');
const links = express.Router();

const pool = require('../database'); //con esto conecto la base de datos

module.exports = links;
