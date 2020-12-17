const express = require('express');
const router = express.Router();
const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');


router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
})

// Agregar un link a la BD
router.post('/add', isLoggedIn, async (req, res) => {
    // console.log(req.body);
    const {title, url, description} = req.body;
    const newLink ={
        title,
        url,
        description,
        user_id: req.user.id    
    };
    // console.log(newLink);

    // Agrego la información a la base de datos
    await pool.query('INSERT INTO links set ?', [newLink]);

    // Utilizo flash para mostrar un mensaje
    req.flash('success', 'Link saved successfully');

    res.redirect('/links');  //Al finalizar enviamos la ruta links
})

// Ver los links guardados
router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);

    // Renderizo el documento html/hbs y le envio como JSON lo devuelto por la BD
    res.render('links/list', { links });
});

// Borrar un link especifico
router.get('/delete/:id', isLoggedIn, async (req, res) => {
    // Guardo en una constante el valor de id pasado por parametro  
    const {id} = req.params;
    // Realizo una QUERY a la BD para eliminar dicho id
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);

    req.flash('success', 'Link Removed successfully');
    res.redirect('/links');
})

// Cargar página para editar un link
router.get('/edit/:id', isLoggedIn, async (req, res) => {
    // Guardo en una constante el valor de id pasado por parametro  
    const {id} = req.params;
    // Pido a la BD los datos almacenados en el ID enviado por la url
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    
    // Le envio los datos a la plantilla para poder ser editados
    res.render('links/edit', { link: links[0] });
})

// Editamos un link en la DB
router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    const {title, url, description} = req.body;
    const newLink = {
        title,
        url,
        description,
    };
    // Actualizo la base de datos
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    
    req.flash('success', 'Links Updated successfully');
    
    res.redirect('/links');

})



module.exports = router