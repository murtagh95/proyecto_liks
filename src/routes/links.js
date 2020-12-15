const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/add', (req, res) => {
    res.render('links/add');
})

// Agregar un link a la BD
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

// Ver los links guardados
router.get('/', async (req, res) => {
    const links = await pool.query('SELECT * FROM links');

    // Renderizo el documento html/hbs y le envio como JSON lo devuelto por la BD
    res.render('links/list', { links });
});

// Borrar un link especifico
router.get('/delete/:id', async (req, res) => {
    // Guardo en una constante el valor de id pasado por parametro  
    const {id} = req.params;
    // Realizo una QUERY a la BD para eliminar dicho id
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);

    res.redirect('/links');
})

// Cargar página para editar un link
router.get('/edit/:id', async (req, res) => {
    // Guardo en una constante el valor de id pasado por parametro  
    const {id} = req.params;
    // Pido a la BD los datos almacenados en el ID enviado por la url
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    // Le envio los datos a la plantilla para poder ser editados
    res.render('links/edit', { link: links[0] });
})

// Editamos un link en la DB
router.post('/edit/:id', async (req, res) => {
    const {id} = req.params;
    const {title, url, description} = req.body;
    const newLink = {
        title,
        url,
        description,
    };
    console.log(newLink);
    // Actualizo la base de datos
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    res.redirect('/links');

})

module.exports = router