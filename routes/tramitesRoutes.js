const express = require('express');
const router = express.Router();
const { createTramite, getTramites, getTramiteById, updateTramite, deleteTramite } = require('../controllers/tramitesController');
const verificarToken = require('../middlewares/authMiddleware');

// Definir las rutas
router.post('/', verificarToken, createTramite);
router.get('/', verificarToken, getTramites);
router.get('/:id', verificarToken, getTramiteById);
router.put('/:id', verificarToken, updateTramite);
router.delete('/:id', verificarToken, deleteTramite);

module.exports = router; 