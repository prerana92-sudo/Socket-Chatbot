//  client / chat.js

console.log('chat file loaded !!!');



var socket = io.connect();

//prompt to ask user's name

const username = prompt("Welcome ! Please enter your name");

//emit new event with username 

socket.emit("new-connection",{username})

//handle welcome message event 

socket.on("welcome-message",(data)=>{
    console.log("Welcome message ", data)

    addMessage(data, false)
})


//add messages funtion (receives two params, the message and if it was sent by yourself)

function addMessage(data, isSelf = false){

    const messageElement = document.createElement("div");
    messageElement.classList.add("Message")

    if(isSelf){

        //message by self 

        messageElement.classList.add("self-message");
        messageElement.innerText = `${data.message}`;

    }else
    if(data.user === "server"){

           // message is from the server, like a notification of new user connected

           messageElement.innerText = `${data.message}`;


    }else{

        //message by others 

        messageElement.classList.add("others-message");
        messageElement.innerText = `${data.user} : ${data.message}`;
    }

          // get chatContainer element from our html page

    const chatContainer = document.getElementById("chatContainer");

     // adds the new div to the message container div

     chatContainer.append(messageElement);


    
}



const messageForm = document.getElementById("messageForm");
messageForm.addEventListener("submit", (e) =>{

    e.preventDefault();

    const messageInput = document.getElementById("messageInput");

    if(messageInput.value !== ""){

        let newMessage = messageInput.value ;
        socket.emit("new-message",{user: socket.id , message: newMessage });

        addMessage({message: newMessage}, true);
        messageInput.value = "";

    }else{

           // adds error styling to input

        message.classList.add("error");
    }

});


socket.on("broadcast-message", (data) => {
    console.log("broadcast-message event >> ", data);
    // appends message in chat container, with isSelf flag false
    addMessage(data, false);
  });
