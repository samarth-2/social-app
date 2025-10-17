const mongoose = require("../database/database")
const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String }, 
  routes: [
    {
      path: { type: String, required: true },   
      method: { type: String, required: true }, 
    },
  ],
});


const Permission = mongoose.model("Permission",permissionSchema);

module.exports={Permission};