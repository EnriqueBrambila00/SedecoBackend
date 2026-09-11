const express = require('express');
const router = express.Router();
const { getUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario } = require('../controllers/usuariosController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarRol = require('../middlewares/rolMiddleware');

// Definir las rutas
router.get('/', verificarToken, getUsuarios);
router.get('/:id', verificarToken, getUsuarioById);
router.post('/', verificarToken, createUsuario);
router.put('/:id', verificarToken, updateUsuario);
// Solo un 'Administrador' puede eliminar usuarios
router.delete('/:id', verificarToken, verificarRol(['Administrador']), deleteUsuario);

module.exports = router;
