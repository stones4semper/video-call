const express = require('express');
const { ExpressPeerServer } = require('peer');
const app = express();
const http = require('http');

app.get('/', (req, res, next) => res.send('Hello world!'));
const myUnqID = () => (Math.random().toString(36) + '0000000000000000000').substr(2, 16);

const server = http.createServer(app);
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/myapp',
  generateClientId: `Eloike-${myUnqID}`
});

app.use('/peerjs', peerServer);

server.listen(9000);