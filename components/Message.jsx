import { assets } from '@/assets/assets';
import Image from 'next/image';
import React, { useEffect } from 'react';
import Markdown from 'react-markdown';
import Prism from 'prismjs';
import toast from 'react-hot-toast';

const Message = ({ role, content }) => {

  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  const copyMessage = () => {
    navigator.clipboard.writeText(content);
    toast.success("Message copied to clipboard");
  };

  const handleEdit = () => {
    toast("Edit button clicked");
  };

  const handleRegenerate = () => {
    toast("Regenerate button clicked");
  };

  const handleLike = () => {
    toast("Liked");
  };

  const handleDislike = () => {
    toast("Disliked");
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl text-sm">
      <div className={`flex flex-col w-full mb-8 ${role === 'user' ? 'items-end' : ''}`}>
        <div
          className={`group relative flex max-w-2xl py-3 rounded-xl ${
            role === 'user' ? 'bg-[#414158] px-5' : 'bg-[#343541] px-5 items-start gap-3'
          } break-words whitespace-pre-wrap`}
        >
          {role === 'user' ? (
            <div className="flex flex-col w-full break-words whitespace-pre-wrap">
              <span className="text-white/90 break-words whitespace-pre-wrap">{content}</span>
              <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 mt-2">
                <Image onClick={copyMessage} src={assets.copy_icon} alt="copy icon" className="w-4 cursor-pointer" />
                <Image onClick={handleEdit} src={assets.pencil_icon} alt="pencil icon" className="w-4.5 cursor-pointer" />
              </div>
            </div>
          ) : (
            <>
              <Image
                src={assets.logo_icon}
                alt="logo icon"
                className="h-9 w-9 p-1 border border-white/15 rounded-full"
              />
              <div className="flex flex-col w-full break-words whitespace-pre-wrap">
                <div className="space-y-4 break-words whitespace-pre-wrap">
                  <Markdown>{content}</Markdown>
                </div>
                <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 mt-2 pr-2">
                  <Image onClick={copyMessage} src={assets.copy_icon} alt="copy icon" className="w-4.5 cursor-pointer" />
                  <Image onClick={handleRegenerate} src={assets.regenerate_icon} alt="regenerate icon" className="w-4 cursor-pointer" />
                  <Image onClick={handleLike} src={assets.like_icon} alt="like icon" className="w-4 cursor-pointer" />
                  <Image onClick={handleDislike} src={assets.dislike_icon} alt="dislike icon" className="w-4 cursor-pointer" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
