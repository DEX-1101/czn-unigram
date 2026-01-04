import React, { useState, useRef, useEffect } from 'react';
import { Message, Character } from '../types';
import { Check, Edit2, Trash2 } from 'lucide-react';

interface ChatBubbleProps {
  message: Message;
  character?: Character;
  onUpdateText: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
  showAvatar: boolean;
  isLastInGroup: boolean;
  isFirstInGroup: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  message, 
  character, 
  onUpdateText,
  onDelete,
  showAvatar,
  isLastInGroup,
  isFirstInGroup
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Reset height to auto to calculate scrollHeight
      inputRef.current.style.height = 'auto'; 
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdateText(message.id, editText);
    } else {
      setEditText(message.text); // Revert if empty
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditText(message.text);
      setIsEditing(false);
    }
  };

  const isUser = message.sender === 'user';

  return (
    <div className={`flex w-full mb-2 ${isUser ? 'justify-end' : 'justify-start'} ${isLastInGroup ? 'mb-6' : ''}`}>
      
      {/* Character Avatar Side */}
      {!isUser && (
        <div className="flex flex-col items-center mr-3 w-[50px] flex-shrink-0 pt-0 group/avatar relative">
          {showAvatar && character ? (
            <>
                <img 
                  src={character.avatar} 
                  alt={character.name} 
                  className="w-[50px] h-[50px] rounded-full object-cover border-2 border-white shadow-md bg-white"
                />
            </>
          ) : <div className="w-[50px]" />}
        </div>
      )}

      <div className={`flex flex-col max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Name Label for Character */}
        {!isUser && showAvatar && character && (
          <span className="text-white text-sm mb-1.5 ml-1 font-semibold drop-shadow-md tracking-wide">
            {character.name}
          </span>
        )}

        {/* The Bubble */}
        <div 
          className={`
            relative px-4 py-[5px] pb-[7px] shadow-md text-[15px] leading-[1.35] break-words group transition-all duration-200 chat-bubble-text
            ${isUser 
              ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white rounded-lg' 
              : 'bg-white text-gray-800 rounded-lg'
            }
          `}
          onDoubleClick={() => setIsEditing(true)}
          title="Double click to edit"
        >
          {/* Arrow / Tail - Only show if it's the first message in the group */}
          {isFirstInGroup && (
            isUser ? (
               <div className="absolute top-[8px] -right-[9px] w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-[#6D28D9] border-b-[8px] border-b-transparent drop-shadow-sm pointer-events-none"></div>
            ) : (
               <div className="absolute top-[8px] -left-[9px] w-0 h-0 border-t-[8px] border-t-transparent border-r-[12px] border-r-white border-b-[8px] border-b-transparent drop-shadow-sm pointer-events-none"></div>
            )
          )}

          {isEditing ? (
            <div className="min-w-[150px]">
              <textarea
                ref={inputRef}
                value={editText}
                onChange={(e) => {
                  setEditText(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className={`
                  w-full bg-transparent outline-none resize-none overflow-hidden
                  ${isUser ? 'text-white placeholder-purple-200' : 'text-gray-800 placeholder-gray-400'}
                `}
                rows={1}
              />
              <button 
                onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
                onClick={handleSave}
                className="absolute -right-2 -bottom-2 bg-green-500 text-white p-1 rounded-full shadow-lg hover:bg-green-600 transition-colors z-10"
              >
                <Check size={12} />
              </button>
            </div>
          ) : (
            <>
              {/* Wrapped text content for better screenshot targeting */}
              <span 
                className="bubble-text-content block whitespace-pre-wrap break-words"
              >
                {message.text}
              </span>
              
              {/* Controls on Hover */}
              <div className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ${isUser ? '-left-12' : '-right-12'}`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(message.id);
                  }}
                  className="p-1.5 bg-black/30 hover:bg-red-500/80 text-white/80 hover:text-white rounded-full transition-colors backdrop-blur-sm"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
                <div className={`pointer-events-none ${isUser ? 'text-white/50' : 'text-gray-400'}`}>
                  <Edit2 size={12} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;