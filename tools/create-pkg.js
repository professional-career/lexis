const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const type = process.argv[2];
const name = process.argv[3];

if (!type || !name) {
  console.error('❌ Uso: node tools/create-pkg.js <tipo> <nombre>');
  console.error('Tipos soportados: astro, next, vite, nest, angular');
  process.exit(1);
}

const targetDir = path.join(__dirname, '../packages', name);

const commands = {
  angular: ['@angular/cli', 'new', name, '--package-manager', 'pnpm', '--routing', '--style', 'css', '--standalone', '--skip-install'],
  astro: ['create', 'astro@latest', name, '--no-install', '--no-git', '--typescript', 'strict'],
  next: ['create-next-app@latest', name, '--use-pnpm', '--typescript', '--tailwind', '--eslint', '--app', '--skip-install'],
  vite: ['create', 'vite@latest', name, '--template', 'react-ts'],
  nest: ['@nestjs/cli', 'new', name, '--package-manager', 'pnpm', '--skip-install'],
};

const cmd = commands[type];

if (!cmd) {
  console.error(`❌ Tipo "${type}" no soportado. Usa: ${Object.keys(commands).join(', ')}`);
  process.exit(1);
}

console.log(`🧪 Lexis está forjando un nuevo invento: ${name} (${type})...`);

const executable = type === 'next' || type === 'nest' || type === 'angular' ? 'npx' : 'pnpm';

const result = spawnSync(executable, cmd, {
  cwd: path.join(__dirname, '../packages'),
  stdio: 'inherit',
  shell: true,
});

if (result.status === 0) {
  // --- LÓGICA DE POST-GENERACIÓN ESPECÍFICA ---
  
  if (type === 'angular') {
    console.log(`📦 Configurando sistema de entornos local para ${name}...`);
    
    const scriptsDir = path.join(targetDir, 'scripts');
    if (!fs.existsSync(scriptsDir)) fs.mkdirSync(scriptsDir);

    const setEnvContent = `const { writeFileSync, mkdirSync, existsSync } = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

const targetDir = path.join(__dirname, '../src/environments');
const targetPath = path.join(targetDir, 'environment.ts');
const targetPathDev = path.join(targetDir, 'environment.development.ts');

const envFileContent = \`
export const environment = {
  production: false,
  apiUrl: '\${process.env.API_URL || 'http://localhost:3000/api'}',
  appName: '\${process.env.APP_NAME || 'Lexis App'}',
  version: '\${require('../package.json').version}'
};
\`;

if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });
writeFileSync(targetPath, envFileContent);
writeFileSync(targetPathDev, envFileContent);

console.log('✅ Entornos locales generados en ' + targetDir);
`;
    fs.writeFileSync(path.join(scriptsDir, 'set-env.js'), setEnvContent);

    // Actualizar package.json local
    const pkgPath = path.join(targetDir, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    pkg.scripts['generate:env'] = "node scripts/set-env.js";
    // Asegurar que el comando start genere el env primero
    pkg.scripts['start'] = "pnpm run generate:env && ng serve";
    pkg.scripts['build'] = "pnpm run generate:env && ng build";
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  }

  console.log(`\n✅ ¡Invento "${name}" creado con éxito en packages/${name}!`);
  console.log(`\n💡 Próximos pasos:`);
  console.log(`1. pnpm install (para vincular el workspace)`);
  console.log(`2. pnpm db:enable ${name} (si necesitas DB)`);
} else {
  console.error(`\n❌ Error al crear el invento.`);
  process.exit(result.status);
}
