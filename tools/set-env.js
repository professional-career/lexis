// tools/set-env.js
const { writeFile } = require('fs');
const { argv } = require('yargs'); // O usa process.argv si no quieres instalar yargs
require('dotenv').config(); // Carga las variables del .env raíz

// Si tienes variables que Angular DEBE conocer, lístalas aquí para seguridad
// (No queremos exponer secretos de base de datos por accidente al frontend)
const targetPath = './apps/client/src/environments/environment.development.ts';

const envConfigFile = `
export const environment = {
  production: false,
  apiUrl: '${process.env.API_URL || 'http://localhost:3000/api'}',
  appName: '${process.env.APP_NAME || 'Mi ERP'}',
  version: '${require('../package.json').version}'
};
`;

writeFile(targetPath, envConfigFile, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`✅ Angular environment generado en ${targetPath}`);
  }
});