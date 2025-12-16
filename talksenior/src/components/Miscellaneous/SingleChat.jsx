import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Text,
  useToast,
  IconButton,
  Spinner,
  FormControl,
  Input,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import axios from "axios";
import "../../components/style.css";
import ScrollableChat from "../Miscellaneous/ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../../animations/typing.json";
import { useHistory } from "react-router-dom";
import SuggestSenior from "./SuggestSenior";
import DOMPurify from "dompurify";
import socket from "../../socket";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const ENDPOINT = import.meta.env.VITE_BACKEND_URL;

const SingleChat = ({ fetchAgain, setFetchAgain, showSeniorFinder }) => {
  const { selectedChat, setSelectedChat, user, notification, setNotification,socketConnected ,chats,setChats} =
    ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const selectedChatRef = useRef(null);
  const lastTypingTimeRef = useRef(null);

  const toast = useToast();
  const history = useHistory();


  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  const sanitizeInput = (dirty) =>
    DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

  /* ================= SOCKET SETUP ================= */

  useEffect(() => {
    if (!user) return;
    socket.on("typing", (roomId) => {
  if (selectedChatRef.current?._id === roomId) {
    setIsTyping(true);
  }
    });

    socket.on("stop typing", (roomId) => {
  if (selectedChatRef.current?._id === roomId) {
    setIsTyping(false);
  }
    });
/*
    socket.on("message recieved", (newMessage) => {
      console.log("New message received via single chat:", newMessage);
      if (
        !selectedChatRef.current ||
        selectedChatRef.current._id !== newMessage.chat._id
      ) {
        setNotification((prev) => [newMessage, ...prev]);
        setFetchAgain((prev) => !prev);
      } else {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    socket.on("messages read", ({ chatId, userId }) => {
      if (selectedChatRef.current ?._id === chatId) {
        setMessages((prev) =>
          prev.map((msg) => ({
            ...msg,
            unreadBy: msg.unreadBy?.filter((id) => id !== userId),
          }))
        );
      }
    });
*/
    socket.on("message recieved", (newMessage) => {
  if (
    selectedChatRef.current &&
    selectedChatRef.current._id === newMessage.chat._id
  ) {
    // 👀 receiver is viewing this chat
    setMessages((prev) => [...prev, newMessage]);

    // 🔥 MARK READ IMMEDIATELY
    socket.emit("mark read", {
      chatId: newMessage.chat._id,
      userId: user._id,
    });
  } else {
    // 👁️ chat not open
    /*
    setNotification((prev) => [newMessage, ...prev]);
    setFetchAgain((prev) => !prev);
    setChats((prevChats) =>
      //ye kra hai 
    prevChats.map((chat) =>
      chat._id === newMessage.chat._id
        ? { ...chat, unreadCount: 1 }
        : chat
    )
  );*/
  setChats((prevChats) =>
    prevChats.map((chat) =>
      chat._id === newMessage.chat._id
        ? { ...chat, unreadCount: 1 }
        : chat
    )
  );

  setNotification((prev) => [newMessage, ...prev]);
  }
    });

    socket.on("messages read", ({ chatId, userId }) => {
  if (selectedChatRef.current?._id === chatId) {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.sender._id === userId
          ? msg
          : {
              ...msg,
              unreadBy: msg.unreadBy?.filter((id) => id !== userId),
            }
      )
    );
  }
    });

    return () => {
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
      socket.off("message recieved");
      socket.off("messages read");
    };
  }, [user]);



  useEffect(() => {
    if (!selectedChat) return;
    selectedChatRef.current = selectedChat;
    socket.emit("join chat", selectedChat._id);
    fetchMessages();
  }, [selectedChat]);


  /* ================= FETCH MESSAGES ================= */
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
      socket.emit("mark read", {
        chatId: selectedChat._id,
        userId: user._id,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load messages",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage.trim()) {
      socket.emit("stop typing", selectedChat._id);

      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const clean = sanitizeInput(newMessage);
        setNewMessage("");

        const { data } = await axios.post(
          `${backendUrl}/api/message`,
          { content: clean, chatId: selectedChat._id },
          config
        );

        socket.emit("new message", data);
        setMessages((prev) => [...prev, data]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Message send failed",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  /* ================= TYPING HANDLER ================= */
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
    setTyping(true);
    socket.emit("typing", selectedChat._id);
  }

  clearTimeout(lastTypingTimeRef.current);

  lastTypingTimeRef.current = setTimeout(() => {
    socket.emit("stop typing", selectedChat._id);
    setTyping(false);
  }, 3000);

  };

  /* ================= UI ================= */
  return (
    <div>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            px={2}
            w="100%"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal
                  user={getSenderFull(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Text>

          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="linear-gradient(135deg,#dac3e8,#b8c0ff)"
            w="99%"
            h="74vh"
            borderRadius="lg"
            overflowY="auto"
          >
            {loading ? (
              <Spinner size="xl" alignSelf="center" />
            ) : (
              <ScrollableChat messages={messages} />
            )}

            <FormControl onKeyDown={sendMessage} mt={3}>
              {istyping && (
                <Lottie options={defaultOptions} width={70} />
              )}

              <Input
                variant="filled"
                placeholder="Enter a message..."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <SuggestSenior
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
          showSeniorFinder={showSeniorFinder}
        />
      )}
    </div>
  );
};

export default SingleChat;
