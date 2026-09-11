const prisma = require('../src/prismaClient');

// Obtener todos los archivos   
const getArchivos = async (req, res) => {
    try {
        const archivos = await prisma.archivos.findMany();
        res.json(archivos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener archivos' });
    }
}

// Obtener un archivo por ID
const getArchivoById = async (req, res) => {
    const { id } = req.params;
    try {
        const archivo = await prisma.archivos.findUnique({
            where: { id_archivo: Number(id) }
        });
        if (!archivo) {
            return res.status(404).json({ error: 'Archivo no encontrado' });
        }
        res.json(archivo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el archivo' });
    }
}
const updateArchivo = async (req, res) => {
    const { id } = req.params;
    const { nombre_archivo, archivo_url } = req.body;
    try {
        const archivo = await prisma.archivos.update({
            where: { id_archivo: Number(id) },
            data: {
                nombre_archivo,
                archivo_url
            }
        });
        res.json(archivo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el archivo' });
    }
}
const deleteArchivo = async (req, res) => {
    const { id } = req.params;
    try {
        const archivo = await prisma.archivos.delete({
            where: { id_archivo: Number(id) }
        });
        res.json(archivo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el archivo' });
    }
}
module.exports = {
    getArchivos,
    getArchivoById,
    updateArchivo,
    deleteArchivo
}