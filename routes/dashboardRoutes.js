const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboardController');
const verificarToken = require('../middlewares/authMiddleware');

// Solo usuarios con token válido pueden acceder a las estadísticas
router.get('/stats', verificarToken, getStats);

module.exports = router;
