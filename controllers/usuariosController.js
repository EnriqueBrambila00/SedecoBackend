const prisma = require('../src/prismaClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- UTILIDADES DE FECHA ---
// Convierte una fecha de JS a cadena 'DD/MM/AAAA' (salida hacia el frontend)
const formatearFecha = (fecha) => {
  if (!fecha) return null;
  const d = new Date(fecha);
  // getUTCDate() evita que el cambio de zona horaria nos mueva el día
  const dia = String(d.getUTCDate()).padStart(2, '0');
  const mes = String(d.getUTCMonth() + 1).padStart(2, '0');
  const anio = d.getUTCFullYear();
  return `${dia}/${mes}/${anio}`;
};

// Da formato a todas las fechas de un usuario
const formatearUsuario = (usuario) => {
  if (!usuario) return usuario;
  return {
    ...usuario,
    fecha_nacimiento: formatearFecha(usuario.fecha_nacimiento)
  };
};

// Convierte cadena 'DD/MM/AAAA' a un Date válido para Prisma (entrada desde el frontend)
const parsearFecha = (fechaString) => {
  if (!fechaString) return null;
  const partes = fechaString.split('/');
  if (partes.length !== 3) return null;
  const [dia, mes, anio] = partes;
  // Guardamos como UTC mediodía para evitar que zonas horarias adelanten o atrasen un día
  return new Date(`${anio}-${mes}-${dia}T12:00:00Z`);
};
// ----------------------------

// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuarios.findMany({
      include: {
        usuarios_roles: {
          include: {
            roles: true
          }
        }
      }
    });
    
    // Mapeamos para que a todos los usuarios se les formatee la fecha y rol
    const usuariosFormateados = usuarios.map(u => {
      const formatted = formatearUsuario(u);
      return {
        ...formatted,
        id_rol: u.usuarios_roles.length > 0 ? u.usuarios_roles[0].id_rol : 3,
        rol_nombre: u.usuarios_roles.length > 0 ? u.usuarios_roles[0].roles.nombre_rol : 'Usuario'
      }
    });
    res.json(usuariosFormateados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Actualizar rol de un usuario
const updateUsuarioRol = async (req, res) => {
  const { id } = req.params;
  const { id_rol } = req.body;
  try {
    // Eliminar rol existente
    await prisma.usuarios_roles.deleteMany({
      where: { id_usuario: Number(id) }
    });
    
    // Crear nuevo rol
    await prisma.usuarios_roles.create({
      data: {
        id_usuario: Number(id),
        id_rol: Number(id_rol)
      }
    });

    res.json({ message: 'Rol actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el rol del usuario' });
  }
};

// Obtener un usuario por ID
const getUsuarioById = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await prisma.usuarios.findUnique({
      where: { id_usuario: Number(id) }
    });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(formatearUsuario(usuario));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};

// Crear un nuevo usuario
const createUsuario = async (req, res) => {
  const { nombre, apellido_paterno, id_municipio, correo, password, fecha_nacimiento } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    const nuevoUsuario = await prisma.usuarios.create({
      data: {
        nombre,
        apellido_paterno,
        id_municipio: Number(id_municipio),
        correo,
        password: passwordEncriptada,
        // Si el cliente manda la fecha en formato DD/MM/AAAA, la parseamos para MySQL
        fecha_nacimiento: parsearFecha(fecha_nacimiento) 
      }
    });
    // Se devuelve también con el formato mexicano
    res.status(201).json(formatearUsuario(nuevoUsuario));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el usuario. Verifica que el correo o CURP no estén duplicados.' });
  }
};

// Actualizar un usuario existente
const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido_paterno, id_municipio, correo, password, fecha_nacimiento, estatus } = req.body;
  try {
    // Solo encriptar si enviaron una nueva contraseña
    let passwordEncriptada = undefined;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      passwordEncriptada = await bcrypt.hash(password, salt);
    }
    
    const usuarioActualizado = await prisma.usuarios.update({
      where: { id_usuario: Number(id) },
      data: {
        nombre,
        apellido_paterno,
        id_municipio: id_municipio ? Number(id_municipio) : undefined,
        correo,
        password: passwordEncriptada,
        fecha_nacimiento: fecha_nacimiento ? parsearFecha(fecha_nacimiento) : undefined,
        estatus
      }
    });
    res.json(formatearUsuario(usuarioActualizado));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};

// Eliminar un usuario
const deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.usuarios.delete({
      where: { id_usuario: Number(id) }
    });
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};

module.exports = {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  updateUsuarioRol,
  deleteUsuario
};
