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

const register = async (req, res) => {
    const { nombre, correo, password } = req.body;

    try {
        // Verificar si el correo ya está registrado
        const usuarioExistente = await prisma.usuarios.findUnique({
            where: { correo: correo }
        });

        if (usuarioExistente) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        // Encriptar la contraseña (salt = 10 vueltas)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear el usuario (roles por defecto se pueden asignar aquí si es necesario)
        const nuevoUsuario = await prisma.usuarios.create({
            data: {
                nombre: nombre,
                correo: correo,
                password: hashedPassword,
                id_rol: 2 // Asumiendo que 2 es "Usuario Normal" / Ciudadano
            }
        });

        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente',
            usuario: {
                id_usuario: nuevoUsuario.id_usuario,
                nombre: nuevoUsuario.nombre,
                correo: nuevoUsuario.correo
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor al intentar registrar el usuario' });
    }
};

module.exports = {
    login,
    register
};
