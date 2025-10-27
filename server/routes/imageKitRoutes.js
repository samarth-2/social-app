const express = require("express");
const router = express.Router();
const ImageKit = require("imagekit");
const config = require("../config/config");
const authMiddleware = require("../utils/authmiddleware");

const imagekit = new ImageKit({
    publicKey: config.IMAGEKIT_PUBLIC_KEY,
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
});

router.get("/auth",authMiddleware, (req, res) => {
    try {
        const result = imagekit.getAuthenticationParameters();
        res.json(result);
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;