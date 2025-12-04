const asyncHandler=require('express-async-handler');
const Message= require('../Models/messageModel');
const User=require('../Models/userModel');
const Chat=require('../Models/chatModel');

const sendMessage= asyncHandler(async(req,res)=>{
    const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }
  let chat = await Chat.findById(chatId);

const unread = chat.users
      .filter(u => u._id.toString() !== req.user._id.toString())
      .map(u => u._id);

let newMessage = {
  sender: req.user._id,
  content,
  chat: chatId,
  unreadBy: unread,
};

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
      updatedAt: Date.now(),
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    // Remove unread for this user
    await Message.updateMany(
      { chat: req.params.chatId },
      { $pull: { unreadBy: req.user._id } }
    );

    // Fetch all messages
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    // ALSO update latestMessage.unreadBy in Chat
    const latest = await Message.findOne({ chat: req.params.chatId })
      .sort({ createdAt: -1 });

    if (latest) {
      await Chat.findByIdAndUpdate(latest.chat, {
        latestMessage: latest
      });
    }

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
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