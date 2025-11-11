import React, { useState } from "react";
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const { setUser } = ChatState();

  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        `${backendUrl}/api/user/login`,
        { email, password },
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);

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
  };

  return (
    <Box
      w={{ base: "100%", sm: "90%", md: "80%" }}
      maxW="400px"
      p={{ base: 4, md: 6 }}
      py={{ base: 6, md: 8 }}
      boxShadow="xl"
      borderRadius="lg"
      bg="rgba(255, 255, 255, 0.1)"
      backdropFilter="blur(10px)"
      border="1px solid rgba(255, 255, 255, 0.2)"
      textAlign="center"
    >
      <VStack spacing={4}>
        <FormControl id="email" isRequired>
          <FormLabel fontSize="sm" color="black">
            Email Address
          </FormLabel>
          <Input
            size={{ base: "md", md: "sm" }}
            type="email"
            placeholder="Enter your email"
            _placeholder={{ color: "#B3A7FF" }}
            borderColor="gray.300"
            focusBorderColor="white"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel fontSize="sm" color="black">
            Password
          </FormLabel>
          <InputGroup size={{ base: "md", md: "sm" }}>
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter password"
              _placeholder={{ color: "#B3A7FF" }}
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
          mt={2}
          size={{ base: "md", md: "sm" }}
          bgGradient="linear(to-r, #6A5ACD, #836FFF)"
          color="white"
          _hover={{ bgGradient: "linear(to-r, #836FFF, #927DFF)" }}
          isLoading={loading}
          onClick={submitHandler}
        >
          Login
        </Button>
      </VStack>
    </Box>
  );
};

export default Login;
