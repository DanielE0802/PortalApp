export const config = {
  general: {
    port: process.env.PORT,
    env: process.env.NODE_ENV,
  },
  db: {
    type: 'postgres',
    url: process.env.DATABASE_URL,
  },
  reqres: {
    apiKey: process.env.REQRES_API_KEY,
    login: {
      baseUrl: process.env.REQRES_BASE_URL,
      resourcePath: '/login',
    },
    userList: {
      baseUrl: process.env.REQRES_BASE_URL,
      resourcePath: '/users',
    },
  },
};
