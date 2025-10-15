const express = require('express');
const router = express.Router();
const authMiddleware = require('../utils/authmiddleware');
const { getUsersForChatController } = require('../controllers/chatController');


router.post('/get-contacts',authMiddleware,getUsersForChatController);

module.exports=router;