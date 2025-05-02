import 'dotenv/config';

const env = process.env;

export const environment = {
  APP_PORT: Number(env.APP_PORT),

  gemini: {
    API_KEY: env.API_KEY,
    MODEL_NAME: String(env.MODEL_NAME),
    MODEL_NAME2: String(env.MODEL_NAME2),
  },

  twitch: {
    CLIENT_ID: env.TWITCH_CLIENT_ID,
    CLIENT_SECRET: env.TWITCH_CLIENT_SECRET,
    ACCESS_TOKEN: env.TWITCH_ACCESS_TOKEN,
    REFRESH_TOKEN: env.TWITCH_REFRESH_TOKEN,
    USER_ID: env.TWITCH_USER_ID,
    USER_NAME: env.TWITCH_USER_NAME,
  },

  db: {
    USER: env.POSTGRES_USER,
    PASSWORD: env.POSTGRES_PASSWORD,
    HOST: env.POSTGRES_HOST,
    PORT: Number(env.POSTGRES_PORT),
    NAME: env.POSTGRES_DB,
  },
};
