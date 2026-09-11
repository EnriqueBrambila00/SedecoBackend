const prisma = require('../src/prismaClient');

const createRespuesta = async (req, res) => {
    // La base de datos espera un JSON, Express ya parsea el body.
    const { id_formulario, id_usuario, respuesta_json } = req.body;
    try {
        const nuevaRespuesta = await prisma.respuestas.create({
            data: {
                id_formulario: id_formulario ? Number(id_formulario) : null,
                id_usuario: id_usuario ? Number(id_usuario) : null,
                respuesta_json // Esto insertará el JSON directamente
            }
        });
        res.status(201).json(nuevaRespuesta);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la respuesta' });
    }
}   
const getRespuestaById = async (req, res) => {
    const { id } = req.params;
    try {
        const respuesta = await prisma.respuestas.findUnique({
            where: { id_respuesta: Number(id) }
        });
        if (!respuesta) {
            return res.status(404).json({ error: 'Respuesta no encontrada' });
        }
        res.json(respuesta);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la respuesta' });
    }
}
const getRespuestas = async (req, res) => {
    try {
        const respuestas = await prisma.respuestas.findMany();
        res.json(respuestas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las respuestas' });
    }
}
const updateRespuesta = async (req, res) => {
    const { id } = req.params;
    const { id_formulario, id_usuario, respuesta_json } = req.body;
    try {
        const respuestaActualizada = await prisma.respuestas.update({
            where: { id_respuesta: Number(id) },
            data: {
                id_formulario: id_formulario ? Number(id_formulario) : undefined,
                id_usuario: id_usuario ? Number(id_usuario) : undefined,
                respuesta_json
            }
        });
        res.json(respuestaActualizada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la respuesta' });
    }
}
const deleteRespuesta = async (req, res) => {
    const { id } = req.params;
    try {
        const respuesta = await prisma.respuestas.delete({
            where: { id_respuesta: Number(id) }
        });
        res.json({ message: 'Respuesta eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la respuesta' });
    }
}

module.exports = {
    createRespuesta,
    getRespuestaById,
    getRespuestas,
    updateRespuesta,
    deleteRespuesta
}   
