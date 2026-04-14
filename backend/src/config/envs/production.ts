const parseBoolean = (
  value: string | undefined,
  fallback: boolean,
): boolean => {
  if (value === undefined) {
    return fallback;
  }

  return value.toLowerCase() === 'true';
};

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
    path: process.env.SWAGGER_PATH || 'docs',
    enable: parseBoolean(process.env.SWAGGER_ENABLED, false),
  },
};
