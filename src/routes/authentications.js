const express = require('express');
const passport = require('passport');
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');
const router = express.Router();

router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup');
});

router.post('/signup', passport.authenticate('local.signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
}));

router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});

router.post('/signin', (req, res, next) => {
    
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureDlash: true
    }) (req, res, next);    

});

// Antes de dirigir a profile verificamos si el usuario esta logeado
router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile');
})

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/signin');
});

module.exports = router