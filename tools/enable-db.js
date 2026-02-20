const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const pkgName = process.argv[2];

if (!pkgName) {
  console.error('❌ Uso: pnpm db:enable <nombre-del-paquete>');
  process.exit(1);
}

const targetPath = path.join(__dirname, '../packages', pkgName);

if (!fs.existsSync(targetPath)) {
  console.error(`❌ El paquete "${pkgName}" no existe en packages/`);
  process.exit(1);
}

console.log(`📡 Conectando "${pkgName}" al núcleo de datos de Lexis...`);

// 1. Añadir la dependencia local
spawnSync('pnpm', ['add', '@lexis/database', '--filter', pkgName], {
  stdio: 'inherit',
  shell: true,
});

// 2. Boilerplate inteligente
const packageJson = require(path.join(targetPath, 'package.json'));

// Si es NestJS
if (packageJson.dependencies && packageJson.dependencies['@nestjs/common']) {
  console.log('🧱 Detectado NestJS. Generando PrismaService...');
  
  const serviceContent = `import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { db } from '@lexis/database';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public client = db;

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
`;
  
  const srcPath = path.join(targetPath, 'src');
  if (fs.existsSync(srcPath)) {
    fs.writeFileSync(path.join(srcPath, 'prisma.service.ts'), serviceContent);
    console.log(`✅ prisma.service.ts creado en packages/${pkgName}/src/`);
  }
}

console.log(`
✨ ¡Prisma habilitado en "${pkgName}"!`);
console.log(`💡 Ahora puedes importar 'db' o usar el PrismaService generado.`);
