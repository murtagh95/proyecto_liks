const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/add', (req, res) => {
    res.render('links/add');
})

router.post('/add', async (req, res) => {
    // console.log(req.body);
    const {title, url, description} = req.body;
    const newLink ={
        title,
        url,
        description
    };
    // console.log(newLink);

    // Agrego la información a la base de datos
    await pool.query('INSERT INTO links set ?', [newLink]);

    res.redirect('/links');  //Al finalizar enviamos la ruta links
})

router.get('/', async (req, res) => {
    const links = await pool.query('SELECT * FROM links');
    console.log(links);

    // Renderizo el documento html/hbs y le envio como JSON lo devuelto por la BD
    res.render('links/list', { links });
});

module.exports = router