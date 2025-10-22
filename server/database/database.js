const mongoose = require("mongoose");
const config = require("../config/config");

async function connect() {
    const conn = await mongoose.connect(config.MONGO_URL, { });
    console.log("database connected");
    return mongoose;
}

async function disconnect() {
    await mongoose.disconnect();
    console.log("database disconnected");
}

module.exports = mongoose;
module.exports.connectDB = connect;
module.exports.disconnectDB = disconnect;