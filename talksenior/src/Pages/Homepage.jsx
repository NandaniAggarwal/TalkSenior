import React from 'react'
import { Container,Box,Text,Button , Tabs,TabList,TabPanel,TabPanels,Tab} from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'
import { useHistory } from 'react-router-dom/cjs/react-router-dom'
import { useEffect } from 'react'

const Homepage = () => {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) history.push("/chats");
  }, [history]);

  return (
    <Container display="flex" 
    alignItems="center" 
    justifyContent="center"
    minH='100vh'
    maxW="container.xl"
    >
        <Box
          justify="center"
          align="center"
          h="100vh"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="center"
            p={10}
            bg="rgba(255, 255, 255, 0.15)"  // Transparent White
            backdropFilter="blur(10px)"
            border="1px solid rgba(255, 255, 255, 0.2)"
            color="#F8F9FA"
            w="90%"
            borderRadius="lg"
            borderWidth="1px"
            boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
            m="20px auto"
            mb="20px"
        ><Text
        fontSize={{ base: "4xl", md: "5xl", lg: "6xl", xl: "7xl" }} // Increased Size
        fontWeight="extrabold"
        fontFamily="Work sans"
        letterSpacing="wide"
        textTransform="uppercase"
        color="rgba(255, 255, 255, 0.9)"  // Light White
        textShadow="3px 3px 15px rgba(255, 255, 255, 0.7)" // Strong Glow Effect
      >
        TALK-SENIOR
      </Text>      
      

        <Box display="flex" w="100%" h="100%" alignItems="center">
    {/* Left Side - Large Logo */}
    <Box w="30%" display="flex" justifyContent="center" alignItems="center">
      <img src="logo.webp" alt="logo" width="90%" height="auto" />
    </Box>

    {/* Right Side - Login & Signup */}
    <Box display="flex" flexDirection="column" alignItems="center" w="70%">
    <Tabs isFitted variant="soft-rounded" w="100%">
    <TabList bg="gray.800" p="3" borderRadius="lg">
    <Tab 
      _selected={{ bg: "#6A5ACD", color: "white" ,border: "none",  // Remove outline effect
        boxShadow: "0px 0px 10px rgba(106, 90, 205, 0.8)", borderRadius: "10px",transition: "all 0.3s ease-in-out"}}  // Selected tab
      _hover={{ bg: "#836FFF", color: "white",borderRadius: "10px",transform: "scale(1.05)" }}  // Hover effect
      color="#B3A7FF"  // Default text color
      fontSize="lg"
      px="8"
    >
      Login
    </Tab>
    <Tab 
     _selected={{ bg: "#6A5ACD", color: "white", border: "none",  // Remove outline effect
      boxShadow: "0px 0px 10px rgba(106, 90, 205, 0.8)", borderRadius: "10px", transition: "all 0.3s ease-in-out"}}  // Selected tab
     _hover={{ bg: "#836FFF", color: "white" ,borderRadius: "10px", transform: "scale(1.05)"}}  // Hover effect
     color="#B3A7FF"  // Default text color
      fontSize="lg"
      px="8"
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
  )
}

export default Homepage