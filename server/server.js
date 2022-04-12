const path = require('path');
const express = require('express')
const app = express()
const server = require("http").createServer(app)
const io = require('socket.io')(server)
const cors = require('cors')
const PORT = process.env.PORT || 3005

app.use(express.json());
app.use(express.urlencoded({ extended:false }));
app.use(cors());

// app with static routes
app.use(express.static(path.join(__dirname,"..","public")))

io.on("connection",(socket)=>{
    console.log(`connecteion establised id:${process.pid}`)
})

app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})