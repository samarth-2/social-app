const Post = require("../models/post");
const createPostService =async(title,content,user)=>{
    const post = await Post.create({
        title:title,
        content:content,
        author:user.userId
    });
    const postObj = post.toObject();
    return postObj;
}

const getPostsByUserService =async(user)=>{
    const posts = await Post.find({ author: user.userId })
      .sort({ createdAt: -1 }) 
      .populate("author", "name email username"); 
    return posts;    
}

const deletePostService =async(postId,authorId)=>{

    const deletedPost = await Post.findOneAndDelete({ _id: postId, author: authorId});
    
    if (!deletedPost) {
      throw new Error("Post not found or you are not authorized to delete this post");
    }

    return deletedPost;
  
}

module.exports ={
    createPostService,
    getPostsByUserService,
    deletePostService
}