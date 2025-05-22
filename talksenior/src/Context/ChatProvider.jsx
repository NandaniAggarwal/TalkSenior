import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { createContext, useContext, useState, useEffect } from "react";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);
    const history = useHistory();  
        useEffect(() => {
            const userInfo = localStorage.getItem("userInfo");
            try {
                if (userInfo) {
                    setUser(JSON.parse(userInfo));
                } else {
                    history.push("/"); // ✅ Agar userInfo nahi mila, to login pe bhej do
                }
            } catch (error) {
                console.error("Error parsing userInfo:", error);
                localStorage.removeItem("userInfo");
                history.push("/");
            }
            
    }, [history]);    

    return (
        <ChatContext.Provider value={{ user, setUser ,selectedChat,setSelectedChat,chats,setChats}}>
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;
