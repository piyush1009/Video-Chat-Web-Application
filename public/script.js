const socket=io('/') //reference to socket and connecting a path

socket.emit('join-room',ROOM_ID,10)  //sent event to server
socket.on('user-connected',userId => {  //Listening to user connected message
    console.log('User connected'+userId);
});