const mongoose = require("mongoose");
const config = require("../config/config")

mongoose.connect(config.MONGO_URL).then(()=>{
    console.log("database connected");
}).catch((err)=>{
    console.log("mongo error occured : ",err);
})

module.exports=mongoose