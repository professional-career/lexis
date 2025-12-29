const { writeFileSync, mkdirSync } = require('fs');

require('dotenv').config();

const targetPath = './apps/client/src/environments/environment.ts';
const targetPathDev = './apps/client/src/environments/environment.development.ts';

const envFileContent = `
export const environment = {
  production: false,
  apiUrl: '${process.env.API_URL || 'http://localhost:3000/api'}',
  appName: '${process.env.APP_NAME || 'Mi Monorepo'}',
  version: '${require('../package.json').version}'
};
`;

mkdirSync('./apps/client/src/environments', { recursive: true });
writeFileSync( targetPath, envFileContent, (err) => {throw new Error(err)});
writeFileSync( targetPathDev, envFileContent, (err) => {throw new Error(err)});

console.log(`✅ Angular environment generado en ${targetPath}`);
console.log(`✅ Angular def-environment generado en ${targetPathDev}`);