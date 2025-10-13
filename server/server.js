const express = require("express");
const app = express();
const config = require("./config/config");

app.listen(config.PORT,()=>{
    console.log(`server running at ${config.PORT}`);
});