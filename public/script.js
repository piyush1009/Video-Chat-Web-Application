const socket=io('/') //reference to socket and connecting a path
const videoGrid=document.getElementById('video-grid');     //get reference to that grid
const myPeer = new Peer(undefined, { //undefined because we are let the server take care of generating our own id.
    host: '/',
    port: '3003'
});
const myVideo = document.createElement('video')  //create video element
myVideo.muted = true  //we mute ourselves

const peers={};  //for storing each individual call

//Try connect to our video
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {    //stream is going to be video and audio
    addVideoStream(myVideo,stream);

    myPeer.on('call',call => {  //for listening when someone calls
        call.answer(stream)   //for me
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {   //for other
            addVideoStream(video, userVideoStream)
        });
    });

    socket.on('user-connected',userId => {  //Listening to user connected message
        connectToNewUser(userId, stream)  //send current stream to new user that is connected
    });
})

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
})
  

//as soon as we connect to our peer server and get back an id then run:
myPeer.on('open',id => {  //id of user
    socket.emit('join-room',ROOM_ID,id)  //sent event to server
})

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)  //we are calling user with userid and sending them our audio and video stream
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {   //when they send their stream back
      addVideoStream(video, userVideoStream) //we are adding other video in our own custom video element on our page
    })
    call.on('close', () => {
      video.remove()
    })
  
    peers[userId] = call
  }
  

//function for myvideo to use stream
function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()  //once we load stream and this video is loaded on this page,we want to load the page
    })
    videoGrid.append(video)
  }
  