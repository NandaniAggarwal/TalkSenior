import React from 'react';
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";
import { ChatState } from "../../Context/ChatProvider";

// NO responsive logic here—always show main chat box, let parent control layout!
const ChatBox = ({ fetchAgain, setFetchAgain, showSeniorFinder }) => {
  return (
    <Box
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      minW="70vw"
      w={{ base: "100%", md: "74%" }}
      borderRadius="lg"
      borderWidth="1px"
      height="88vh"
      ml="5vw"
    >
      <SingleChat
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
        showSeniorFinder={showSeniorFinder}
      />
    </Box>
  );
};

export default ChatBox;
