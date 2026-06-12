import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sources = [
  join(root, 'firebase-config.json'),
  join(root, 'firebase-config.js'),
];

function parseConfig(text) {
  const trimmed = text.trim();

  if (trimmed.startsWith('{')) {
    try {
      return JSON.parse(trimmed);
    } catch {
      const match = trimmed.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
    }
  }

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Firebase config object not found in file');

  const obj = {};
  const pairs = match[0].matchAll(/["']?(\w+)["']?\s*:\s*["']([^"']+)["']/g);
  for (const [, key, value] of pairs) {
    obj[key] = value;
  }
  return obj;
}

const required = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

let text = '';
for (const file of sources) {
  if (existsSync(file)) {
    text = readFileSync(file, 'utf8');
    if (!text.includes('Error:') && !text.includes('HTTP Error')) break;
    text = '';
  }
}

if (!text) {
  console.error('Put Firebase config into firebase-config.json or firebase-config.js');
  process.exit(1);
}

const cfg = parseConfig(text);
for (const key of required) {
  if (!cfg[key]) throw new Error(`Missing field: ${key}`);
}

const env = [
  `VITE_FIREBASE_API_KEY=${cfg.apiKey}`,
  `VITE_FIREBASE_AUTH_DOMAIN=${cfg.authDomain}`,
  `VITE_FIREBASE_PROJECT_ID=${cfg.projectId}`,
  `VITE_FIREBASE_STORAGE_BUCKET=${cfg.storageBucket}`,
  `VITE_FIREBASE_MESSAGING_SENDER_ID=${cfg.messagingSenderId}`,
  `VITE_FIREBASE_APP_ID=${cfg.appId}`,
  '',
].join('\n');

writeFileSync(join(root, '.env'), env, 'utf8');
console.log('.env created successfully!');
