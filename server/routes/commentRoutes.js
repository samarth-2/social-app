const express = require("express");
const router = express.Router();
const authMiddleware=require("../utils/authmiddleware");
const {
    createCommentController,
    getCommentByPostController,
    updateCommentController,
    deleteCommentController
} = require("../controllers/commentController");


router.use(authMiddleware);

router.post('/create',createCommentController);
router.get('/get-by-post',getCommentByPostController);
router.post('/update',updateCommentController);
router.post('/delete',deleteCommentController);

module.exports=router;