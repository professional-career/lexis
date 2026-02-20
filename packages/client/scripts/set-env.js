const { writeFileSync, mkdirSync, existsSync } = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

const targetDir = path.join(__dirname, '../src/environments');
const targetPath = path.join(targetDir, 'environment.ts');
const targetPathDev = path.join(targetDir, 'environment.development.ts');

const envFileContent = `
export const environment = {
  production: false,
  apiUrl: '${process.env.API_URL || 'http://localhost:3000/api'}',
  appName: '${process.env.APP_NAME || 'Lexis App'}',
  version: '${require('../package.json').version}'
};
`;

if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });
writeFileSync(targetPath, envFileContent);
writeFileSync(targetPathDev, envFileContent);

console.log('✅ Entornos locales generados en ' + targetDir);
