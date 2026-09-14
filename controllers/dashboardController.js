const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getStats = async (req, res) => {
    try {
        // Ejecutar todas las consultas en paralelo para que sea súper rápido
        const [
            totalUsuarios,
            totalNoticias,
            totalEncuestas,
            totalRespuestas,
            totalMensajes
        ] = await Promise.all([
            prisma.usuarios.count(),
            prisma.noticias.count(),
            prisma.formularios.count(),
            prisma.respuestas.count(),
            prisma.contacto.count()
        ]);

        res.json({
            usuarios: totalUsuarios,
            noticias: totalNoticias,
            encuestas: totalEncuestas,
            respuestas: totalRespuestas,
            mensajes: totalMensajes
        });
    } catch (error) {
        console.error('Error obteniendo estadísticas del dashboard:', error);
        res.status(500).json({ error: 'Error al cargar estadísticas' });
    }
};

module.exports = {
    getStats
};
