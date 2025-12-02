import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/Miscellaneous/SideDrawer";
import MyChats from "../components/Miscellaneous/MyChats";
import ChatBox from "../components/Miscellaneous/ChatBox";
import { useState } from "react";
import SuggestSenior from "../components/Miscellaneous/SuggestSenior";

const Chatpage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  const [showSeniorFinder, setShowSeniorFinder] = useState(false);

  const isMobile = window.innerWidth < 768;

  if (!user) {
    return <div>Loading user info...</div>;
  }

  return (
    <div style={{ width: "100%" }}>
      <SideDrawer setShowSeniorFinder={setShowSeniorFinder} />
      <Box
        display="flex"
        flexDirection={{ base: "column", md: "row" }} // Row on desktop, column on mobile
        alignItems="stretch"
        justifyContent="flex-start"
        w="100vw"
        minH="100vh"
        p={0}
        >
  {/* Sidebar: fixed width and gap */}
  <Box
    w={{ base: "100%", md: "330px" }}  // Fixed desktop width, full width on mobile
    minWidth={{ base: "100%", md: "250px" }} // Minimum width for sidebar
    mr={{ md: 12 }}                        // Margin-right = 32px on desktop for gap
    h="100%"
  >
    <MyChats
      fetchAgain={fetchAgain}
      setFetchAgain={setFetchAgain}
      showSeniorFinder={showSeniorFinder}
    />
  </Box>
  {/* Main area: fills rest, NO stacking on desktop! */}
  <Box
    flex={1}
    h="100%"
    minWidth={0}// Allow shrinking on desktop
    display="flex"
    justifyContent="center"
    alignItems="flex-start"
  >
    {isMobile && showSeniorFinder ? (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minH="84vh"
        gap={5}
        px={4}
        bg="#adadcaff"
        w="100%"
      >
        <SuggestSenior
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
          showSeniorFinder={showSeniorFinder}
        />
      </Box>
    ) : (
      <ChatBox
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
        showSeniorFinder={showSeniorFinder}
      />
    )}
  </Box>
</Box>

    </div>
  );
};

export default Chatpage;
