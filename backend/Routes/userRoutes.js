const express= require('express');
const router=express.Router()
const {registeredUser,authUser,allUsers} = require('../Controllers/userControllers')
const {protect}=require('../Middleware/authMiddleware')


router.route('/').post(registeredUser).get(protect,allUsers);
//router.route('/login').get(authUser);
//router.route("/").post(registeredUser).get(protect,allUsers);
router.post("/login", authUser);

module.exports=router;