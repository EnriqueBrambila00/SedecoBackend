const express = require('express');
const router = express.Router();
const { getRoles, getRoleById, createRole } = require('../controllers/rolesController');

// Definir las rutas
router.get('/', getRoles);
router.get('/:id', getRoleById);
router.post('/', createRole);

module.exports = router;