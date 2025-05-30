import React from 'react'
import {useState} from "react";
import { Avatar, MenuList, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import { ChatState } from '../../Context/ChatProvider';
import { Button } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import { Menu , MenuButton,MenuItem, MenuDivider} from '@chakra-ui/react';
import {BellIcon, ChevronDownIcon} from '@chakra-ui/icons'
import ProfileModal from './ProfileModal'
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { Input } from '@chakra-ui/react';
import ChatLoading from './ChatLoading';
import { Drawer,DrawerContent,DrawerHeader,DrawerBody,DrawerOverlay } from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/react';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../config/ChatLogics';
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

const SideDrawer = () => {
        const [search, setSearch] = useState("");
        const [searchResult, setSearchResult] = useState([]);
        const [loading, setLoading] = useState(false);
        const [loadingChat, setLoadingChat] = useState(false);
        const{ user,setSelectedChat,chats,setChats, notification,setNotification }=ChatState();
        const { isOpen, onOpen, onClose } = useDisclosure();
        const history=useHistory();
        const toast=useToast();


        const logoutHandler = () => {
            localStorage.removeItem("userInfo");
            history.push("/");
        };

        /*
        const handleSearch = async () => {
            if (!search) {
              toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
              });
              return;
            }
        
            try {
              setLoading(true);
        
              const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              };
              console.log("📢 Sending search request to backend...");
                console.log("🔎 Search Query:", search);
                console.log("🛠 Config Headers:", config);

                const response = await axios.get(`/api/user?search=${search}`, config);
                console.log("✅ Search Response:", response.data); 
                setLoading(false);
                setSearchResult(response.data);
            } catch (error) {
              toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
              });
            }
          };
        
        */
          const handleSearch = async () => {
            if (!search) {
              toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
              });
              return;
            }
        
            try {
              setLoading(true);
        
              const config = {
                headers: {
                  Authorization: `Bearer ${user?.token}`,  // Safe access to token
                },
              };
        
              console.log("📢 Sending search request to backend...");
              console.log("🔎 Search Query:", search);
              console.log("🛠 Config Headers:", config);
        
              const response = await axios.get(`/api/user?search=${search}`, config);
              console.log("✅ Search Response:", response.data);  // Debugging
        
              setLoading(false);
              setSearchResult(response.data);
            } catch (error) {
              console.error("❌ Search Error:", error);
        
              toast({
                title: "Error Occured!",
                description: error.response?.data?.message || "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
              });
        
              setLoading(false);
            }
          };
        
          const accessChat = async (userId) => {
            try {
                setLoadingChat(true);
                const config = {
                  headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                  },
                };
                const { data } = await axios.post(`/api/chat`, { userId }, config);
          
                if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
                setSelectedChat(data);
                setLoadingChat(false);
                onClose();
              } catch (error) {
                toast({
                  title: "Error fetching the chat",
                  description: error.message,
                  status: "error",
                  duration: 5000,
                  isClosable: true,
                  position: "bottom-left",
                });
              }
        };

  return (
    <>
    <Box display="flex" justifyContent="space-between" alignItems="center" 
     bg="#D8D7FF" w="100vw" padding="5px 10px" borderBottom="4px solid #B0AFC9">
    
    <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
        <Button variant="ghost" bg="#A7C7E7" onClick={onOpen}
                color="white" _hover={{ bg: "#86A8CF" }}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px={4}>Search User</Text>
        </Button>
    </Tooltip>

    <Text fontSize="3xl" fontFamily="Work Sans" fontWeight="bold" color="#2D2D2D">
        TALK SENIOR
    </Text>

    <div>
      <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}
                        bg="#F5F5FA" color="#2D2D2D" _hover={{ bg: "#E3E2F3" }}>
                <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
            </MenuButton>
            <MenuList bg="#F5F5FA">
                <ProfileModal user={user}>
                    <MenuItem _hover={{ bg: "#E3E2F3" }}>My Profile</MenuItem>
                </ProfileModal>
                <MenuDivider />
                <MenuItem onClick={logoutHandler} _hover={{ bg: "#E3E2F3" }}>
                    Logout
                </MenuItem>
            </MenuList>
        </Menu>
    </div>
</Box>

<Drawer placement="left" onClose={onClose} isOpen={isOpen}>
    <DrawerOverlay />
    <DrawerContent bg="#F5F5FA">
        <DrawerHeader borderBottomWidth="1px" color="#2D2D2D">Search Users</DrawerHeader>
        <DrawerBody>
            <Box display="flex" pb={2}>
                <Input placeholder="Search by name or email" mr={2}
                       value={search} onChange={(e) => setSearch(e.target.value)}
                       border="1px solid #B0AFC9" />
                <Button onClick={handleSearch} bg="#A7C7E7" color="white"
                        _hover={{ bg: "#86A8CF" }}>
                    Go
                </Button>
            </Box>
            {loading ? (
                <ChatLoading />
            ) : (
                searchResult?.map((user) => (
                  <Box key={user._id} 
         bg="#F0F0FF"  // Light pastel background
         p={3} 
         mb={2} 
         borderRadius="lg" 
         cursor="pointer" 
         _hover={{ bg: "#D9D9F3", boxShadow: "md" }}  // Soft purple tint instead of blue
         onClick={() => accessChat(user._id)}>
        
        <UserListItem user={user} />
    </Box>
                ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
        </DrawerBody>
    </DrawerContent>
</Drawer>

    </>
  )
}

export default SideDrawer