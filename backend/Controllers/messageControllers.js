const asyncHandler=require('express-async-handler');
const Message= require('../Models/messageModel');
const User=require('../Models/userModel');
const Chat=require('../Models/chatModel');
const sanitize= require('../config/sanitize');

const allMessages = asyncHandler(async (req, res) => {
  try {
    const chatId = req.params.chatId;

    Message.updateMany(
      { chat: chatId, unreadBy: req.user._id },
      { $pull: { unreadBy: req.user._id } }
    ).exec(); 

    const messages = await Message.find({ chat: chatId })
      .sort({ createdAt: 1 }) 
      .populate("sender", "name pic email");

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const sendMessage = asyncHandler(async (req, res) => {
  let { content, chatId } = req.body;
  content = sanitize(content);

  if (!content || !chatId) return res.sendStatus(400);

  const chat = await Chat.findById(chatId).select("users");

  const unread = chat.users.filter(
    u => u.toString() !== req.user._id.toString()
  );

  const message = await Message.create({
    sender: req.user._id,
    content,
    chat: chatId,
    unreadBy: unread,
  });

  await message.populate("sender", "name pic");
  
  await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

  res.json(message);
});

const markAsRead = asyncHandler(async (req, res) => {
  const chatId = req.params.chatId;
  const userId = req.user._id;

  await Message.updateMany(
    { chat: chatId },
    { $pull: { unreadBy: userId } } 
  );

  res.json({ success: true });
});


module.exports={sendMessage,allMessages, markAsRead};