//aqui crearemos una autenticacion mas profesional se podria decir
const passport = require('passport'); //declaro el modulo
const LocalStrategy = require('passport-local').Strategy; //con esto podre hacer mi autenticacion LOCAL
const pool = require('../database');
const helpers = require('../lib/helpers');

//primer metodo de autenticacion de creacion
passport.use('local.signup', new LocalStrategy({ //asi creo la autenticacion LOCAL; local.signup es el nombre de mi autenticacion y ese voy a usar en mi servidor(index)
    usernameField: 'username', //recibire de mi autenticacion local el nombre completo que se va a llamar "username" proveniente de mi formulario
    passwordField: 'password', //lo mismo que arriba pero esta vez como password
    passReqToCallback: true //si quiero mas datos provenientes del registro puedo recibirlos a traves del req.body pero hay que tarde "true" a esto para que pase 
}, async (req, username, password, done) =>{ //este callback es posterior a cuando los datos se han autenticado(LocalStrategy) y "done" es para que continue el proceso para que guarde enlaces y demas
    const { fullname } = req.body; //ya que al ser un dato que es pasado por el req.body necesitamos declararlo primero
    const newUser = {   //el usuario nuevo como objeto
        username,
        password,
        fullname
    };
    newUser.password = await helpers.encryptPassword(password); //con esto cifro mi password para guardarla en la db pero debo usarla con await para que se tome su tiempo
    const result = await pool.query('INSERT INTO users SET ?', [newUser]); //mando mi funcion asyncrona con el pool query para insertar el usuario nuevo
    newUser.id = result.insertId;
    return done(null, newUser);
}));

//cuando serializo guardo el id del usario y cuando deserializo tomo ese id para obtener los datos del usario, funciona luego de crear o logear un usuario
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    const row = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, row[0]);
});

//segundo metodo para autenticacion logeo
passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]); //selecciono al usuario que busco
    if(rows.length > 0) { //vamos a ver si mi consulta tiene multiples filas
        const user = rows[0]; //extraigo mi usuario
        const validPassword = await helpers.matchPassword(password, user.password); //uso mi libreria helper para comparar la contraseña que recibo y la del usuario proveniente de la db
        if(validPassword) {  //si es true..
            done(null,user,req.flash('success','Bienvenido', user.username)); //termino el proceso mandando el null como error(como no hay error por eso envio null), el usuario para que lo serialice y deserialice y un mensaje flash
        }
        else {    
            done(null,false,req.flash('failure','El password es incorrecto')); //termino el proceso mandando el null como error(como no hay error por eso envio null), no le envio un usario en ves de eso le mando un false y un mensaje de fallo
        }
    }
    else {
        done(null,false,req.flash('failure','El usuario no existe'));//termino el proceso mandando el null como error(como no hay error por eso envio null), no le envio un usario en ves de eso le mando un false y un mensaje de fallo       
    }
}));