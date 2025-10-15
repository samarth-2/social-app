const express = require("express");
const router = express.Router();
const authMiddleware=require("../utils/authmiddleware");
const {createPostController,getAllPostController, deletePostController ,getPaginatedPosts} = require("../controllers/postController");

router.use(authMiddleware);

router.post('/create-post',createPostController);
router.get('/get-all',getAllPostController);
router.post('/delete-post',deletePostController);
router.get("/feed", getPaginatedPosts);

module.exports=router;