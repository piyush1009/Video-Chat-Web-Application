const socket=io('/') //reference to socket and connecting a path

const myPeer = new Peer(undefined, { //undefined because we are let the server take care of generating our own id.
    host: '/',
    port: '3003'
});

socket.emit('join-room',ROOM_ID,10)  //sent event to server
socket.on('user-connected',userId => {  //Listening to user connected message
    console.log('User connected'+userId);
});