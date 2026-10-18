import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read openapi.json from project root
const openapiPath = path.resolve(__dirname, '../../openapi.json');
let swaggerDocument = {};

try {
  const fileContent = fs.readFileSync(openapiPath, 'utf8').replace(/^\uFEFF/, '');
  swaggerDocument = JSON.parse(fileContent);
} catch (err) {
  console.warn('[WARN] Could not load openapi.json for Swagger UI:', err.message);
}

export const setupSwagger = (app) => {
  app.get('/openapi.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
  });

  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      customSiteTitle: 'Lifelink API Documentation',
      customCss: '.swagger-ui .topbar { display: none }'
    })
  );
};
