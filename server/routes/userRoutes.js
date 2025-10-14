const express = require('express');
const router = express.Router();
const {signupController,signinController} = require("../controllers/authController");
router.get('/login',(req,res)=>{
    res.json({"hello":"world"});
})

router.post('/signup',signupController);
router.post('/signin',signinController);


module.exports = router;