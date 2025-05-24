import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/Appcontext';
import axios from 'axios';
import Image from 'next/image';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Promptbox = ({ setIsLoading, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const { user, chats, setChats, selectedChat, setSelectedChat } = useAppContext();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendPrompt();
    }
  };

  const sendPrompt = async () => {
    const promptCopy = prompt.trim();
    if (!promptCopy) return;

    if (!user) {
      toast.error('Login to send message');
      return;
    }
    if (isLoading) {
      toast.error('Wait for the previous prompt response');
      return;
    }

    try {
      setIsLoading(true);
      setPrompt('');

      const userPrompt = {
        role: 'user',
        content: promptCopy,
        timestamp: Date.now(),
      };

      // Update chats state with user prompt
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === selectedChat._id
            ? { ...chat, messages: [...chat.messages, userPrompt] }
            : chat
        )
      );

      // Update selected chat
      setSelectedChat((prev) => ({
        ...prev,
        messages: [...prev.messages, userPrompt],
      }));

      // Call API
      const { data } = await axios.post('/api/chat/ai', {
        chatId: selectedChat._id,
        prompt: promptCopy,
      });

      if (data.success) {
        // Add empty assistant message to show typing effect
        let assistantMessage = {
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
        };

        setSelectedChat((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
        }));

        // Stream assistant message word-by-word
        const messageTokens = data.data.content.split(' ');
        for (let i = 0; i < messageTokens.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, i === 0 ? 0 : 100));
          assistantMessage = {
            ...assistantMessage,
            content: messageTokens.slice(0, i + 1).join(' '),
          };
          setSelectedChat((prev) => ({
            ...prev,
            messages: [...prev.messages.slice(0, -1), assistantMessage],
          }));
        }

        // Also update chats state with full assistant message
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === selectedChat._id
              ? { ...chat, messages: [...chat.messages, data.data] }
              : chat
          )
        );
      } else {
        toast.error(data.message);
        setPrompt(promptCopy);
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
      setPrompt(promptCopy);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendPrompt();
      }}
      className={`w-full ${
        selectedChat?.messages.length > 0 ? 'max-w-3xl' : 'max-w-2xl'
      } bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}
    >
      <textarea
        onKeyDown={handleKeyDown}
        className="outline-none w-full resize-none overflow-hidden break-words bg-transparent"
        rows={2}
        placeholder="Message DeepSeek"
        required
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
        disabled={isLoading}
      />

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-md cursor-pointer hover:bg-gray-500/20 transition">
            <Image className="h-5" src={assets.deepthink_icon} alt="" />
            DeepThink (R1)
          </p>
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-md cursor-pointer hover:bg-gray-500/20 transition">
            <Image className="h-5" src={assets.search_icon} alt="" />
            Search
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Image className="w-4 cursor-pointer" src={assets.pin_icon} alt="" />
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className={`${
              prompt.trim() ? 'bg-primary' : 'bg-[#71717a]'
            } rounded-full p-2 cursor-pointer`}
          >
            <Image
              className="w-3.5 aspect-square"
              src={prompt.trim() ? assets.arrow_icon : assets.arrow_icon_dull}
              alt="send"
            />
          </button>
        </div>
      </div>
    </form>
  );
};

export default Promptbox;
