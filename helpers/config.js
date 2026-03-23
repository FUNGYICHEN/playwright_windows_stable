require('dotenv').config({ quiet: true });

exports.config = {
  baseURL: process.env.BASE_URL || 'https://your-dev-site.example.com/',
  loginUser: process.env.LOGIN_USER || 'your_test_user',
  loginPassword: process.env.LOGIN_PASSWORD || 'your_test_password',
};
