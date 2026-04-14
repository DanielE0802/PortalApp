export const config = {
  general: {
    port: process.env.PORT,
    env: 'development',
  },
  db: {
    schema: 'public',
    synchronize: true,
    logging: true,
  },
};
