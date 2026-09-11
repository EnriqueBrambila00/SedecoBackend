const prisma = require('../src/prismaClient');
// Crear un nuevo formulario
const createFormulario = async (req, res) => {
    const { titulo_formulario, descripcion, estado } = req.body;
    try {
        const nuevoFormulario = await prisma.formulario.create({
            data: {
                titulo_formulario,
                descripcion,
                estado
            }
        });
        res.status(201).json(nuevoFormulario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el formulario' });
    }
}   
// Obtener todos los formularios
const getFormularios = async (req, res) => {
    try {
        const formularios = await prisma.formulario.findMany();
        res.json(formularios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los formularios' });
    }
}   
const getFormularioById = async (req, res) => {
    const { id } = req.params;
    try {
        const formulario = await prisma.formulario.findUnique({
            where: { id_formulario: Number(id) }
        });
        if (!formulario) {
            return res.status(404).json({ error: 'Formulario no encontrado' });
        }
        res.json(formulario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el formulario' });
    }
}   
const deleteFormulario = async (req, res) => {
    const { id } = req.params;
    try {
        const formulario = await prisma.formulario.delete({
            where: { id_formulario: Number(id) }
        });
        res.json(formulario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el formulario' });
    }
}   


module.exports = {
    createFormulario,
    getFormularios,
    getFormularioById,
    deleteFormulario
}   
