const express = require('express');
const router = express.Router();
const {googleLoginController} = require("../controllers/googleAuthController");

router.post('/auth',googleLoginController);

module.exports = router;