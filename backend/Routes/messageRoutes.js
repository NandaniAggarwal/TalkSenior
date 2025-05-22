const express=require('express');
const router=express.Router();
const {protect}=require('../Middleware/authMiddleware.js');
const {sendMessage,allMessages}= require('../Controllers/messageControllers.js')

router.route("/").post(protect,sendMessage);
router.route("/:chatId").get(protect,allMessages);

module.exports=router;