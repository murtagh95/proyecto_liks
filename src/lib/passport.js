const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');


passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const {fullname} = req.body;

    const newUser = {
        username,
        password,
        fullname 
    }
    // Encriptamos la contraseña
    newUser.password = await helpers.encryptPassword(password);

    // Almaceno el usuario en la BD
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((usr, done) => {
    
    done(null, usr.id);
});

passport.deserializeUser(async (id, done) => {
    const row = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, row[0]);
})