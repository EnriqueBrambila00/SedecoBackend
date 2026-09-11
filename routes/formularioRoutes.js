const express = require('express');
const router = express.Router();
const { createFormulario, getFormularios, getFormularioById, deleteFormulario } = require('../controllers/formulariosController');

// Definir las rutas
router.post('/', createFormulario);
router.get('/', getFormularios);
router.get('/:id', getFormularioById);
router.delete('/:id', deleteFormulario);

module.exports = router;