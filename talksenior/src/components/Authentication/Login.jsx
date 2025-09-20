import React from 'react'
import { Button } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { Box } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { ChatState } from '../../Context/ChatProvider';

const Login = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history=useHistory();
    const { setUser } = ChatState();
  const handleClick = () => setShow(!show);
  const submitHandler = async () => {
  setLoading(true);
  if (!email || !password) {
    toast({
      title: "Please Fill all the Fields",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setLoading(false);
    return;
  }
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password }, config);

    localStorage.setItem("userInfo", JSON.stringify(data));
    setUser(data);  // Update React context
    toast({
      title: "Login Successful",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setLoading(false);
    history.push("/chats");
  } catch (error) {
    toast({
      title: "Error Occurred!",
      description: error.response?.data?.message || "Something went wrong",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setLoading(false);
  }
  }
  return (
    <Box
          w={{ base: "100%", md: "100%", lg: "100%" }}
          maxW="900px"
          p="4" 
          py="8" 
          boxShadow="xl"
          borderRadius="lg"
          bg="rgba(255, 255, 255, 0.1)" // Soft Transparent White
backdropFilter="blur(10px)"   // Adds Blur for Glassmorphism Effect
border="1px solid rgba(255, 255, 255, 0.2)" // Light Purplish White
          textAlign="center"
        >
    <VStack spacing="10px">
      <FormControl id="email" isRequired>
                <FormLabel fontSize="sm" color="black">
                  Email Address
                </FormLabel>
                <Input
                size="sm"
                  type="email"
                  placeholder="Enter Your Email Address"
                  _placeholder={{ color: "#B3A7FF" }}  // Light Purple Placeholder
                  borderColor="gray.300"
                  focusBorderColor="white"
                  onChange={(e) => setEmail(e.target.value)}
                />
        </FormControl>
      
              <FormControl id="password" isRequired>
                <FormLabel fontSize="sm" color="black">
                  Password
                </FormLabel>
                <InputGroup size="sm">
                  <Input
                    type={show ? "text" : "password"}
                    placeholder="Enter Password"
                    _placeholder={{ color: "#B3A7FF" }}  // Light Purple Placeholder
                    borderColor="gray.300"
                    focusBorderColor="white"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      bg="purple.300"
                      color="white"
                      _hover={{ bg: "purple.700" }}
                      onClick={handleClick}
                    >
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
      <Button
                width="100%"
                mt={1}
                onClick={submitHandler}
                bgGradient="linear(to-r, #6A5ACD, #836FFF)" 
                color="white"
                _hover={{ bgGradient: "linear(to-r, #836FFF, #927DFF)" }}
                isLoading={loading}
              >
                Login
              </Button>
      </VStack>
      </Box>
  )
}

export default Login