const prisma = require('../src/prismaClient'); 

// Crear un nuevo contacto
const createContacto = async (req, res) => {
    // 1. Recibimos los campos que realmente pertenecen a la tabla 'contacto'
    let { id_usuario, nombre, email, telefono, asunto, mensaje } = req.body;
    
    try {
        // 2. Si enviaron un id_usuario (usuario logeado), buscamos sus datos reales
        if (id_usuario) {
            const usuarioRegistrado = await prisma.usuarios.findUnique({
                where: { id_usuario: Number(id_usuario) }
            });

            // Si el usuario existe, sobrescribimos las variables con su info oficial
            if (usuarioRegistrado) {
                nombre = `${usuarioRegistrado.nombre} ${usuarioRegistrado.apellido_paterno}`;
                email = usuarioRegistrado.correo;
                telefono = usuarioRegistrado.telefono || telefono; // Si no tiene teléfono, usa el que hayan mandado
            }
        }

        // 3. Creamos el registro en la tabla de contactos
        const nuevoContacto = await prisma.contacto.create({
            data: {
                id_usuario: id_usuario ? Number(id_usuario) : null,
                nombre,
                email,
                telefono,
                asunto,
                mensaje
            }
        });
        res.status(201).json(nuevoContacto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el contacto' });
    }
}
// Obtener todos los contactos
const getContactos = async (req, res) => {
    try {
        const contactos = await prisma.contacto.findMany();
        res.json(contactos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los contactos' });
    }
}
module.exports = {
    createContacto,
    getContactos
}
