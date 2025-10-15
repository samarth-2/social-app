const { getUsersForChatService } = require("../services/authService");

const getUsersForChatController=async(req,res)=>{
  try{
      const users = await getUsersForChatService(req.user.userId);
      console.log(users);
      return res.status(200).json({message:"users fetched successfully",data:users});
  }catch(error){
    res.status(400).json({ message: err.message });
  }
}


module.exports={
    getUsersForChatController
}