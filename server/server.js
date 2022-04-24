const path = require('path');
const express = require('express');
const app = express();
const server = require("http").createServer(app);
const io = require('socket.io')(server);
const cors = require('cors');
const PORT = process.env.PORT || 3005;

/////////////////////
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/isRealString');
const {Users} = require('./utils/users');

// express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended:false }));
app.use(cors());

// app with static routes
app.use(express.static(path.join(__dirname,"..","public")));

////////////////////////////////
let users = new Users();


io.on('connection', (socket) => {
    console.log("A new user connected",socket.id);
  
    socket.on('join', (params, callback) => {
      if(!isRealString(params.name) || !isRealString(params.room)){
        return callback('Name and room are required');
      }
  
      socket.join(params.room);
      users.removeUser(socket.id);
      users.addUser(socket.id, params.name, params.room);
  
      io.to(params.room).emit('updateUsersList', users.getUserList(params.room));
      socket.emit('newMessage', generateMessage('Admin', `Welocome to ${params.room}!`));
  
      socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', "New User Joined!"));
  
      callback();
    })
  
    socket.on('createMessage', (message, callback) => {
      let user = users.getUser(socket.id);
  
      if(user && isRealString(message.text)){
          io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
      }
      callback('This is the server:');
    })
  
    socket.on('createLocationMessage', (coords) => {
      let user = users.getUser(socket.id);
  
      if(user){
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.lat, coords.lng))
      }
    })
  
    socket.on('disconnect', () => {
      let user = users.removeUser(socket.id);
  
      if(user){
        io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
        io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left ${user.room} chat room.`))
      }
    });
  });
  




server.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`);
    // check also http://localhost:3005/socket.io/socket.io.js
    // To see the the socket.io extension to help make connection to FE and to your server.
    // so add "/socket.io/socket.io.js" this script src to your HTML body
});

