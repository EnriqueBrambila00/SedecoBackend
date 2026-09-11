const prisma = require('../src/prismaClient');

// Obtener todos los roles
const getRoles = async (req, res) => {
  try {
    const roles = await prisma.roles.findMany();
    res.json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener roles' });
  }
};

// Obtener un rol por ID
const getRoleById = async (req, res) => {
  const { id } = req.params;
  try {
    const rol = await prisma.roles.findUnique({
      where: { id_rol: Number(id) }
    });
    if (!rol) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    res.json(rol);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el rol' });
  }
};

// Crear un nuevo rol
const createRole = async (req, res) => {
  const { nombre_rol, descripcion } = req.body;
  try {
    const nuevoRol = await prisma.roles.create({
      data: {
        nombre_rol,
        descripcion
      }
    });
    res.status(201).json(nuevoRol);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el rol. Verifica que el nombre no esté duplicado.' });
  }
};

module.exports = {
  getRoles,
  getRoleById,
  createRole
};
