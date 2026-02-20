const { writeFileSync, mkdirSync } = require('fs');

require('dotenv').config();

const targetPath = './packages/client/src/environments/environment.ts';
const targetPathDev = './packages/client/src/environments/environment.development.ts';

const envFileContent = `
export const environment = {
  production: false,
  apiUrl: '${process.env.API_URL || 'http://localhost:3000/api'}',
  appName: '${process.env.APP_NAME || 'Mi Monorepo'}',
  version: '${require('../package.json').version}'
};
`;

const targetDir = './packages/client/src/environments';
if (!require('fs').existsSync(targetDir)) {
  require('fs').mkdirSync(targetDir, { recursive: true });
}

writeFileSync( targetPath, envFileContent, (err) => {if(err) throw new Error(err)});
writeFileSync( targetPathDev, envFileContent, (err) => {if(err) throw new Error(err)});

console.log(`✅ Angular environment generado en ${targetPath}`);
console.log(`✅ Angular def-environment generado en ${targetPathDev}`);