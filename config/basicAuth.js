const express = require('express');
const basicAuth = require('express-basic-auth');
const app = express();

module.exports = app.use(
  basicAuth({
    users: {
      atalie: 'atalie123',
      fufu: 'fufu123',
      admin: 'tendaku123',
    },
    challenge: true,
    unauthorizedResponse: getUnauthorizedResponse,
  })
);

function getUnauthorizedResponse(req) {
  return req.auth
    ? 'Credentials ' + req.auth.user + ':' + req.auth.password + ' is Invalid'
    : 'No credentials provided';
}
