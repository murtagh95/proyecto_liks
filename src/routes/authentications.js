const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/signup', (req, res) => {
    console.log('hola')
    res.render('auth/signup');
});

router.post('/signup', passport.authenticate('local.signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
}));

router.get('/profile', (req, res) => {
    res.send('Profile');
})

module.exports = router