import React, { useState } from "react";
import {
  VStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Box,
  useToast,
  HStack,
  Select,
} from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [canGuide, setCanGuide] = useState([]);
  const toast = useToast();
  const history = useHistory();

  const handleClick = () => setShow(!show);

  const isCollegeEmail = (email) => {
    return email.toLowerCase().endsWith("@igdtuw.ac.in");
  };
  const submitHandler = async () => {
  setLoading(true);

  if (!name || !email || !password || !branch || !year) {
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

  // 🔥 College email validation here
  if (!isCollegeEmail(email)) {
    toast({
      title: "Invalid Email",
      description: "Please use your IGDTUW college email ID (example: abc@igdtuw.ac.in)",
      status: "error",
      duration: 4000,
      isClosable: true,
      position: "bottom",
    });
    setLoading(false);
    return;
  }

  try {
    const config = { headers: { "Content-type": "application/json" } };
    const { data } = await axios.post(
      `${backendUrl}/api/user`,
      { name, email, password, pic, branch, year, canGuide },
      config
    );

    toast({
      title: "Registration Successful",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    localStorage.setItem("userInfo", JSON.stringify(data));
    setLoading(false);
    history.push("/chats");
  } catch (error) {
    toast({
      title: "Error Occurred!",
      description: error.response.data.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setLoading(false);
  }
};

  const postDetails = (pics) => {
    setLoading(true);
    if (!pics) {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "TalkSenior");
      data.append("cloud_name", "dwz1vzdhd");
      fetch("https://api.cloudinary.com/v1_1/dwz1vzdhd/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch(() => setLoading(false));
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
      mb="20px"
    >
      <VStack spacing={4}>
        <FormControl id="name" isRequired>
          <FormLabel fontSize="sm" color="black">
            Name
          </FormLabel>
          <Input
            size={{ base: "md", md: "sm" }}
            placeholder="Enter your name"
            _placeholder={{ color: "#B3A7FF" }}
            borderColor="gray.300"
            focusBorderColor="white"
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>

        <FormControl id="email" isRequired>
          <FormLabel fontSize="sm" color="black">
            Email Address (College Email Only)
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

        <FormControl id="pic">
          <FormLabel fontSize="sm" color="black">
            Upload Your Picture
          </FormLabel>
          <Input
            type="file"
            p={1}
            accept="image/*"
            borderColor="gray.300"
            focusBorderColor="white"
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize="sm" color="black">
            Branch & Year
          </FormLabel>
          <HStack
            spacing={{ base: 2, md: 4 }}
            flexDirection={{ base: "column", md: "row" }}
            w="100%"
          >
            <Select
              style={{ color: "black" }}
              placeholder="Select Branch"
              size={{ base: "md", md: "sm" }}
              w="100%"
              borderColor="gray.300"
              focusBorderColor="white"
              onChange={(e) => setBranch(e.target.value)}
            >
              <option value="CSE-AI" style={{ color: "black" }}>CSE-AI</option>
              <option value="CSE" style={{ color: "black" }}>CSE</option>
              <option value="IT" style={{ color: "black" }}>IT</option>
              <option value="ECE-AI" style={{ color: "black" }}>ECE-AI</option>
              <option value="ECE" style={{ color: "black" }}>ECE</option>
              <option value="MECH" style={{ color: "black" }}>MECH</option>
            </Select>

            <Select
              placeholder="Select Year"
              style={{ color: "black" }}
              size={{ base: "md", md: "sm" }}
              w="100%"
              borderColor="gray.300"
              focusBorderColor="white"
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="1st" style={{ color: "black" }}>1st Year</option>
              <option value="2nd" style={{ color: "black" }}>2nd Year</option>
              <option value="3rd" style={{ color: "black" }}>3rd Year</option>
              <option value="4th" style={{ color: "black" }}>4th Year</option>
              <option value="alumni"style={{ color: "black" }}>Alumni</option>
            </Select>
          </HStack>
        </FormControl>

        <FormControl id="canGuide" isRequired>
          <FormLabel fontSize="sm" color="black">
            Topics You Can Guide On
          </FormLabel>
          <Input style={{ color: "black" }}
            size={{ base: "md", md: "sm" }}
            placeholder="e.g. DSA, ML, Open Source"
            _placeholder={{ color: "#0b0913ff" }}
            borderColor="gray.300"
            focusBorderColor="white"
            onChange={(e) =>
              setCanGuide(e.target.value.split(",").map((s) => s.trim()))
            }
          />
        </FormControl>

        <Button
          width="100%"
          bgGradient="linear(to-r, #6A5ACD, #836FFF)"
          color="white"
          _hover={{ bgGradient: "linear(to-r, #836FFF, #927DFF)" }}
          mt={2}
          size={{ base: "md", md: "sm" }}
          isLoading={loading}
          onClick={submitHandler}
        >
          Sign Up
        </Button>
      </VStack>
    </Box>
  );
};

export default Signup;
