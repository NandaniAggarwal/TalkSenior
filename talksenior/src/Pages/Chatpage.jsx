import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/Miscellaneous/SideDrawer";
import MyChats from "../components/Miscellaneous/MyChats";
import ChatBox from "../components/Miscellaneous/ChatBox";
import { useState } from "react";

const Chatpage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  const [showSeniorFinder, setShowSeniorFinder] = useState(false);
  if (!user) {
    return <div>Loading user info...</div>;
  }

  return (
    <div style={{ width: "100%" }}>
      <SideDrawer setShowSeniorFinder={setShowSeniorFinder} /> {/* 🆕 pass setter */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        w="100%"
        h="100vh"
        p="10px"
        overflow="hidden"
        flexDirection={{ base: "column", md: "row" }} // ✅ responsive
      >
        <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} showSeniorFinder={showSeniorFinder} /> {/* 🆕 */}
      </Box>
    </div>
  );
};

export default Chatpage;
