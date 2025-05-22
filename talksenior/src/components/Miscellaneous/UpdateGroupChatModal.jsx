{/* 
import React from 'react'
import { ViewIcon } from "@chakra-ui/icons";
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
  FormControl,
  Input,
  useToast,
  Box,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
    
  const { selectedChat, setSelectedChat, user } = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();


  
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
      const response = await axios.get(`/api/user?search=${query}`, config);
      console.log(response.data);
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
      setLoading(false);
    }
};

const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      console.log(response.data._id);
      // setSelectedChat("");
      setSelectedChat(response.data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response?.data?.message || "Something went wrong!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
};

const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
        toast({
          title: "User Already in group!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
  
      if (selectedChat.groupAdmin._id !== user._id) {
        toast({
          title: "Only admins can add someone!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
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
        const response = await axios.put(
          `/api/chat/groupadd`,
          {
            chatId: selectedChat._id,
            userId: user1._id,
          },
          config
        );
  
        setSelectedChat(response.data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response?.data?.message || "Something went wrong!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
      setGroupChatName("");
};

const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
        toast({
          title: "Only admins can remove someone!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
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
        const response = await axios.put(
          `/api/chat/groupremove`,
          {
            chatId: selectedChat._id,
            userId: user1._id,
          },
          config
        );
  
        user1._id === user._id ? setSelectedChat(null) : setSelectedChat(response.data);
        setFetchAgain(!fetchAgain);
        fetchMessages();
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response?.data?.message || "Something went wrong!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
      setGroupChatName("");
};

  return (
    <>
    <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          fontSize="35px"
          fontFamily="Work sans"
          d="flex"
          justifyContent="center"
        >
          {selectedChat.chatName}
        </ModalHeader>

        <ModalCloseButton />
        <ModalBody d="flex" flexDir="column" alignItems="center">
          <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
            {selectedChat.users.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                admin={selectedChat.groupAdmin}
                handleFunction={() => handleRemove(u)}
              />
            ))}
          </Box>
          <FormControl d="flex">
            <Input
              placeholder="Chat Name"
              mb={3}
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <Button
              variant="solid"
              colorScheme="teal"
              ml={1}
              isLoading={renameloading}
              onClick={handleRename}
            >
              Update
            </Button>
          </FormControl>
          <FormControl>
            <Input
              placeholder="Add User to group"
              mb={1}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </FormControl>

          {loading ? (
            <Spinner size="lg" />
          ) : (
            searchResult?.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => handleAddUser(user)}
              />
            ))
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => handleRemove(user)} colorScheme="red">
            Leave Group
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </>
  )
}

export default UpdateGroupChatModal
*/}

import React, { useState, useEffect } from "react";
import { ViewIcon } from "@chakra-ui/icons";
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
  FormControl,
  Input,
  useToast,
  Box,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const { selectedChat, setSelectedChat, user } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();

  // 🔎 Handle Searching Users
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const response = await axios.get(`/api/user?search=${query}`, config);
      setSearchResult(response.data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    setLoading(false);
  };

  // ✏️ Rename Group Chat
  const handleRename = async () => {
    if (!groupChatName) return;
  
    try {
      setRenameLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
  
      const response = await axios.put(
        `/api/chat/rename`,
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );
  
      console.log("Rename Response:", response.data); // ✅ Check if API is sending correct response
  
      // ✅ Update the selected chat's name
      setSelectedChat((prevChat) => ({
        ...prevChat,
        chatName: response.data.chatName,
      }));
  
      // ✅ Ensure the updated name appears in "My Chats"
      setFetchAgain(!fetchAgain);
  
      toast({
        title: "Group name updated!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
  
    } catch (error) {
      console.error("Rename Error:", error.response?.data || error.message); // 🔍 More detailed error logging
      toast({
        title: "Error Occurred!",
        description: error.response?.data?.message || "Failed to rename group.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setRenameLoading(false);
      setGroupChatName(""); // Clear input field after rename
    }
  };


const handleAddUser = async (user1) => {
  // ✅ Prevent adding a user who is already in the group
  if (selectedChat.users.some((u) => u._id === user1._id)) {
    toast({
      title: "User already in group!",
      status: "warning",
      duration: 3000,
      isClosable: true,
    });
    return;
  }

  // ✅ Ensure only admins can add users
  const isAdmin = selectedChat.groupAdmin.some((admin) => admin._id === user._id);
  if (!isAdmin) {
    toast({
      title: "Only admins can add users!",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    return;
  }

  try {
    setLoading(true);
    const config = {
      headers: { Authorization: `Bearer ${user.token}` },
    };
    const response = await axios.put(
      `/api/chat/groupadd`,
      { chatId: selectedChat._id, userId: user1._id },
      config
    );

    // ✅ Update UI immediately
    setSelectedChat((prevChat) => ({
      ...prevChat,
      users: response.data.users,
    }));

    setFetchAgain(!fetchAgain);
    toast({
      title: "User added successfully!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  } catch (error) {
    toast({
      title: "Error Occurred!",
      description: error.response?.data?.message || "Failed to add user.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }
  setLoading(false);
};


  const handleRemove = async (user1) => {
    const isAdmin = selectedChat.groupAdmin.some((admin) => admin._id === user._id);

    // ✅ Allow admins to remove other users, or allow self-removal
    if (!isAdmin && user1._id !== user._id) {
      toast({
        title: "Only admins can remove users!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const response = await axios.put(
        `/api/chat/groupremove`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );

      if (user1._id === user._id) {
        // ✅ If user is removing themselves, exit the chat
        setSelectedChat(null);
      } else {
        // ✅ Update UI by removing the user from the chat state
        setSelectedChat((prevChat) => ({
          ...prevChat,
          users: prevChat.users.filter((u) => u._id !== user1._id),
        }));
      }

      setFetchAgain(!fetchAgain);
      fetchMessages();
      toast({
        title: "User removed successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response?.data?.message || "Failed to remove user.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  return (
    <>
      <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" fontFamily="Work sans">
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody>
            {/* Display Users in Group */}
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>

            {/* Rename Group */}
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button colorScheme="teal" ml={1} isLoading={renameloading} onClick={handleRename}>
                Update
              </Button>
            </FormControl>

            {/* Search and Add Users */}
            <FormControl>
              <Input placeholder="Add User to Group" mb={1} onChange={(e) => handleSearch(e.target.value)} />
            </FormControl>

            {loading ? <Spinner size="lg" /> : (
              searchResult?.map((user) => (
                <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
              ))
            )}
          </ModalBody>

          {/* Leave Group Button */}
          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
