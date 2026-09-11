const express = require('express');
const router = express.Router();
const { createRespuesta, getRespuestaById, getRespuestas, updateRespuesta, deleteRespuesta } = require('../controllers/respuestasController.js');

// Definir las rutas
router.post('/', createRespuesta);
router.get('/', getRespuestas);
router.get('/:id', getRespuestaById);
router.put('/:id', updateRespuesta);
router.delete('/:id', deleteRespuesta);

module.exports = router; 