const prisma = require('../src/prismaClient');

// Crear una nueva noticia
const createNoticia = async (req, res) => {
    // Aceptamos también 'estatus', pero si no viene, Prisma pondrá 'Activo' por defecto
    const { titulo, contenido, url_imagen, estatus, id_usuario } = req.body;
    try {
        const nuevaNoticia = await prisma.noticias.create({
            data: {
                titulo,
                contenido,
                url_imagen,
                estatus: estatus || 'Activo',
                id_usuario: Number(id_usuario)
            }
        });
        res.status(201).json(nuevaNoticia);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la noticia' });
    }
}   
// Obtener todas las noticias
const getNoticias = async (req, res) => {
    const { all } = req.query;
    try {
        // Si mandan ?all=true devuelvo todas, si no, solo las Activas (para el público)
        const whereClause = all === 'true' ? {} : { estatus: 'Activo' };
        
        const noticias = await prisma.noticias.findMany({
            where: whereClause
        });
        res.json(noticias);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las noticias' });
    }
}   
const getNoticiaById = async (req, res) => {
    const { id } = req.params;
    try {
        const noticia = await prisma.noticias.findUnique({
            where: { id_noticia: Number(id) }
        });
        if (!noticia) {
            return res.status(404).json({ error: 'Noticia no encontrada' });
        }
        res.json(noticia);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la noticia' });
    }
}   
const deleteNoticia = async (req, res) => {
    const { id } = req.params;
    try {
        const noticia = await prisma.noticias.delete({
            where: { id_noticia: Number(id) }
        });
        res.json(noticia);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la noticia' });
    }
}   
const updateNoticia = async (req, res) => {
    const { id } = req.params;
    const { titulo, contenido, url_imagen, estatus, id_usuario } = req.body;
    try {
        const noticiaActualizada = await prisma.noticias.update({
            where: { id_noticia: Number(id) },
            data: {
                titulo,
                contenido,
                url_imagen,
                estatus,
                id_usuario: id_usuario ? Number(id_usuario) : undefined
            }
        });
        res.json(noticiaActualizada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la noticia' });
    }
}

module.exports = {
    createNoticia,
    getNoticias,
    getNoticiaById,
    deleteNoticia,
    updateNoticia
}