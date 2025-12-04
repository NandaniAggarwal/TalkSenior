import { Avatar } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
   <ScrollableFeed>
  {messages &&
    messages.map((m, i) => (
      <div style={{ display: "flex", flexDirection: "column" }} key={m._id}>
        
        <div style={{ display: "flex" }}>
          {(isSameSender(messages, m, i, user._id) ||
            isLastMessage(messages, i, user._id)) && (
            <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
              <Avatar
                mt="7px"
                mr={1}
                size="sm"
                cursor="pointer"
                name={m.sender.name}
                src={m.sender.pic}
              />
            </Tooltip>
          )}
          <span style={{ 
            backgroundColor: m.sender._id === user._id ? "#6411ad" : "#c05299", 
            marginLeft: isSameSenderMargin(messages, m, i, user._id), 
            marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10, 
            borderRadius: "20px", 
            padding: "5px 15px", 
            maxWidth: "75%", 
            color: "white", 
            fontWeight: "bold", 
            }} > 
            {m.content} 
            {/* 🔥 SINGLE / DOUBLE TICK LOGIC */} 
            {m.sender._id === user._id && ( 
              <span style={{ fontSize: "12px", 
              color: "black", marginLeft: "10px", 
              marginTop: "2px",
              color: m.unreadBy?.length > 0 ? "red" : "yellow"
              }} > 
              {m.unreadBy?.length > 0 ? "sent" : "read"} 
              </span> 
            )}
            </span> 
            </div> 
        </div>
    ))}
</ScrollableFeed>
  );
};

export default ScrollableChat;