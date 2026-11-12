import path from 'path';
import customEnv from 'custom-env';

// Loads environment variables
const environment = process.env.NODE_ENV;
// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
customEnv.env(environment, path.resolve(__dirname, '../../env'));

export default () => ({
  common: {
    NODE_ENV: process.env.NODE_ENV,
    APP_NAME: process.env.APP_NAME,
  },
  firebase: {
    FIREBASE_SERVICE_ACCOUNT_JSON: process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
  },
});
