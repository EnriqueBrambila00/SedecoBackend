const express = require('express');
const router = express.Router();
const { createContacto, getContactos } = require('../controllers/contactoController');

// Definir las rutas
router.post('/', createContacto);
router.get('/', getContactos);

module.exports = router;