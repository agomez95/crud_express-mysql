const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');

//inicializador
const app = express();

//settings
app.set('port', process.env.PORT || 4000); //configuro el puerto por defecto o 4000
app.set('views', path.join(__dirname, 'views')); //aqui configuro el directorio 'views' con el modulo path
app.engine('.hbs', exphbs({ // configuro el handlebars y le pongo nombre '.hbs'
    defaultLayout: 'main', //definimos el nombre de la plantilla principal o layout
    layoutsDir:  path.join(app.get('views'), 'layouts'), //aqui definimos el directorio de 'layouts' mediante el views con el modulo path
    partialsDir: path.join(app.get('views'), 'partials'), //aqui definimos el directorio de 'partials' mediante el views con el modulo path
    extname: '.hbs', //terminacion de cada archivo xx.hbs
    helpers: require('./lib/handlebars') //aqui vamos a configurar nuestros helpers del handlebars como procesar fechas y otras cosas que no se pueden hacer propiamente en las vistas de handlebars
}));
app.set('view engine', '.hbs'); //con lo de arriba configure el motor y con esta linea va a funcionar

//middlewares
app.use(morgan('dev')); //con esto el servidor botara respuestas get, post, put, delete con colores y con mensajes de codigo de estado Http(200,404,etc.)
app.use(express.urlencoded({extended: false})); //valido los datos que me envien desde los formularios y con extended solo recibire datos simples como strings
app.use(express.json());//valido datos json

//variables globales o funciones de continuidad para el codigo
app.use((req,res,next) => {

    next();
});

//routes
app.use(require('./routes/routes')); //rutas principales
app.use(require('./routes/authentication')); //rutas auth
app.use('/links', require('./routes/links')); //rutas de links como modulo

//public
app.use(express.static(path.join(__dirname, 'public')));

//server
app.listen(app.get('port'), ()=>{
    console.log("Server on port:",app.get('port'));
});