import React, { useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Homepage = () => {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) history.push("/chats");
  }, [history]);

  return (
    <Container
      display="flex"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
      maxW="container.xl"
      px={{ base: 4, md: 10 }}
      bgGradient="linear(to-b, #2B1055, #7597DE)" // 👈 full-page purple gradient
      overflowY="auto"
    >
      <Box
        justify="center"
        align="center"
        minH="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="center"
        p={{ base: 6, md: 10 }}
        bg="rgba(255, 255, 255, 0.15)"
        backdropFilter="blur(10px)"
        border="1px solid rgba(255, 255, 255, 0.2)"
        color="#F8F9FA"
        w={{ base: "100%", md: "90%" }}
        borderRadius="lg"
        boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
        m="20px auto"
      >
        <Text
          fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
          fontWeight="extrabold"
          fontFamily="Work sans"
          letterSpacing="wide"
          textTransform="uppercase"
          color="rgba(255, 255, 255, 0.9)"
          textShadow="3px 3px 15px rgba(255, 255, 255, 0.7)"
          textAlign="center"
          mb={{ base: 6, md: 8 }}
        >
          TALK-SENIOR
        </Text>

        <Box
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          w="100%"
          alignItems="center"
          justifyContent="center"
          gap={{ base: 6, md: 8 }}
        >
          {/* Left Side - Logo */}
          <Box
            w={{ base: "60%", md: "30%" }}
            mb={{ base: 6, md: 0 }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <img
              src="logo.webp"
              alt="logo"
              width="100%"
              height="auto"
              style={{ maxWidth: "220px" }}
            />
          </Box>

          {/* Right Side - Login & Signup */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            w={{ base: "100%", md: "70%" }}
          >
            <Tabs isFitted variant="soft-rounded" w={{ base: "100%", md: "80%" }}>
              <TabList bg="gray.800" p={{ base: 2, md: 3 }} borderRadius="lg">
                <Tab
                  _selected={{
                    bg: "#6A5ACD",
                    color: "white",
                    borderRadius: "10px",
                    boxShadow: "0px 0px 10px rgba(106, 90, 205, 0.8)",
                  }}
                  _hover={{ bg: "#836FFF", transform: "scale(1.05)" }}
                  color="#B3A7FF"
                  fontSize={{ base: "md", md: "lg" }}
                >
                  Login
                </Tab>
                <Tab
                  _selected={{
                    bg: "#6A5ACD",
                    color: "white",
                    borderRadius: "10px",
                    boxShadow: "0px 0px 10px rgba(106, 90, 205, 0.8)",
                  }}
                  _hover={{ bg: "#836FFF", transform: "scale(1.05)" }}
                  color="#B3A7FF"
                  fontSize={{ base: "md", md: "lg" }}
                >
                  Sign Up
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Login />
                </TabPanel>
                <TabPanel>
                  <Signup />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Homepage;
