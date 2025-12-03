import React, { useEffect, useState } from "react";
import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text, Button, useToast } from "@chakra-ui/react";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import { ChatState } from "../../Context/ChatProvider";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./GroupChatModal";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const MyChats = ({ fetchAgain, setFetchAgain ,showSeniorFinder}) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${backendUrl}/api/chat`, config);

      const updated = data.map((chat) => {
  const arr = chat.latestMessage?.unreadBy || [];
  const hasUnreadForMe = arr.some((u) => {
    if (!u) return false;
    if (typeof u === "string") return u === user._id;
    if (u._id) return u._id.toString() === user._id;
    return u.toString() === user._id;
  });
  return { ...chat, unreadCount: hasUnreadForMe ? 1 : 0 };
});
      setChats(updated);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(storedUser);

    if (storedUser?.token) fetchChats();
  }, [fetchAgain]);

  useEffect(() => {
  if (!window.socket) return;

  window.socket.on("messages read", ({ chatId }) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat._id === chatId ? { ...chat, unreadCount: 0 } : chat
      )
    );
  });
}, []);

  return (
    <div>
      <Box
      display={{
        base: selectedChat || showSeniorFinder ? "none" : "flex",
        md: "flex"
      }}
      flexDirection="column"
      alignItems="center"
      p={4}
      bg="linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)"
      color="black"
      w={{ base: "100%", md: "30%" }}
      minWidth={{ base: "100%", md: "500px" }}
      borderRadius="lg"
      borderWidth="1px"
      boxShadow="xl"
      minHeight="88vh"
    >
        <Box
          pb={3}
          px={3}
          fontSize="24px"
          fontFamily="Work Sans"
          fontWeight="bold"
          display="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
          bg="rgba(255, 255, 255, 0.8)"
          borderRadius="md"
          p={2}
          backdropFilter="blur(10px)"
          boxShadow="md"
          mb="7px"
        >
          My Chats
          <GroupChatModal>
            <Button
              display="flex"
              fontSize="55%"
              colorScheme="purple"
              rightIcon={<AddIcon />}
              variant="solid"
              _hover={{ transform: "scale(1.05)", bg: "purple.300" }}
            >
              New Group Chat
            </Button>
          </GroupChatModal>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          p={3}
          bg="rgba(255, 255, 255, 0.7)"
          w="100%"
          maxHeight="70vh"
          borderRadius="lg"
          overflowY="auto"
          boxShadow="md"
          backdropFilter="blur(8px)"
          sx={{
            "::-webkit-scrollbar": { width: "6px" },
            "::-webkit-scrollbar-thumb": {
              background: "gray.400",
              borderRadius: "10px",
            },
          }}
        >
          {chats ? (
            <Stack spacing={3}>
              {chats.map((chat) => (
                <Box
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={
                    selectedChat === chat
                      ? "purple.400"
                      : "rgba(255, 255, 255, 0.6)"
                  }
                  color={selectedChat === chat ? "white" : "black"}
                  px={4}
                  py={3}
                  borderRadius="lg"
                  boxShadow="sm"
                  transition="0.3s"
                  _hover={{ bg: "purple.300", color: "white" }}
                  width="100%"
                  textAlign="left"
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center">
  {/* Chat name */}
  <Text fontSize="md" fontWeight="bold">
    {!chat.isGroupChat
      ? getSender(loggedUser, chat.users)
      : chat.chatName}
  </Text>

  {/* 🔥 UNREAD BADGE */}
  {chat.unreadCount > 0 && (
  <span
    style={{
      width: "10px",
      height: "10px",
      backgroundColor: "red",
      borderRadius: "50%",
      display: "inline-block",
    }}
  ></span>
)}

</Box>

                </Box>
              ))}
            </Stack>
          ) : (
            <Text textAlign="center" color="gray.600" fontSize="lg">
              Loading chats...
            </Text>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default MyChats;
