const express = require('express');
const router = express.Router();
const { getMunicipios, getMunicipioById } = require('../controllers/municipiosController');

// Definir las rutas
router.get('/', getMunicipios);
router.get('/:id', getMunicipioById);

module.exports = router;