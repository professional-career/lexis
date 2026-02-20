import { defineConfig } from 'prisma/config';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Cargamos el .env de la raíz
dotenv.config({ path: path.join(__dirname, '../../.env') });

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
