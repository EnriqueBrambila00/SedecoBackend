const prisma = require('../src/prismaClient');

const getEstados = async (req, res) => {
    try {
        const estados = await prisma.estados.findMany();
        res.json(estados);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener estados' });
    }
}
const getEstadoById = async (req, res) => {
    const { id } = req.params;
    try {
        const estado = await prisma.estados.findUnique({
            where: { id_estado: Number(id) }
        });
        if (!estado) {
            return res.status(404).json({ error: 'Estado no encontrado' });
        }
        res.json(estado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el estado' });
    }
}
module.exports = {
    getEstados,
    getEstadoById
}