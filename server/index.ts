const express = require('express');
const { ExpressPeerServer } = require('peer');

const app = express();

app.get('/', (_req, res, _next) => {
  res.send('Hello and welcome to this server!');
});

const server = app.listen(9000);

const peerServer = ExpressPeerServer(server, {
  path: '/'
});

app.use('/peerjs', peerServer);

peerServer.on('connection', (client) => {
  console.log('client connected', client.id);
});

peerServer.on('disconnect', (client) => {
  console.log('client disconnected', client.id);
});
