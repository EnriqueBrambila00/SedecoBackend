const express = require('express');
const router = express.Router();
const { getUsuarios, getUsuarioById, createUsuario, updateUsuario, updateUsuarioRol, deleteUsuario } = require('../controllers/usuariosController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarRol = require('../middlewares/rolMiddleware');

// Definir las rutas
router.get('/', verificarToken, getUsuarios);
router.get('/:id', verificarToken, getUsuarioById);
router.post('/', verificarToken, createUsuario);
router.put('/:id', verificarToken, updateUsuario);
router.put('/:id/rol', verificarToken, updateUsuarioRol);
// Solo un 'Administrador' o 'Super Admin' puede eliminar usuarios (ahora manejado en frontend o middleware)
router.delete('/:id', verificarToken, deleteUsuario);

module.exports = router;
