const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const {database} = require('./keys');
// IITIALIZATIONS
const app = express();


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

// GLOBAL VARIABLES
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
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

