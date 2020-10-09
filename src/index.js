const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const { database } = require('./keys'); //con esto llamo la conexion a la base de datos 
const passport = require('passport');

//inicializador
const app = express();
require('./lib/passport'); //con esto la aplicacion se va a enterar que estoy creando una autenticacion y la utilice

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
app.use(session({
    secret: 'nodemysqlsession', //aqui le damos el modelo de como va a guardar las sesiones, un nombre en pocas palabras
    resave: false, //con false para que no se empieze a renovar la sesion por si sola
    saveUninitialized: false, //false para que no se vuelva a establecer la sesion
    store: new MySQLStore(database)//aqui es donde vamos a guardar la sesion y sera en la base de datos por medio del modulo "express-mysql" y la conexion "database"
}));
app.use(flash());//middleware de connect-flash
app.use(morgan('dev')); //con esto el servidor botara respuestas get, post, put, delete con colores y con mensajes de codigo de estado Http(200,404,etc.)
app.use(express.urlencoded({extended: false})); //valido los datos que me envien desde los formularios y con extended solo recibire datos simples como strings
app.use(express.json());//valido datos json
app.use(passport.initialize());//con esto inicializo passport
app.use(passport.session());//con esto va a funcionar passport

//variables globales o funciones de continuidad para el codigo
app.use((req,res,next) => {
    app.locals.success = req.flash('succes'); //con esto declaramos la variable global de "success" que lo usaremos en el main layout
    app.locals.failure = req.flash('failure'); //igual que success pero este mensaje es de fallo
    app.locals.user = req.user; //vamos a almacenar en una variable global la sesion de usuario
    next();
});

//routes
app.use(require('./routes/routes')); //rutas principales
app.use(require('./routes/authentication')); //rutas auth
app.use('/links', require('./routes/links')); //rutas de links como modulo y desde aqui sale la bd

//public
app.use(express.static(path.join(__dirname, 'public')));

//server
app.listen(app.get('port'), ()=>{
    console.log("Server on port:",app.get('port'));
});