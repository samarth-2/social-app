const Post = require("../models/post");
const Comment = require("../models/comment");
const { createPostService,getPostsByUserService ,deletePostService } = require("../services/postService");
const {getIO} = require("../socket/socket");

const createPostController = async (req, res) => {
    try {
        const { title, content ,imageUrl } = req.body;
        if (!title || !content || !imageUrl) {
            res.status(400).json({ message: "title and content are required" });
        }
        const post = await createPostService(title, content,imageUrl , req.user);
        const io = getIO();
        io.emit("new_post_added", { username: req.user.username });
        console.log("emitted");
        return res.status(201).json({ message: "post created successfully", data: post });

    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ message: error.message });
    }

}

const getAllPostController = async(req,res)=>{
    try{
        const posts =await getPostsByUserService(req.user);
        return res.status(200).json({message:"posts fetched successfully",data:posts});     
    }catch(error){
        return res.status(400).json({ message: error.message });
    }
}


const deletePostController = async(req,res)=>{
    try{
        const {postId} = req.body;
        const userId  = req.user.userId;
        
        const deletedPost = await deletePostService(postId,userId);

        return res.status(200).json({
            message:"post deleted successfully",
            data:deletedPost
        });
    }catch(error){
        return res.status(400).json({message:error.message});
    }
}

const getPaginatedPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
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

    return res.json({
      success: true,
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
    });
  } catch (error) {
    console.error("Error fetching paginated posts:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports={
    createPostController,
    getAllPostController,
    deletePostController,
    getPaginatedPosts
}