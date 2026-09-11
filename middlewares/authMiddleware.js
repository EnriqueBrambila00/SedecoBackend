const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    // Leer el token del encabezado (Header) de la petición
    const token = req.header('Authorization');

    // Si no hay token, denegamos el acceso
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. No hay token de autenticación.' });
    }

    try {
        // Le quitamos la palabra "Bearer " que siempre viene antes del token
        const tokenPuro = token.replace('Bearer ', '');
        
        // Verificamos que el token sea válido usando la misma clave secreta
        const decodificado = jwt.verify(tokenPuro, process.env.JWT_SECRET || 'MI_SECRETO_SUPER_SEGURO');
        
        // Guardamos los datos del usuario en la petición para que las siguientes rutas lo puedan usar
        req.usuario = decodificado;
        
        // Lo dejamos pasar
        next();
    } catch (error) {
        res.status(400).json({ error: 'Token no válido o expirado.' });
    }
};

module.exports = verificarToken;
