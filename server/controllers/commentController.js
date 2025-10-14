const {
    createCommentService,
    getCommentByPostService,
    deleteCommentService,
    updateCommentService
} = require("../services/commentService");


const createCommentController = async(req,res)=>{
    try{
        const {text,postId} =req.body;
        const authorId = req.user.userId;
        const comment = await createCommentService(text,postId,authorId);
        return res.status(201).json({message:"comment create successfully",data:comment});
    }catch(error){
        return res.status(400).json({message:error.message});
    }
}

const getCommentByPostController = async(req,res)=>{
    try{
        const {postId} =req.body;
        const comment = await getCommentByPostService(postId);
        return res.status(200).json({message:"comments fetched successfully",data:comment});
    }catch(error){
        return res.status(400).json({message:error.message});
    }
}
const updateCommentController = async(req,res)=>{
    try{
        const {commentId,text} =req.body;
        const authorId = req.user.userId;
        const comment = await updateCommentService(commentId,authorId,text);
        return res.status(200).json({message:"comment updated successfully",data:comment});
    }catch(error){
        return res.status(400).json({message:error.message});
    }
}
const deleteCommentController = async(req,res)=>{
    try{
        const {commentId} =req.body;
        const authorId = req.user.userId;
        const comment = await deleteCommentService(commentId,authorId);
        return res.status(200).json({message:"comment deleted successfully",data:comment});
    }catch(error){
        return res.status(400).json({message:error.message});
    }
}

module.exports={
    createCommentController,
    getCommentByPostController,
    updateCommentController,
    deleteCommentController
}