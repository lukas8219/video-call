var peer = new Peer();
var sock = io('/');

console.log(ROOM_ID)

peer.on('open' , (id) => {
  sock.emit('join-room', ROOM_ID, id);
})

function renderVideoCall(stream) {
    const vid = document.createElement("video");
    vid.srcObject = stream;
    vid.autoplay = "autoplay";
    vid.style = "background-color: black;";
    document.getElementById("main").appendChild(vid);
}

navigator.mediaDevices
  .getUserMedia({
    video: true,
  })
  .then((stream) => {

    renderVideoCall(stream);

    peer.on('call', (call) => {
      call.answer(stream);

      call.on('stream', (stream) => {
        renderVideoCall(stream);
      });

      call.on('error', () => console.log("ERROR"));
    });

    sock.on('user-connected', (userId) => {

      console.log(userId);

      const call = peer.call(userId, stream);

      call.on('stream', (stream) => {
        renderVideoCall(stream);
      });

    })
  })
  .catch((err) => console.log(err))