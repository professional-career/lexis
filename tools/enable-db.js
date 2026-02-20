const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const pkgName = process.argv[2];

if (!pkgName) {
  console.error('❌ Uso: pnpm db:enable <nombre-del-paquete>');
  process.exit(1);
}

const dbPkgPath = path.join(__dirname, '../packages/database');
const targetPkgPath = path.join(__dirname, '../packages', pkgName);

// --- FUNCIÓN DE AUTOSANACIÓN ---
function ensureDatabaseCore() {
  if (fs.existsSync(path.join(dbPkgPath, 'package.json'))) return;

  console.log('⚠️  Núcleo de datos no encontrado. Reconstruyendo @lexis/database...');

  // 1. Crear directorios
  fs.mkdirSync(path.join(dbPkgPath, 'src'), { recursive: true });
  fs.mkdirSync(path.join(dbPkgPath, 'prisma'), { recursive: true });

  // 2. Crear package.json
  const pkgJson = {
    name: "@lexis/database",
    version: "1.0.0",
    main: "dist/index.js",
    types: "dist/index.d.ts",
    scripts: {
      "db:generate": "prisma generate",
      "db:migrate": "prisma migrate dev",
      "build": "tsc"
    },
    dependencies: { "@prisma/client": "^5.10.0" },
    devDependencies: { "prisma": "^5.10.0", "typescript": "^5.1.3" }
  };
  fs.writeFileSync(path.join(dbPkgPath, 'package.json'), JSON.stringify(pkgJson, null, 2));

  // 3. Crear schema.prisma
  const schema = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    String  @id @default(cuid())
  email String  @unique
  name  String?
}`;
  fs.writeFileSync(path.join(dbPkgPath, 'prisma/schema.prisma'), schema);

  // 4. Crear index.ts
  const indexTs = `export * from '@prisma/client';\nimport { PrismaClient } from '@prisma/client';\nexport const db = new PrismaClient();`;
  fs.writeFileSync(path.join(dbPkgPath, 'src/index.ts'), indexTs);

  console.log('✅ Núcleo de datos restaurado. Sincronizando workspace...');
  spawnSync('pnpm', ['install'], { stdio: 'inherit', shell: true });
}

// --- FLUJO PRINCIPAL ---

if (!fs.existsSync(targetPkgPath)) {
  console.error(`❌ El paquete "${pkgName}" no existe en packages/`);
  process.exit(1);
}

// Aseguramos que el núcleo existe antes de intentar vincularlo
ensureDatabaseCore();

console.log(`📡 Conectando "${pkgName}" al núcleo de datos de Lexis...`);

// Añadir la dependencia local usando el protocolo workspace
spawnSync('pnpm', ['add', '@lexis/database@workspace:*', '--filter', pkgName], {
  stdio: 'inherit',
  shell: true,
});

// Boilerplate inteligente para NestJS
const targetPkgJson = require(path.join(targetPkgPath, 'package.json'));
if (targetPkgJson.dependencies && targetPkgJson.dependencies['@nestjs/common']) {
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
  
  const srcPath = path.join(targetPkgPath, 'src');
  if (fs.existsSync(srcPath)) {
    fs.writeFileSync(path.join(srcPath, 'prisma.service.ts'), serviceContent);
    console.log(`✅ prisma.service.ts creado en packages/${pkgName}/src/`);
  }
}

console.log(`\n✨ ¡Prisma habilitado en "${pkgName}"!`);
