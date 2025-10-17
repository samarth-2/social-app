const express = require("express");
const router = express.Router();
const authMiddleware = require("../utils/authmiddleware");

router.use(authMiddleware);

router.use('/');