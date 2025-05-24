import { assets } from '@/assets/assets';
import Image from 'next/image';
import React, { useState } from 'react';
import { useClerk, UserButton } from '@clerk/nextjs';
import { useAppContext } from '@/context/Appcontext';
import ChatLabel from './ChatLabel';

const Sidebar = ({ expand, setExpand }) => {
  const { openSignIn } = useClerk();
  const { user, chats, createNewChat, currentChatId } = useAppContext(); // Assuming currentChatId exists
  const [openMenu, setOpenMenu] = useState({ id: 0, open: false });

  const latestChat = chats.length ? chats[chats.length - 1] : null;

  return (
    <div
      className={`flex flex-col justify-between bg-[#212327] pt-7 transition-all z-50 max-md:absolute max-md:h-screen ${
        expand ? 'p-4 w-64' : 'md:w-20 w-0'
      }`}
    >
      {/* Top Section */}
      <div>
        {/* Logo and Expand Button */}
        <div className={`flex ${expand ? 'flex-row gap-10' : 'flex-col items-center gap-8'}`}>
          <Image
            className={expand ? 'w-36' : 'w-10'}
            src={expand ? assets.logo_text : assets.logo_icon}
            alt="Logo"
          />
          <div
            onClick={() => setExpand(!expand)}
            className="group relative flex items-center justify-center hover:bg-gray-500/20 h-9 w-9 rounded-lg cursor-pointer"
          >
            <Image src={assets.menu_icon} alt="Menu icon" className="md:hidden" />
            <Image
              src={expand ? assets.sidebar_close_icon : assets.sidebar_icon}
              alt="Sidebar Toggle Icon"
              className="hidden md:block w-7"
            />
            <div
              className={`absolute w-max ${
                expand ? 'left-1/2 -translate-x-1/2 top-12' : '-top-12 left-0'
              } opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg`}
            >
              {expand ? 'Close sidebar' : 'Open sidebar'}
              <div
                className={`w-3 h-3 absolute bg-black rotate-45 ${
                  expand ? 'left-1/2 -top-1.5 -translate-x-1/2' : 'left-4 -bottom-1.5'
                }`}
              />
            </div>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={createNewChat}
          className={`mt-8 flex items-center justify-center cursor-pointer ${
            expand
              ? 'bg-primary hover:opacity-90 rounded-2xl gap-2 p-2.5 w-max'
              : 'group relative h-9 w-9 mx-auto hover:bg-gray-500/30 rounded-lg'
          }`}
        >
          <Image
            className={expand ? 'w-6' : 'w-7'}
            src={expand ? assets.chat_icon : assets.chat_icon_dull}
            alt="New chat icon"
          />
          <div className="absolute w-max -top-12 -right-12 opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg">
            {latestChat ? `Last: ${latestChat.name}` : 'Start New Chat'}
            <div className="w-3 h-3 absolute bg-black rotate-45 left-4 -bottom-1.5" />
          </div>
          {expand && <p className="text-white font-medium">New chat</p>}
        </button>

        {/* Recent Chats */}
        <div className={`mt-8 text-white/25 text-sm ${expand ? 'block' : 'hidden'}`}>
          <p className="my-1">Recents</p>
          {chats.map((chat) => (
            <ChatLabel
              key={chat._id}
              name={chat.name}
              id={chat._id}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              isActive={chat._id === currentChatId} // Optional: highlight current chat
            />
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div>
        {/* QR App Download */}
        <div
          className={`flex items-center cursor-pointer group relative ${
            expand
              ? 'gap-1 text-white/80 text-sm p-2.5 border border-primary rounded-lg hover:bg-white/10'
              : 'h-10 w-10 mx-auto hover:bg-gray-500/30 rounded-lg'
          }`}
        >
          <Image
            className={expand ? 'w-5' : 'w-6.5 mx-auto'}
            src={expand ? assets.phone_icon : assets.phone_icon_dull}
            alt="Phone icon"
          />
          <div
            className={`absolute -top-60 pb-8 ${!expand && '-right-40'} opacity-0 group-hover:opacity-100 transition hidden group-hover:block`}
          >
            <div className="relative w-max bg-black text-white text-sm p-3 rounded-lg shadow-lg">
              <Image src={assets.qrcode} alt="QR code" className="w-44" />
              <p>Scan to get DeepSeek App</p>
              <div
                className={`w-3 h-3 absolute bg-black rotate-45 ${
                  expand ? 'right-1/2' : 'left-4'
                } -bottom-1.5`}
              />
            </div>
          </div>
        </div>

        {/* App Label */}
        {expand && (
          <div className="flex items-center gap-2 mt-2 text-white text-sm">
            <span>Get App</span>
            <Image alt="New icon" src={assets.new_icon} className="w-4 h-4" />
          </div>
        )}

        {/* User Profile */}
        <div
          className={`flex items-center ${
            expand ? 'hover:bg-white/10 rounded-lg' : 'justify-center w-full'
          } gap-3 text-white/60 text-sm p-2 mt-2 cursor-pointer`}
          onClick={user ? null : openSignIn}
        >
          {user ? (
            <UserButton />
          ) : (
            <Image src={assets.profile_icon} alt="User Avatar" className="w-7" />
          )}
          {expand && <span>My Profile</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
