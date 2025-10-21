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

permissionSchema.index({ "routes.path": 1, "routes.method": 1 });


const Permission = mongoose.model("Permission",permissionSchema);

module.exports={Permission};