const { createPostService,getPostsByUserService ,deletePostService } = require("../services/postService");
const {getIO} = require("../socket/socket");

const createPostController = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            res.status(400).json({ message: "title and content are required" });
        }
        const post = await createPostService(title, content, req.user);
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

module.exports={
    createPostController,
    getAllPostController,
    deletePostController
}