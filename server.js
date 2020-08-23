const express=require('express');
const app=express();
const server=require('http').Server(app);//create a server based on express server and then passes it to socket.io
const io=require('socket.io')(server);
const { v4: uuidV4 } = require('uuid')   //for dynamic url

app.set('view engine','ejs');
app.use(express.static('public'));


app.get('/',(req,res) => {
    res.redirect(`/${uuidV4()}`)  //Pass to room
});

app.get('/:room', (req, res) => {   //room is dynamic parameter
    res.render('room', { roomId: req.params.room })
});

io.on('connection', socket => {    //if anyone connects to our webpage and socket for actuslly socket user is connected through
    //setting events to listen to
    socket.on('join-room',(roomId,userId) => {
        socket.join(roomId); //to join room
        socket.to(roomId).broadcast.emit('user-connected', userId)    //to send all users saying user connected
        
        socket.on('disconnect',() => {   //for fast user disconnection
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    });
});
server.listen(3002);