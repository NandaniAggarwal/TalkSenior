import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
  } from "@chakra-ui/react";
  import { FormControl,Box } from '@chakra-ui/react';
import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { ChatState } from '../../Context/ChatProvider';
import { Input } from '@chakra-ui/react';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';


const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      console.log("📢 Sending request to backend:", `/api/user?search=${query}`);
      const response = await axios.get(`/api/user?search=${search}`, config);
     console.log("✅ Response Data:", response.data);
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

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  {/*}
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
*/}
  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
  
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
  
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
  
      console.log("✅ Group Created:", data);
  
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.error("❌ Group Creation Error:", error);
      toast({
        title: "Failed to Create the Chat!",
        description: error.response?.data || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  
  const handleInputChange = (e) => {
    setSearch(e.target.value);
    if (searchTimeout) clearTimeout(searchTimeout);
  
    searchTimeout = setTimeout(() => {
      handleSearch(e.target.value);
    }, 500); // Delay API call by 500ms
  };
  

  return (
    <div>
        <span onClick={onOpen}>{children}</span>

<Modal onClose={onClose} isOpen={isOpen} isCentered>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader
      fontSize="35px"
      fontFamily="Work sans"
      display="flex"
      justifyContent="center"
    >
      Create Group Chat
    </ModalHeader>
    <ModalCloseButton />
    <ModalBody display="flex" flexDir="column" alignItems="center">
      <FormControl>
        <Input
          placeholder="Chat Name"
          mb={3}
          onChange={(e) => setGroupChatName(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <Input
          placeholder="Add Users eg: John, Piyush, Jane"
          mb={1}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </FormControl>
      <Box w="100%" display="flex" flexWrap="wrap">
        {selectedUsers.map((u) => (
          <UserBadgeItem
            key={u._id}
            user={u}
            handleFunction={() => handleDelete(u)}
          />
        ))}
      </Box>
      {loading ? (
        // <ChatLoading />
        <div>Loading...</div>
      ) : (
        searchResult
          ?.slice(0, 4)
          .map((user) => (
            <UserListItem
              key={user._id}
              user={user}
              handleFunction={() => handleGroup(user)}
            />
          ))
      )}
    </ModalBody>
    <ModalFooter>
      <Button onClick={handleSubmit} colorScheme="blue">
        Create Chat
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
    </div>
  )
}

export default GroupChatModal