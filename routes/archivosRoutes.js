const express = require('express');
const router = express.Router();
const { getArchivos, getArchivoById, updateArchivo, deleteArchivo } = require('../controllers/archivosController');

// Definir las rutas
router.get('/', getArchivos);
router.get('/:id', getArchivoById);
router.put('/:id', updateArchivo);
router.delete('/:id', deleteArchivo);

module.exports = router;