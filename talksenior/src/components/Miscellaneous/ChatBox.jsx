import React from 'react' 
import { Box } from "@chakra-ui/react"; 
import SingleChat from "./SingleChat"; 
import { ChatState } from "../../Context/ChatProvider"; 
const ChatBox = ({ fetchAgain, setFetchAgain, showSeniorFinder }) => { const { selectedChat } = ChatState(); 
return ( <Box d={{ base: selectedChat ? "flex" : "none", md: "flex" }} alignItems="center" flexDir="column" p={3} bg="white" w={{ base: "100%", md: "68%" }} borderRadius="lg" borderWidth="1px" > 
<SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} showSeniorFinder={showSeniorFinder}/> </Box> ) } 
export default ChatBox