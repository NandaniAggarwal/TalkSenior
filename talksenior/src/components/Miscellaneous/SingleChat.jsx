import React from 'react'
import { Box,Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { ChatState } from '../../Context/ChatProvider';
import { IconButton } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender,getSenderFull } from '../config/ChatLogics';
import ProfileModal from './ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import { Spinner,FormControl ,Input} from '@chakra-ui/react';
import axios from "axios";
import { useEffect } from 'react';
import '../../components/style.css'
import ScrollableChat from '../Miscellaneous/ScrollableChat'
import io from 'socket.io-client';
import Lottie from 'react-lottie';
import animationData from '../../animations/typing.json';
import { Select } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { VStack } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
const backendUrl = import.meta.env.VITE_BACKEND_URL;


const ENDPOINT= "http://localhost:5000";
var socket,selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [needHelpTopic, setNeedHelpTopic] = useState("");
  const [recommendedSeniors, setRecommendedSeniors] = useState([]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
 
  const toast = useToast();
  const { selectedChat, setSelectedChat, user ,notification, setNotification} =ChatState();
  const history = useHistory();
  const { chats, setChats} = ChatState();


  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const {data} = await axios.get(
        `${backendUrl}/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }}

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage.trim()) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data }= await axios.post(
          `${backendUrl}/api/message`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        if(error.response && error.response.data){
    console.error("Server Response Error:", error.response.data);
    toast({
      title: "Error Occurred!",
      description: error.response.data.message || "Failed to send the Message",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  } else {
    console.error("Unknown error:", error);
  }
        console.log(error);
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  }

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

   useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });



const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
}


  
const handleFindSeniors = async () => {
  if (!selectedYear || !needHelpTopic) {
    alert("Please select year and enter topic.");
    return;
  }
  try {
    const { data } = await axios.get(`${backendUrl}/api/user/seniors?year=${selectedYear}&topic=${needHelpTopic}`);
    console.log("Matched Seniors:", data);
    setRecommendedSeniors(data);
    // Show the seniors in a modal/card below this box
  } catch (err) {
    console.error("Error fetching seniors:", err);
  }
};


const accessChat = async (userId) => {
  try {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };

    const { data } = await axios.post(`${backendUrl}/api/chat`, { userId }, config);

    if (!chats.find((c) => c._id === data._id)) {
      setChats([data, ...chats]);
    }

    setSelectedChat(data);
    history.push("/chats");
  } catch (error) {
    toast({
      title: "Error starting chat",
      description: error.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  }
};


  return (
    <div>
        {selectedChat ? (
            <>
        <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
                <>
                {getSender(user,selectedChat.users)}
                <ProfileModal user={getSenderFull(user,selectedChat.users)}/>
                </>
            ):(
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
            bg="#E8E8E8"
            w="100%"
            maxHeight="78vh"
            borderRadius="lg"
            overflowY="hidden"
            sx={{
      "::-webkit-scrollbar": { width: "6px" },
      "::-webkit-scrollbar-thumb": { background: "gray.400", borderRadius: "10px" },
    }}
          >
             {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
  display="flex"
  flexDirection="column"
  alignItems="center"
  justifyContent="center"
  minH="84vh"
  gap={5}
  px={4}
  bg="#adadcaff"
>
  <Text fontSize="3xl" fontWeight="bold" color="#2D2D2D" fontFamily="Work Sans">
    Which year would you like to talk to?
  </Text>

  <Select
    placeholder="Select Year"
    size="md"
    width="300px"
    onChange={(e) => setSelectedYear(e.target.value)}
    bg="#E3E2F3"
    borderColor="#B0AFC9"
    focusBorderColor="purple.500"
    color="#2D2D2D"
    _placeholder={{ color: "#7C7B9E" }}
  >
    <option value="2nd">2nd Year</option>
    <option value="3rd">3rd Year</option>
    <option value="4th">4th Year</option>
    <option value="alumni">Alumni</option>
  </Select>

  <Input
    placeholder="What do you need help with? (e.g. ML, CP)"
    size="md"
    width="300px"
    value={needHelpTopic}
    onChange={(e) => setNeedHelpTopic(e.target.value)}
    borderColor="#B0AFC9"
    focusBorderColor="purple.500"
    bg="#E3E2F3"
    color="#2D2D2D"
    _placeholder={{ color: "#7C7B9E" }}
  />

  <Button
    mt={3}
    colorScheme="purple"
    bg="#86A8CF"
    color="white"
    _hover={{ bg: "#A7C7E7" }}
    onClick={handleFindSeniors}
  >
    Find Seniors
  </Button>

  {recommendedSeniors.length > 0 || recommendedSeniors.length === 0 ? (
  <Box
    mt={8}
    maxH="50vh"
    overflowY="auto"
    w="100%"
    maxW="600px"
    px={2}
    sx={{
      "::-webkit-scrollbar": { width: "6px" },
      "::-webkit-scrollbar-thumb": {
        background: "#B0AFC9",
        borderRadius: "10px",
      },
    }}
  >
    <Text fontSize="xl" fontWeight="bold" mb={4} color="#2D2D2D" textAlign="center">
      🎓 Recommended Seniors
    </Text>

    {recommendedSeniors.length > 0 ? (
      <VStack spacing={4}>
        {recommendedSeniors.map((senior) => (
          <Box
            key={senior._id}
            p={4}
            w="100%"
            bg="#F0F0FF"
            borderRadius="lg"
            boxShadow="md"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            _hover={{ boxShadow: "lg", transform: "scale(1.01)" }}
            transition="all 0.2s ease-in-out"
          >
            <Box>
              <Text fontWeight="semibold" fontSize="lg" color="#2D2D2D">
                {senior.name}
              </Text>
              <Text fontSize="sm" color="#4A4A6A">
                Branch: {senior.branch} | Year: {senior.year}
              </Text>
              <Text fontSize="sm" color="#4A4A6A">
                Can guide on:{" "}
                <span style={{ color: "#6F42C1" }}>{senior.canGuide.join(", ")}</span>
              </Text>
            </Box>

            <Button
              size="sm"
              colorScheme="purple"
              variant="solid"
              onClick={() => accessChat(senior._id)}
            >
              Start Messaging
            </Button>
          </Box>
        ))}
      </VStack>
    ) : (
      <Text mt={4} color="gray.600" fontWeight="medium" textAlign="center">
        😕 No senior found based on your request.
      </Text>
    )}
  </Box>
) : null}

</Box>

      )}
      </div>
  )
}

export default SingleChat