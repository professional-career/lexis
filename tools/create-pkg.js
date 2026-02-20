const { spawnSync } = require('child_process');
const path = require('path');

const type = process.argv[2];
const name = process.argv[3];

if (!type || !name) {
  console.error('❌ Uso: node tools/create-pkg.js <tipo> <nombre>');
  console.error('Tipos soportados: astro, next, vite, nest');
  process.exit(1);
}

const targetDir = path.join(__dirname, '../packages', name);

const commands = {
  astro: ['create', 'astro@latest', name, '--no-install', '--no-git', '--typescript', 'strict'],
  next: ['create-next-app@latest', name, '--use-pnpm', '--typescript', '--tailwind', '--eslint', '--app'],
  vite: ['create', 'vite@latest', name, '--template', 'react-ts'],
  nest: ['@nestjs/cli', 'new', name, '--package-manager', 'pnpm'],
};

const cmd = commands[type];

if (!cmd) {
  console.error(`❌ Tipo "${type}" no soportado. Usa: ${Object.keys(commands).join(', ')}`);
  process.exit(1);
}

console.log(`🧪 Lexis está forjando un nuevo invento: ${name} (${type})...`);

// Ejecutamos el comando dentro de la carpeta packages
const executable = type === 'next' || type === 'nest' ? 'npx' : 'pnpm';

const result = spawnSync(executable, cmd, {
  cwd: path.join(__dirname, '../packages'),
  stdio: 'inherit',
  shell: true,
});

if (result.status === 0) {
  console.log(`
✅ ¡Invento "${name}" creado con éxito en packages/${name}!`);
  console.log(`
💡 Próximos pasos:`);
  console.log(`1. pnpm install (para vincular el workspace)`);
  console.log(`2. pnpm add @lexis/database --filter ${name} (si necesitas DB)`);
} else {
  console.error(`
❌ Error al crear el invento.`);
  process.exit(result.status);
}
