const express= require('express');
const router=express.Router()
const {registeredUser,authUser,allUsers} = require('../Controllers/userControllers')
const {protect}=require('../Middleware/authMiddleware')
const { getRecommendedSeniors } = require("../Controllers/userControllers");

router.get("/seniors", getRecommendedSeniors);

router.route('/').post(registeredUser).get(protect,allUsers);

router.post("/login", authUser);

module.exports=router;