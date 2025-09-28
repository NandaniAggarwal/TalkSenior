import { createContext, useContext, useState, useEffect } from "react";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);
    const [notification, setNotification] = useState([]);

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

    return (
        <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification }}>
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;
