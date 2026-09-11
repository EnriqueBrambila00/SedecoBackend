const prisma = require('../src/prismaClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { correo, password } = req.body;

    try {
        // 1. Verificar si el usuario existe
        const usuario = await prisma.usuarios.findUnique({
            where: { correo: correo }
        });

        if (!usuario) {
            return res.status(400).json({ error: 'Correo o contraseña incorrectos' });
        }

        // 2. Verificar la contraseña encriptada
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(400).json({ error: 'Correo o contraseña incorrectos' });
        }

        // 3. Crear el Token JWT (El "Gafete")
        // Usamos una clave secreta desde las variables de entorno
        const token = jwt.sign(
            { id_usuario: usuario.id_usuario, correo: usuario.correo },
            process.env.JWT_SECRET || 'MI_SECRETO_SUPER_SEGURO',
            { expiresIn: '1d' } // El token expira en 1 día
        );

        // Devolver el token y los datos del usuario
        res.json({
            mensaje: 'Login exitoso',
            token: token,
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                correo: usuario.correo
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor al intentar iniciar sesión' });
    }
};

module.exports = {
    login
};
