const express = require('express');
const router = express.Router();
const { createNoticia, getNoticias, getNoticiaById, deleteNoticia, updateNoticia } = require('../controllers/noticiasController');

// Definir las rutas
router.post('/', createNoticia);
router.get('/', getNoticias);
router.get('/:id', getNoticiaById);
router.delete('/:id', deleteNoticia);
router.put('/:id', updateNoticia);

module.exports = router; 