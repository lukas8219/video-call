const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");

const server = require("http").Server(app);

const io = require("socket.io")(server, );


const peerapp = require('express')();
const peerServer = require('http').createServer(peerapp);
const { ExpressPeerServer } = require("peer");

app.use("/peerjs", ExpressPeerServer(peerServer, {
    debug: true,
  }));

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

app.use(express.static(__dirname));
app.set("view engine", "ejs");

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
  });
});

peerServer.listen(9000);

server.listen(3030);
