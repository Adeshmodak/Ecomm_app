const express = require('express')
const { registerUser, loginuser, logoutuser, forgotpassword,resetPassword } = require('../controllers/usercontroller')
const router=express.Router()

router.route("/register").post(registerUser);

router.route("/login").post(loginuser);

router.route("/password/forgot").post(forgotpassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logoutuser);

module.exports=router;


