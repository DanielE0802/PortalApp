export const config = {
  general: {
    port: process.env.PORT,
    env: 'production',
  },
  db: {
    schema: 'public',
    synchronize: false,
  },
  swagger: {
    url: '',
    enable: false,
  },
};
