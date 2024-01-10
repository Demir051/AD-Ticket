const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth");

router.get("/login", authController.login_get)

router.get("/register", authController.register_get)

module.exports = router;