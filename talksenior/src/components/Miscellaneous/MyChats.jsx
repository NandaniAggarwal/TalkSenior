import React from 'react'
import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import ChatLoading from "./ChatLoading";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './GroupChatModal'

const MyChats = ({fetchAgain,setFetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
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
  
    if (storedUser?.token) {
      fetchChats();
    }
  }, [fetchAgain]);


  return (
    <>
<div>
<Box
  display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
  flexDirection="column"
  alignItems="center"
  p={4}
  bg="linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)"  // Soft lavender to light blue gradient
  color="black"
  w={{ base: "100%", md: "30%" }}
  minWidth="500px"
  borderRadius="lg"
  borderWidth="1px"
  boxShadow="xl"
  minHeight='88vh'
>
  {/* Chat Header */}
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
    bg="rgba(255, 255, 255, 0.8)"  // Soft white transparent background
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

  {/* Chat List */}
  <Box
    display="flex"
    flexDirection="column"
    p={3}
    bg="rgba(255, 255, 255, 0.7)" // Transparent soft white background
    w="100%"
    height="100%"
    borderRadius="lg"
    overflowY="auto"
    boxShadow="md"
    backdropFilter="blur(8px)"
    sx={{
      "::-webkit-scrollbar": { width: "6px" },
      "::-webkit-scrollbar-thumb": { background: "gray.400", borderRadius: "10px" },
    }}
  >
    {chats ? (
      <Stack spacing={3}>
        {chats.map((chat) => (
          <Box
            key={chat._id}
            onClick={() => setSelectedChat(chat)}
            cursor="pointer"
            bg={selectedChat === chat ? "purple.400" : "rgba(255, 255, 255, 0.6)"} // Softer chat background
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
            <Text fontSize="md" fontWeight="bold">
              {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
            </Text>
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
</>
  )
}

export default MyChats