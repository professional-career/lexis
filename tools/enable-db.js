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

// --- FUNCIÓN DE AUTOSANACIÓN (Prisma 7 + Adapters) ---
function ensureDatabaseCore() {
  if (fs.existsSync(path.join(dbPkgPath, 'package.json'))) return;

  console.log('⚠️  Núcleo de datos no encontrado. Reconstruyendo @lexis/database (Prisma 7 Standard)...');

  fs.mkdirSync(path.join(dbPkgPath, 'src'), { recursive: true });
  fs.mkdirSync(path.join(dbPkgPath, 'prisma'), { recursive: true });

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
    dependencies: { 
      "@prisma/client": "7.4.1",
      "@prisma/adapter-pg": "7.4.1",
      "pg": "^8.11.0"
    },
    devDependencies: { "prisma": "7.4.1", "typescript": "^5.1.3", "dotenv": "^16.4.0", "@types/pg": "^8.11.0" }
  };
  fs.writeFileSync(path.join(dbPkgPath, 'package.json'), JSON.stringify(pkgJson, null, 2));

  // Prisma 7 Config
  const prismaConfig = `import { defineConfig } from 'prisma/config';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
});`;
  fs.writeFileSync(path.join(dbPkgPath, 'prisma.config.ts'), prismaConfig);

  // Prisma 7 Schema
  const schema = `generator client {
  provider = "prisma-client-js"
  moduleFormat = "cjs"
}

datasource db {
  provider = "postgresql"
}`;
  fs.writeFileSync(path.join(dbPkgPath, 'prisma/schema.prisma'), schema);

  const indexTs = `export * from '@prisma/client';\nimport { PrismaClient } from '@prisma/client';\nexport { PrismaClient };`;
  fs.writeFileSync(path.join(dbPkgPath, 'src/index.ts'), indexTs);

  console.log('✅ Núcleo de datos restaurado. Sincronizando workspace...');
  spawnSync('pnpm', ['install'], { stdio: 'inherit', shell: true });
}

// --- FLUJO PRINCIPAL ---

if (!fs.existsSync(targetPkgPath)) {
  console.error(`❌ El paquete "${pkgName}" no existe en packages/`);
  process.exit(1);
}

ensureDatabaseCore();

console.log(`📡 Conectando "${pkgName}" al núcleo de datos de Lexis...`);

// Añadir contratos y base de datos
spawnSync('pnpm', ['add', '@lexis/database@workspace:*', '--filter', pkgName], {
  stdio: 'inherit',
  shell: true,
});

const targetPkgJson = require(path.join(targetPkgPath, 'package.json'));
if (targetPkgJson.dependencies && targetPkgJson.dependencies['@nestjs/common']) {
  console.log('🧱 Detectado NestJS. Generando PrismaService (Prisma 7 Adapter Standard)...');
  
  const serviceContent = `import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@lexis/database';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
`;
  
  const srcPath = path.join(targetPkgPath, 'src');
  if (fs.existsSync(srcPath)) {
    fs.writeFileSync(path.join(srcPath, 'prisma.service.ts'), serviceContent);
    console.log(`✅ prisma.service.ts creado en packages/${pkgName}/src/`);
  }
}

console.log(`\n✨ ¡Prisma 7 (with Adapters) habilitado en "${pkgName}"!`);
