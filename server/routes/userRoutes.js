const express = require('express');
const router = express.Router();
const {signupController,signinController, followUserController, unfollowUserController} = require("../controllers/authController");
const authMiddleware = require('../utils/authmiddleware');

router.get('/login',(req,res)=>{
    res.json({"hello":"world"});
})

router.post('/signup',signupController);
router.post('/signin',signinController);
router.post('/follow',authMiddleware,followUserController);
router.post('/unfollow',authMiddleware,unfollowUserController);

module.exports = router;