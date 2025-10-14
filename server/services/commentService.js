const Comment = require("../models/comment");
const createCommentService =async(text,postId,authorId)=>{
    const comment = await Comment.create({
        text:text,
        author:authorId,
        post:postId
    });
    const commentObj = comment.toObject();
    return commentObj;
}


const getCommentByPostService=async(postId)=>{
    const comments = await Comment.find({post:postId}).lean();
    if (!comments) {
      throw new Error("comments not found for above post");
    }
    return comments;
}

const updateCommentService = async(commentId,authorId,text)=>{
    const updatedComment = await Comment.findOneAndUpdate({_id:commentId,author:authorId},{$set:{text:text}},{new:true,lean: true});
    if (!updatedComment) {
      throw new Error("comment not found or you are not authorized to update this comment");
    }
    return updatedComment;
}

const deleteCommentService = async(commentId,authorId)=>{
    const deletedComment = await Comment.findOneAndDelete({ _id: commentId, author: authorId}).lean();
    
    if (!deletedComment) {
      throw new Error("comment not found or you are not authorized to delete this comment");
    }

    return deletedComment;
};


module.exports={
    createCommentService,
    getCommentByPostService,
    deleteCommentService,
    updateCommentService
}