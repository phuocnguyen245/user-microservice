export default () => ({
  port: parseInt(process.env.PORT ?? '', 10) || 3000,
  database: {},
  SECRET_KEY: process.env.SECRET_KEY,
});
