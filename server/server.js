const express = require("express");
const mongoose = require("./database/database");
const userRoutes = require("./routes/userRoutes");
const app = express();
const config = require("./config/config");

app.use(express.json());

app.use('/user',userRoutes);

app.listen(config.PORT,()=>{
    console.log(`server running at ${config.PORT}`);
});