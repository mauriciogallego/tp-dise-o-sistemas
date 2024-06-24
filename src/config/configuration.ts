export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiration: process.env.JWT_EXPIRATION || '10y',
  },
  port: process.env.PORT || 3000,
});
