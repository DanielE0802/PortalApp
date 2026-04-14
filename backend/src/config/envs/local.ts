export const config = {
  general: {
    port: process.env.PORT,
    env: 'local',
  },
  db: {
    schema: 'public',
    synchronize: true,
    logging: true,
  },
};
