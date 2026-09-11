const prisma = require('../src/prismaClient');

const verificarRol = (rolesPermitidos) => {
    return async (req, res, next) => {
        try {
            // El usuario ya debe estar autenticado por authMiddleware
            const idUsuario = req.usuario.id_usuario;

            if (!idUsuario) {
                return res.status(401).json({ error: 'Acceso denegado. Usuario no identificado.' });
            }

            // Buscar los roles del usuario en la base de datos
            const usuarioRoles = await prisma.usuarios_roles.findMany({
                where: { id_usuario: idUsuario },
                include: { roles: true }
            });

            // Extraer solo los nombres de los roles del usuario
            const nombresRolesUsuario = usuarioRoles.map(ur => ur.roles.nombre_rol);

            // Verificar si el usuario tiene al menos uno de los roles permitidos
            const tieneRolPermitido = rolesPermitidos.some(rol => nombresRolesUsuario.includes(rol));

            if (!tieneRolPermitido) {
                return res.status(403).json({ error: 'Acceso denegado. No tienes permisos para realizar esta acción.' });
            }

            // Si tiene permiso, continuar
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al verificar los permisos del usuario.' });
        }
    };
};

module.exports = verificarRol;
