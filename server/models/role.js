const mongoose = require("../database/database")
const roleSchema= new mongoose.Schema(
    {
        name:{type:String,required:true},
        permission_level: {
            type: String,
            enum: ["*", "#"],
            default: "#",
        },
        permissions:[{type:mongoose.Schema.Types.ObjectId,ref:"Permission"}]

    }
)


const Role = mongoose.model("Role",roleSchema);

module.exports={Role};