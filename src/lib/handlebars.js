//aqui declaro mi modulo timeago con format asi tal cual
const { format } = require('timeago.js');

const helpers = {};

//a helper le mando el atributo "timeago" a helpers el cual en verdad es una funcion que va a recibir un timestamp y retornara un formato de "time ago.."
helpers.timeago = (timestamp) => {
    return format(timestamp);
};

module.exports = helpers;