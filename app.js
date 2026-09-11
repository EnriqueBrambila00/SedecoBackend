require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
// Middleware para parsear JSON en el body de las peticiones
app.use(express.json());

// Importar rutas
const usuariosRoutes = require('./routes/usuariosRoutes');
const rolesRoutes = require('./routes/rolesRoutes');
const archivosRoutes = require('./routes/archivosRoutes');
const estadosRoutes = require('./routes/estadosRoutes');
const municipiosRoutes = require('./routes/municipiosRoutes');
const contactoRoutes = require('./routes/contactoRoutes');
const formulariosRoutes = require('./routes/formularioRoutes');
const noticiasRoutes = require('./routes/noticiasRoutes');
const authRoutes = require('./routes/authRoutes');
const respuestasRoutes = require('./routes/respuestaRoutes');
const tramitesRoutes = require('./routes/tramitesRoutes');

// Rutas base
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/archivos', archivosRoutes);
app.use('/api/estados', estadosRoutes);
app.use('/api/municipios', municipiosRoutes);
app.use('/api/contacto', contactoRoutes);
app.use('/api/formulario', formulariosRoutes);
app.use('/api/noticias', noticiasRoutes);
app.use('/api/respuestas', respuestasRoutes);
app.use('/api/tramites', tramitesRoutes);

app.get('/', (req, res) => {
  res.send('¡Hola desde mi servidor con Node y Express!');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
