const express = require("express");
const { ExpressPeerServer } = require("peer");

const app = express();

const clients = {};

app.get("/", (_req, res, _next) => {
    console.log(clients)
    res.send("Hello world!")
});

const server = app.listen(9000);

const peerServer = ExpressPeerServer(server, {
	path: "/",
});

app.use("/peerjs", peerServer);


peerServer.on('connection', (client) => {
    console.log('client connected', client)
    //clients[''] = client
 });

 peerServer.on('disconnect', (client) => {
    console.log('client disconnected', client)
    //clients[''] = client
  });
