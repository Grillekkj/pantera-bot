import { LocalAuth } from 'whatsapp-web.js';

export const PUPPETEER_ARGS = [
  // Flags para evitar problemas de execução em servidores sem interface gráfica
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-accelerated-2d-canvas',
  '--no-first-run',
  '--disable-gpu',
];

export const WHATSAPP_CLIENT_OPTIONS = {
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: PUPPETEER_ARGS,
  },
};
