const mongoose=require('mongoose');
require("dotenv").config();

const conn=async()=>{
    try{
        await mongoose.connect(`${process.env.URI}`);
        console.log("Connection to database is successful");
    }catch(err){
        console.log(err);
    }
};
conn();