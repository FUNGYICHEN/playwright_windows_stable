require('dotenv').config({ quiet: true });

exports.config = {
  baseURL: process.env.BASE_URL || 'https://dev-lt.t9platform.com/',
  loginUser: process.env.LOGIN_USER || 'dlttest01',
  loginPassword: process.env.LOGIN_PASSWORD || 'ab123456',
};
