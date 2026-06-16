import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url'; // 👈 add pathToFileURL

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fileNameToRoute(filename) {
  const name = filename.replace('.js', '');
  return '/' + name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

async function loadRoutes() {
  const files = fs.readdirSync(__dirname);
  
  console.log("---------------------------------------------")
  for (const file of files) {
    if (file === 'index.js' || !file.endsWith('.js')) continue;

    const routePath = fileNameToRoute(file);
    const fullPath = path.join(__dirname, file);
    const fileUrl = pathToFileURL(fullPath).href; // 👈 converts D:\... to file:///D:/...

    try {
      const routeModule = await import(fileUrl);
      console.log(`✅ Loaded route: ${routePath} ← ${file}`);
      router.use(routePath, routeModule.default);
    } catch (err) {
      console.error(`❌ Failed to load route: ${file}`, err.message);
    }
  }
      console.log("---------------------------------------------")
}

await loadRoutes();

export default router;