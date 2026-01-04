import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { Check, Trash2, Edit2 } from 'lucide-react';

interface SystemMessageProps {
  message: Message;
  onUpdateText: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
}

const SystemMessage: React.FC<SystemMessageProps> = ({ message, onUpdateText, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdateText(message.id, editText);
    } else {
      setEditText(message.text);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditText(message.text);
      setIsEditing(false);
    }
  };

  return (
    <div className="group relative flex items-center justify-center gap-4 py-4 px-8 my-2">
      <div 
        className="h-px flex-1 border-b-[2px] border-dotted border-white/60"
        style={{ maskImage: 'linear-gradient(to right, transparent, black)', WebkitMaskImage: 'linear-gradient(to right, transparent, black)' }}
      ></div>
      
      <div 
        className="relative"
        onDoubleClick={() => setIsEditing(true)}
        title="Double click to edit"
      >
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="bg-black/20 text-white text-sm font-medium border border-white/20 rounded px-2 py-1 outline-none min-w-[150px] text-center"
            />
            <button 
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleSave}
              className="bg-green-500 text-white p-1 rounded-full hover:bg-green-600"
            >
              <Check size={12} />
            </button>
          </div>
        ) : (
          <span className="text-white/80 text-sm font-medium tracking-wide whitespace-nowrap drop-shadow-sm cursor-default">
            {message.text}
          </span>
        )}

        {/* Hover Controls */}
        {!isEditing && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
             {/* We overlay controls slightly or position them above to avoid layout shift */}
             <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-full p-1 border border-white/10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="p-1.5 text-white/80 hover:text-white rounded-full transition-colors"
                >
                  <Edit2 size={12} />
                </button>
                <div className="w-px h-3 bg-white/20"></div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(message.id);
                  }}
                  className="p-1.5 text-red-400 hover:text-red-300 rounded-full transition-colors"
                >
                  <Trash2 size={12} />
                </button>
             </div>
          </div>
        )}
      </div>

      <div 
        className="h-px flex-1 border-b-[2px] border-dotted border-white/60"
        style={{ maskImage: 'linear-gradient(to left, transparent, black)', WebkitMaskImage: 'linear-gradient(to left, transparent, black)' }}
      ></div>
    </div>
  );
};

export default SystemMessage;