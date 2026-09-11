const prisma = require('../src/prismaClient');
// Crear un nuevo trámite
const createTramite = async (req, res) => {
    const { id_usuario, id_municipio, nombre_tramite, descripcion, requisitos, costo, duracion, estado } = req.body;
    try {
        const nuevoTramite = await prisma.tramites.create({
            data: {
                id_usuario: id_usuario ? Number(id_usuario) : null,
                id_municipio: id_municipio ? Number(id_municipio) : null,
                nombre_tramite,
                descripcion,
                requisitos,
                costo,
                duracion,
                estado
            }
        });
        res.status(201).json(nuevoTramite);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el trámite' });
    }
}
const getTramites = async (req, res) => {
    try {
        const tramites = await prisma.tramites.findMany();
        res.json(tramites);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los trámites' });
    }
}
const getTramiteById = async (req, res) => {
    const { id } = req.params;
    try {
        const tramite = await prisma.tramites.findUnique({
            where: { id_tramite: Number(id) }
        });
        if (!tramite) {
            return res.status(404).json({ error: 'Trámite no encontrado' });
        }
        res.json(tramite);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el trámite' });
    }
}
const updateTramite = async (req, res) => {
    const { id } = req.params;
    const { id_usuario, id_municipio, nombre_tramite, descripcion, requisitos, costo, duracion, estado } = req.body;
    try {
        const tramiteActualizado = await prisma.tramites.update({
            where: { id_tramite: Number(id) },
            data: {
                id_usuario: id_usuario ? Number(id_usuario) : undefined,
                id_municipio: id_municipio ? Number(id_municipio) : undefined,
                nombre_tramite,
                descripcion,
                requisitos,
                costo,
                duracion,
                estado
            }
        });
        res.json(tramiteActualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el trámite' });
    }
}
const deleteTramite = async (req, res) => {
    const { id } = req.params;
    try {
        const tramite = await prisma.tramites.delete({
            where: { id_tramite: Number(id) }
        });
        res.json(tramite);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el trámite' });
    }
}
module.exports = {
    createTramite,
    getTramites,
    getTramiteById,
    updateTramite,
    deleteTramite
}