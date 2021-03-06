const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const {database} = require('./keys');
const passport = require('passport');

// IITIALIZATIONS
const app = express();
require('./lib/passport');


// SETTINGS
app.set('port', process.env.PORT || 4000);  // Verificamos si existe un puerto en el sistema
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');

// MIDDLEWARES
app.use(session({  // Configuro el guardado de seción
    secret: 'faztmysqlnodesession',
    resave: false,
    saveUninitialized: false,
    store:  new MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));  // Aceptamos datos desde los formularios
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());



// GLOBAL VARIABLES
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    
    // Almaceno el usuario para poder ser accedido desde cualquier vista
    app.locals.user = req.user;
    
    next();
});

// ROUTES
app.use(require('./routes'));
app.use(require('./routes/authentications'));
app.use('/links', require('./routes/links'));


// PUBLIC
app.use(express.static(path.join(__dirname, 'public')));


// STARTING SERVER
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});

