"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = ({ children }) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const selectedChatId = selectedChat?._id || null;

  const fetchUserChats = async () => {
    try {
      if (!user) return;

      const token = await getToken();
      const { data } = await axios.get("/api/chat/get", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        const sortedChats = data.data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setChats(sortedChats);

        // If no chat exists, create one and fetch again
        if (sortedChats.length === 0) {
          await createNewChat(); // This calls fetchUserChats again
          return;
        }

        // Preserve current selectedChat if still exists
        const stillExists = sortedChats.find(chat => chat._id === selectedChat?._id);
        setSelectedChat(stillExists || sortedChats[0]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const createNewChat = async () => {
    try {
      if (!user) return null;

      const token = await getToken();
      const { data } = await axios.post(
        "/api/chat/create",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        await fetchUserChats(); // ensure chats updated after creation
        toast.success("New chat created");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const renameChat = async (chatId, newName) => {
    try {
      if (!user) return null;

      const token = await getToken();
      const { data } = await axios.post(
        "/api/chat/rename",
        { chat: chatId, name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        await fetchUserChats();

        // Update selectedChat if renamed
        if (selectedChat?._id === chatId) {
          setSelectedChat({...selectedChat,name:newName});
        }

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserChats();
    }
  }, [user]);

  const value = {
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    selectedChatId,
    fetchUserChats,
    createNewChat,
    renameChat,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
