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

async function getPaginatedPosts(page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit;

    const posts = await Post.find({})
      .populate("author", "username name email") 
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "username name", 
        },
      })
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit)
      .lean(); 

    const totalPosts = await Post.countDocuments();

    return {
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

module.exports ={
    createPostService,
    getPostsByUserService,
    deletePostService
}