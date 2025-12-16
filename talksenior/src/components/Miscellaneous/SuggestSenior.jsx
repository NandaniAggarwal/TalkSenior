import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Text,
  useToast,
  Input,
  Select,
  Button,
  VStack,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import "../../components/style.css";
import { useHistory } from "react-router-dom";
import socket from "../../socket";


const backendUrl = import.meta.env.VITE_BACKEND_URL;

const SuggestSenior = ({ fetchAgain, setFetchAgain, showSeniorFinder }) => {
  const {
    selectedChat,
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
    socketConnected
  } = ChatState();
  const [messages, setMessages] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [needHelpTopic, setNeedHelpTopic] = useState("");
  const [recommendedSeniors, setRecommendedSeniors] = useState([]);

  const selectedChatRef = useRef(null);

  const toast = useToast();
  const history = useHistory();

  /* ================= SOCKET SETUP (FIXED) ================= */
  useEffect(() => {
    if (!user) return;

    socket.on("message recieved", (newMessage) => {
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

    return () => {
    socket.off("message recieved");
    };
  }, []);

  /* ================= CHAT CHANGE ================= */
  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  /* ================= FIND SENIORS ================= */
  const handleFindSeniors = async () => {
    if (!selectedYear || !needHelpTopic) {
      alert("Please select year and enter topic.");
      return;
    }

    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/seniors?year=${selectedYear}&topic=${needHelpTopic}`
      );
      setRecommendedSeniors(data);
    } catch (err) {
      console.error("Error fetching seniors:", err);
    }
  };

  /* ================= ACCESS CHAT ================= */
  const accessChat = async (userId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${backendUrl}/api/chat`,
        { userId },
        config
      );

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

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minH="84vh"
          gap={5}
          px={4}
          bg="#adadcaff"
          overflow="hidden"
        >
          <Text fontSize="3xl" fontWeight="bold" color="#2D2D2D" fontFamily="Work Sans">
            Which year senior would you like to connect with?
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
            <option value="alumini">Alumni</option>
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

          <Box
            mt={8}
            height="46vh"      // Fixed height for scrolling
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
            <Text
              fontSize="xl"
              fontWeight="bold"
              mb={4}
              color="#2D2D2D"
              textAlign="center"
            >
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
                        <span style={{ color: "#6F42C1" }}>
                          {senior.canGuide.join(", ")}
                        </span>
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
        </Box>
  );
};

export default SuggestSenior;
