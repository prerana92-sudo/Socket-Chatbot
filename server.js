const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const port = 6000;
const app = express();

dotenv.config();

app.post('/user/generateToken',(req,res)=>{

    const secret_key = process.env.JWT_SECRET_KEY
    let userData = {
        userId: 10,
        time: Date()
    }
    let token = jwt.sign(userData, secret_key);
    res.send(token);

})


app.get('/user/validateToken',(req,res)=>{

     const header_key = process.env.TOKEN_HEADER_KEY
     const secret_key = process.env.JWT_SECRET_KEY
      
     try{
         
      
        const token = req.header(header_key);
        
        let verify = jwt.verify(token,secret_key);
        if(verify){
            res.send("Successfully verified ")
        }
        else{
            res.status(400).send(error);
        }

     }catch(e){

        return res.status(400).send(e);
     }


})

app.listen(port,()=>{
    console.log("You are connected at : ",port);
})
