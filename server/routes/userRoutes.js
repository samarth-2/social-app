const express = require('express');
const router = express.Router();
const {signupController,signinController, followUserController, unfollowUserController, getRandomUsersController, getActiveUsersController, getUserProfileController} = require("../controllers/authController");
const authMiddleware = require('../utils/authmiddleware');

router.get('/login',(req,res)=>{
    res.json({"hello":"world"});
})

router.post('/signup',signupController);
router.post('/signin',signinController);
router.post('/follow',authMiddleware,followUserController);
router.post('/unfollow',authMiddleware,unfollowUserController);
router.get('/random',authMiddleware,getRandomUsersController);
router.get('/active',authMiddleware,getActiveUsersController);
router.get("/profile/:userId", getUserProfileController);

module.exports = router;