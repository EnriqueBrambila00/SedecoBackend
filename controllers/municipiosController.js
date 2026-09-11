const prisma = require('../src/prismaClient');


const getMunicipios = async (req, res) => {
    try {
        const municipios = await prisma.municipios.findMany();
        res.json(municipios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener municipios' });
    }
}
const getMunicipioById = async (req, res) => {
    const { id } = req.params;
    try {
        const municipio = await prisma.municipios.findUnique({
            where: { id_municipio: Number(id) }
        });
        if (!municipio) {
            return res.status(404).json({ error: 'Municipio no encontrado' });
        }
        res.json(municipio);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el municipio' });
    }
}
module.exports = {
    getMunicipios,
    getMunicipioById
}
