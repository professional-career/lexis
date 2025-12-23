// tools/setup.js
const fs = require('fs');
const path = require('path');

// 1. Definimos las rutas a la RAÍZ del monorepo
// Asumimos que este script está en la carpeta /tools/
const rootDir = path.join(__dirname, '..'); 
const envExample = path.join(rootDir, '.env.example');
const envTarget = path.join(rootDir, '.env');

console.log('⚙️  Verificando configuración de entorno...');

// 2. Verificamos si existe el ejemplo maestro
if (!fs.existsSync(envExample)) {
  console.error('❌ Error: No se encontró el archivo .env.example en la raíz.');
  process.exit(1);
}

// 3. Si no existe el .env real, lo creamos copiando el ejemplo
if (!fs.existsSync(envTarget)) {
  fs.copyFileSync(envExample, envTarget);
  console.log('✅ Archivo .env creado en la raíz (copiado de .env.example)');
} else {
  console.log('ℹ️  El archivo .env ya existe en la raíz. No se realizaron cambios.');
}