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
  Heading,
  Text,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from 'axios';
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { HStack } from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";


const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading,setLoading]=useState(false);
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [canGuide, setCanGuide] = useState([]);      
  
  const toast=useToast();
  const history=useHistory();

  const handleClick = () => setShow(!show);
  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !branch || !year) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    console.log(name, email, password);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
          branch,
          year,
          canGuide
        },
        config
      );
      console.log(data);
        toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data.data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }};
  const postDetails = (pics) => {
        setLoading(true);
        if(pic===undefined){
            toast({
                title: ' Please fill all the fields ',
                type: "warning",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
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
                console.log(data.url.toString());
                setLoading(false);
              })
              .catch((err) => {
                console.log(err);
                setLoading(false);
              });
        } else {
          console.log("Invalid file type. Please upload JPEG or PNG images.");
        }};

  return (
    <Box
      w={{ base: "100%", md: "100%", lg: "100%" }}
      maxW="900px"
      p="6" // Increased padding for better spacing
      py="2" 
      boxShadow="xl"
      borderRadius="lg"
      bg="rgba(255, 255, 255, 0.1)" // Soft Transparent White
backdropFilter="blur(10px)"   // Adds Blur for Glassmorphism Effect
border="1px solid rgba(255, 255, 255, 0.2)" 
      textAlign="center"
      minH="fit-content"
      mb="20px"
    >
      <VStack spacing="3" mt={1}>
        <FormControl id="name" isRequired>
          <FormLabel fontSize="sm" color="black">
            Name
          </FormLabel>
          <Input
          size="sm"
            placeholder="Enter Your Name"
            _placeholder={{ color: "#B3A7FF" }}  // Light Purple Placeholder
            borderColor="gray.300"
            focusBorderColor="white"
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>

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
  <FormLabel fontSize="sm" color="black">Branch & Year</FormLabel>
  <HStack spacing={4}>
    {/* Branch Dropdown */}
    <Select
      placeholder="Select Branch"
      size="sm"
      borderColor="gray.300"
      focusBorderColor="white"
      _placeholder={{ color: "#B3A7FF" }}
      bg="whiteAlpha.300"
  sx={{
    option: {
      bg: "#F1EFFF",      // background of each dropdown option
      color: "#3F3D56",    // text color of option
    },
    "option:hover": {
      bg: "#D6C9FF",       // hover background
    },
  }}
      onChange={(e) => setBranch(e.target.value)}
    >
      <option value="CSE-AI">CSE-AI</option>
      <option value="CSE">CSE</option>
      <option value="IT">IT</option>
      <option value="ECE-AI">ECE-AI</option>
      <option value="ECE">ECE</option>
      <option value="MECH">MECH</option>

    </Select>
    {/* Year Dropdown */}
    <Select
      placeholder="Select Year"
      size="sm"
      borderColor="gray.300"
      focusBorderColor="white"
      _placeholder={{ color: "#B3A7FF" }}
      onChange={(e) => setYear(e.target.value)}
      bg="whiteAlpha.300"
  sx={{
    option: {
      bg: "#F1EFFF",      // background of each dropdown option
      color: "#3F3D56",    // text color of option
    },
    "option:hover": {
      bg: "#D6C9FF",       // hover background
    },
  }}
    >
      <option value="1st">1st Year</option>
      <option value="2nd">2nd Year</option>
      <option value="3rd">3rd Year</option>
      <option value="4th">4th Year</option>
      <option value="alumni">Alumni</option>
    </Select>
  </HStack>
</FormControl>
<FormControl id="canGuide" isRequired>
  <FormLabel fontSize="sm" color="black">Topics You Can Guide On</FormLabel>
  <Input
    size="sm"
    placeholder="e.g. DSA, ML, Open Source"
    _placeholder={{ color: "#B3A7FF" }}
    borderColor="gray.300"
    focusBorderColor="white"
    onChange={(e) => setCanGuide(e.target.value.split(",").map(s => s.trim()))}
  />
</FormControl>

        <Button
          width="100%"
          bgGradient="linear(to-r, #6A5ACD, #836FFF)" 
                color="white"
                _hover={{ bgGradient: "linear(to-r, #836FFF, #927DFF)" }}
          mt={1}
          onClick={submitHandler}
          isloading={loading}
        >
          Sign Up
        </Button>
      </VStack>
    </Box>
  );
};

export default Signup;
