import { createContext, useContext, useState, useEffect } from "react";
import socket from "../socket";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);
    const [notification, setNotification] = useState([]);
    const [socketConnected, setSocketConnected] = useState(false);

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            try {
                setUser(JSON.parse(userInfo));
            } catch (error) {
                console.error("Error parsing userInfo:", error);
                localStorage.removeItem("userInfo");
            }
        }
    }, []);

    useEffect(() => {
    if (!user) return;

    socket.connect();
    socket.emit("setup", user);

    socket.on("connected", () => {
      setSocketConnected(true);
      console.log("Socket connected");
    });

    return () => {
      socket.off("connected");
    };
  }, [user]);

    return (
        <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification ,socketConnected}}>
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;
