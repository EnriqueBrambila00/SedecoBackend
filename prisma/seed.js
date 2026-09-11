const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el sembrado (seeding) de estados y municipios...');

  // 1. Obtener el JSON desde GitHub
  const response = await fetch('https://raw.githubusercontent.com/cisnerosnow/json-estados-municipios-mexico/master/estados-municipios.json');
  const data = await response.json();

  // 2. Limpiar las tablas para evitar duplicados si corres esto más de una vez
  // OJO: Esto borrará los usuarios si tienen relación estricta, pero asumiendo que la base está limpia:
  await prisma.municipios.deleteMany();
  await prisma.estados.deleteMany();
  // Reiniciar autoincrement en MySQL
  await prisma.$executeRaw`ALTER TABLE estados AUTO_INCREMENT = 1;`;
  await prisma.$executeRaw`ALTER TABLE municipios AUTO_INCREMENT = 1;`;

  // 3. Iterar sobre las llaves del JSON (los estados)
  for (const nombreEstado of Object.keys(data)) {
    // Insertar el estado
    const estadoInsertado = await prisma.estados.create({
      data: {
        nombre_estado: nombreEstado,
      },
    });

    // Preparar el arreglo de municipios para este estado
    const listaMunicipios = data[nombreEstado];
    const municipiosData = listaMunicipios.map((nombreMunicipio) => ({
      nombre_municipio: nombreMunicipio,
      id_estado: estadoInsertado.id_estado, // Relacionarlo usando el ID del estado recién insertado
    }));

    // Insertar todos los municipios de este estado de un solo golpe (bulk insert)
    await prisma.municipios.createMany({
      data: municipiosData,
    });

    console.log(`✅ Estado insertado: ${nombreEstado} con sus ${listaMunicipios.length} municipios.`);
  }

  console.log('¡Sembrado completado exitosamente!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
