export const IS_DEV = process.env.ENV === 'development';
export const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';
export const COOKIE_AUTH = process.env.COOKIE_AUTH === 'true';
console.log(`Environment: ${IS_DEV ? 'Development' : 'Production'}`);
console.log(
  process.env.COOKIE_AUTH === 'false'
    ? 'Cookie auth is disabled'
    : 'Cookie auth is enabled',
);
