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

server.listen(3002);