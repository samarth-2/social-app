const express = require("express");
const mongoose = require("./database/database");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const app = express();
const config = require("./config/config");

app.use(express.json());

app.use('/user',userRoutes);
app.use('/post',postRoutes);
app.use('/comment',commentRoutes);

app.listen(config.PORT,()=>{
    console.log(`server running at ${config.PORT}`);
});