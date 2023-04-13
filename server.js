//server.js

const express = require('express');
const port =  8008;
const http = require('http')
const path = require('path');
const fs = require('fs');
const app = http.createServer(requestHandler);

const io = require('socket.io')(app,{
    path:'/socket.io'
})

var users={};


function requestHandler(req,res){

    console.log(`Recieved a request from ${req.url}`);

    var filePath = './client' + req.url;
    if(filePath=='./client/'){
        filePath = './client/index.html' 
    }

    var ext = String(path.extname(filePath)).toLowerCase();

    console.log(`serving ${filePath}`);

    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
      }

      var contentType = mimeTypes[ext] || 'application/octet-stream';

      fs.readFile(filePath,function(error,content){

        if(error){

            if(error.code=='ENOENT'){

                fs.readFile('./client/404.html', function (error, content) {
                    res.writeHead(404, { 'Content-Type': contentType })
                    res.end(content, 'utf-8')
                  })
            }else{

                res.writeHead(500)
                res.end('Sorry, there was an error: ' + error.code + ' ..\n')
            }

            }else{
                
                res.writeHead(200, { 'Content-Type': contentType })
                res.end(content, 'utf-8')
            }

        })

    }
      


//INITIATE SOCKET IO FOR COMMUNICATION



//Imports socket.io and attaches it to our app server
io.attach(app,{

    cors: {
        cors: {
            origin: "http://localhost",
            methods: ["GET", "POST"],
            credentials: true,
            transports: ["websocket", "polling"],
          },
          allowEIO3: true,
    }
})
 
io.on('connection',(socket)=>{


    console.log("New connected socket ",socket.id);


// on new connection 
    socket.on("new-connection",(data)=>{

        console.log("new connection recieved ", data);

        users[socket.id] = data.username ;

        console.log("users connected" , users);

        //emit welcome message event

        socket.emit("welcome-message",{
            user:"server",
            message: `Welcome to this Chat ${data.username}. There are ${Object.keys(users).length} users connected`,


        });
    });

// handles message posted by client

socket.on("new-message",(data)=>{

    console.log("new message from client : ",data.user);

    
    socket.broadcast.emit("broadcast-message",{

        user: users[data.user],
        message : data.message

        
    })
})



})



app.listen(port,()=>{

    console.log("Connected At Port : ",port);

})
