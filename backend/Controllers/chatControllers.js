const asyncHandler=require('express-async-handler');
const User=require('../Models/userModel');
const Chat=require('../Models/chatModel');
const sanitize = require('../config/sanitize');

const accessChat = asyncHandler(async(req,res)=>{
  let { userId } = req.body;
  userId = sanitize(userId);
  if (!userId) return res.sendStatus(400);

  // 🔥 FAST lookup (indexed)
  let chat = await Chat.findOne({
    isGroupChat: false,
    users: { $all: [req.user._id, userId] }
  })
  .populate("users", "-password")
  .populate("latestMessage");

  if (chat) {
    await Chat.findByIdAndUpdate(chat._id, { updatedAt: Date.now() });
    return res.json(chat);
  }

  // If not found → CREATE chat
  const chatData = {
    chatName: req.user._id.toString() === userId.toString() ? "Saved Messages" : "sender",
    isGroupChat: false,
    users: [req.user._id, userId]
  };

  const createdChat = await Chat.create(chatData);

  const fullChat = await Chat.findById(createdChat._id)
    .populate("users", "-password");

  res.status(200).json(fullChat);
});

const fetchChats = asyncHandler(async(req,res)=>{
  try {
    const chats = await Chat.find({
      users: req.user._id
    })
    .sort({ updatedAt: -1 })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate({
      path: "latestMessage",
      select: "content sender unreadBy",
      populate: {
        path: "sender",
        select: "name pic email"
      }
    });

    res.json(chats);

  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});


const createGroupChat=asyncHandler(async(req,res)=>{
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the feilds" });
      }
      
      var users = JSON.parse(req.body.users);
    
      if (users.length < 2) {
        return res
          .status(400)
          .send("More than 2 users are required to form a group chat");
      }
    
      users.push(req.user);
    
      try {
        const groupChat = await Chat.create({
          chatName: content = sanitize(req.body.name),
          users: users,
          isGroupChat: true,
          groupAdmin: [req.user._id],
        });
    
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
          .populate("users", "-password")
          .populate("groupAdmin", "-password");
    
        res.status(200).json(fullGroupChat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName: sanitize(chatName) },
    { new: true } // ✅ Ensures the updated chat is returned
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat not found");
  } else {
    res.json(updatedChat); // ✅ Send updated chat data
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // Find the group chat
  const chat = await Chat.findById(chatId);
  if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
  }

  // ✅ Debug Logs
  console.log("Group Admins:", chat.groupAdmin);
  console.log("Current User:", req.user._id);

  // ✅ Correct Admin Check
  if (!chat.groupAdmin.some(admin => admin.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: "Only admins can add users!" });
  }

  const added = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
  ).populate("users", "-password")
   .populate("groupAdmin", "-password");

  res.json(added);
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
const chat = await Chat.findById(chatId);
if (!chat) return res.status(404).json({ message: "Chat not found" });

// 🚀 Debug Logs
console.log("Chat ID:", chatId);
console.log("User to Remove:", userId);
console.log("Group Admins (DB):", chat.groupAdmin);
console.log("Current User (Request):", req.user._id);
console.log("Type of Group Admin:", typeof chat.groupAdmin);

// ✅ Convert IDs to strings for comparison
const currentUserId = req.user._id.toString();
const isAdmin = chat.groupAdmin.some(admin => admin.toString() === currentUserId);

// ✅ Only Admins (or self-removal) can remove users
if (!isAdmin && userId !== currentUserId) {
    console.log("❌ Access Denied: Only Admins can remove users!");
    return res.status(403).json({ message: "Only admins can remove users!" });
}

// ✅ Remove User
const removed = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
).populate("users", "-password").populate("groupAdmin", "-password");

// ✅ Confirm Removal
if (!removed.users.some(user => user._id.toString() === userId)) {
    console.log(`✅ User ${userId} removed successfully`);
} else {
    console.error(`❌ Failed to remove user ${userId}`);
}

// Return Updated Chat
res.json(removed);

});


module.exports={accessChat,fetchChats,createGroupChat,renameGroup,removeFromGroup,addToGroup};