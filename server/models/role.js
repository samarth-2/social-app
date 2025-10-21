const mongoose = require("../database/database")
const roleSchema= new mongoose.Schema(
    {
        name:{type:String,required:true,index:true},
        permission_level: {
            type: String,
            enum: ["*", "#"],
            default: "#",
        },
        permissions:[{type:mongoose.Schema.Types.ObjectId,ref:"Permission"}]

    }
)
roleSchema.index({ permission_level: 1 });

const Role = mongoose.model("Role",roleSchema);

module.exports={Role};