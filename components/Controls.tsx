import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { User, Settings, MessageCircle, Palette, Send, Minus, Download, Smile, Github, MoveHorizontal } from 'lucide-react';
import { ChatConfig, Sender } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface ControlsProps {
  config: ChatConfig;
  onConfigChange: (newConfig: ChatConfig) => void;
  onAddMessage: (sender: Sender, text: string) => void;
  onDownload: () => void;
  disabled?: boolean;
}

const COMMON_EMOJIS = [
  // Smileys
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👹", "👺", "🤡", "💩", "👻", "💀", "☠️", "👽", "👾", "🤖", "🎃", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾",
  // Gestures
  "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💅", "🤳", "💪",
  // Hearts & Symbols
  "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "✨", "🔥", "💢", "💨", "💦", "💧", "💤", "💬", "💭", "🌈", "☀️", "🌙", "⭐", "🌟", "☁️",
  // Random Popular
  "🌸", "🦋", "🎈", "🎉", "🎁", "🎂", "🍎", "🍕", "🍦", "☕", "🍺", "🌍", "🚗", "📱", "💻", "💡", "📖", "📍", "🔔"
];

const Controls: React.FC<ControlsProps> = ({ config, onConfigChange, onAddMessage, onDownload, disabled = false }) => {
  const [newMessageText, setNewMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pickerPos, setPickerPos] = useState<{ top?: number; bottom?: number; right?: number }>({ right: 0 });
  
  const pickerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  const activeCharacter = config.characters.find(c => c.id === config.activeCharacterId) || config.characters[0];

  const updatePosition = () => {
    if (emojiButtonRef.current) {
        const rect = emojiButtonRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const pickerHeight = 320; // Estimated max height including padding
        
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        
        // Prefer below unless cramped
        const showBelow = spaceBelow > pickerHeight || spaceBelow > spaceAbove;
        
        setPickerPos({
            right: window.innerWidth - rect.right,
            top: showBelow ? rect.bottom + 8 : undefined,
            bottom: showBelow ? undefined : viewportHeight - rect.top + 8
        });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is inside picker or on the toggle button
      if (
        pickerRef.current && 
        !pickerRef.current.contains(event.target as Node) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
      if (showEmojiPicker) {
          updatePosition();
          // Use capture phase to handle scroll events from any container
          window.addEventListener('scroll', updatePosition, true);
          window.addEventListener('resize', updatePosition);
          return () => {
              window.removeEventListener('scroll', updatePosition, true);
              window.removeEventListener('resize', updatePosition);
          };
      }
  }, [showEmojiPicker]);

  const handleTogglePicker = () => {
    if (!showEmojiPicker) {
        updatePosition();
    }
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleAddMessage = (sender: Sender) => {
    if (!newMessageText.trim()) return;
    onAddMessage(sender, newMessageText);
    setNewMessageText('');
    setShowEmojiPicker(false);
  };

  const handleAddSeparator = () => {
    onAddMessage('system', 'New Chapter');
  };

  const addEmoji = (emoji: string) => {
    setNewMessageText(prev => prev + emoji);
    // Keep focus on textarea
    if (textareaRef.current) {
        textareaRef.current.focus();
    }
  };

  return (
    <>
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
      className={`fixed lg:right-6 lg:top-6 lg:bottom-6 bottom-0 left-0 right-0 lg:left-auto w-full lg:w-80 bg-slate-900/95 backdrop-blur-xl border-t lg:border border-slate-700 text-slate-200 shadow-2xl z-50 rounded-t-2xl lg:rounded-2xl transition-all duration-500 flex flex-col max-h-[50vh] lg:max-h-none ${disabled ? 'opacity-50 pointer-events-none grayscale' : ''}`}
    >
      {/* Scrollable Content Wrapper */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-700 pb-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Settings size={18} />
              <span>Editor Controls</span>
            </h2>
            <button 
              onClick={onDownload}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-colors shadow-lg flex items-center gap-2"
              title="Download Screenshot"
            >
              <Download size={18} />
            </button>
          </div>

          {/* Add Message Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <MessageCircle size={14} /> Add Message
                </h3>
                <button 
                    onClick={handleAddSeparator}
                    className="text-xs flex items-center gap-1 text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded border border-slate-600"
                    title="Insert a text separator"
                >
                    <Minus size={12} /> Separator
                </button>
            </div>
            
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder="Type a message..."
                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 pr-10 text-sm focus:outline-none focus:border-purple-500 transition-colors resize-none h-24"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddMessage('character');
                  }
                }}
              />
              <button
                ref={emojiButtonRef}
                onClick={handleTogglePicker}
                className={`absolute right-3 bottom-3 p-1 rounded-md transition-colors ${showEmojiPicker ? 'text-purple-400 bg-purple-500/10' : 'text-slate-500 hover:text-slate-300'}`}
                title="Emoji Picker"
              >
                <Smile size={20} />
              </button>
            </div>
            
            <div className="flex gap-2">
              {/* Send as User Button */}
              <button
                onClick={() => handleAddMessage('user')}
                className="flex-1 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/50 text-indigo-200 hover:text-white py-3 rounded-lg text-sm font-medium transition-all shadow-lg flex items-center justify-center gap-2 group/user"
              >
                <Send size={14} className="group-hover/user:scale-110 transition-transform"/> 
                <span>Me</span>
              </button>

              {/* Send as Character Button */}
              <button
                onClick={() => handleAddMessage('character')}
                className="flex-[2] flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg text-sm font-medium transition-all relative overflow-hidden group border border-slate-600 shadow-lg"
              >
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity">
                      <img src={activeCharacter.avatar} alt="" className="w-full h-full object-cover blur-[2px]" />
                  </div>
                  <span className="relative z-10 flex items-center gap-2 text-white font-semibold tracking-wide">
                    <Send size={14} /> {activeCharacter.name}
                  </span>
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-700" />

          {/* Character Management */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <User size={14} /> Characters
            </h3>

            {/* Character List */}
            <div className="flex flex-wrap gap-2">
              {config.characters.map((char) => (
                <div key={char.id} className="relative group shrink-0">
                  <button
                      onClick={() => onConfigChange({ ...config, activeCharacterId: char.id })}
                      className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all bg-white ${
                        config.activeCharacterId === char.id ? 'border-purple-500 scale-100 ring-2 ring-purple-500/50' : 'border-slate-600 scale-95 opacity-60 hover:opacity-100'
                      }`}
                      title={char.name}
                    >
                      <img src={char.avatar} alt={char.name} className="w-full h-full object-cover" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-700" />

          {/* Appearance Config */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Palette size={14} /> Appearance
            </h3>
            
            {/* Header Title Config */}
            <div className="space-y-2">
              <label className="text-xs text-slate-500">Header Title</label>
              <input
                type="text"
                value={config.headerTitle}
                onChange={(e) => onConfigChange({ ...config, headerTitle: e.target.value })}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-purple-500"
                placeholder="e.g. Agent Rei"
              />
            </div>
            
             {/* Chat Width Config */}
            <div className="space-y-2">
               <div className="flex justify-between items-center text-xs text-slate-500">
                  <label className="flex items-center gap-1"><MoveHorizontal size={10} /> Chat Width</label>
                  <span className="font-mono text-[10px] bg-slate-800 px-1 rounded border border-slate-700">{config.chatWidth}px</span>
               </div>
               <input
                type="range"
                min="400"
                max="1200"
                step="10"
                value={config.chatWidth}
                onChange={(e) => onConfigChange({ ...config, chatWidth: Number(e.target.value) })}
                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* Chat Box Background Color */}
            <div className="space-y-2">
              <label className="text-xs text-slate-500">Chat Box Color (supports rgba)</label>
              <div className="flex gap-2 items-center">
                <div className="relative overflow-hidden w-10 h-10 rounded-lg border border-slate-600">
                  <input
                    type="color"
                    value={config.chatBoxColor.startsWith('#') ? config.chatBoxColor : '#ffffff'}
                    onChange={(e) => onConfigChange({ ...config, chatBoxColor: e.target.value })}
                    className="absolute -top-2 -left-2 w-14 h-14 p-0 cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  value={config.chatBoxColor}
                  onChange={(e) => onConfigChange({ ...config, chatBoxColor: e.target.value })}
                  className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-purple-500 font-mono"
                  placeholder="rgba(255,255,255,0.5)"
                />
              </div>
            </div>

            {/* Footer Text */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs text-slate-500">Footer Text</label>
                {/* Toggle Switch */}
                <button
                  onClick={() => onConfigChange({ ...config, showFooter: !config.showFooter })}
                  className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${config.showFooter ? 'bg-purple-600' : 'bg-slate-700'}`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${config.showFooter ? 'translate-x-4' : 'translate-x-1'}`}
                  />
                </button>
              </div>
              {config.showFooter && (
                <input
                    type="text"
                    value={config.footerText}
                    onChange={(e) => onConfigChange({ ...config, footerText: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-purple-500"
                    placeholder="e.g. The conversation has ended."
                />
              )}
            </div>
          </div>
          
          {/* Bottom Actions */}
          <div className="pt-4">
             <motion.a
              href="https://github.com/DEX-1101/czn-unigram"
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center justify-center gap-2 w-full py-3 rounded-lg text-xs font-bold tracking-wide text-white shadow-xl overflow-hidden border border-white/10 group"
              animate={{
                 background: [
                   "linear-gradient(135deg, #020617 0%, #2e1065 40%, #020617 100%)",
                   "linear-gradient(135deg, #020617 0%, #4c1d95 60%, #020617 100%)", 
                   "linear-gradient(135deg, #020617 0%, #2e1065 40%, #020617 100%)"
                 ]
               }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               whileHover={{ 
                 scale: 1.05, 
                 boxShadow: "0 0 20px rgba(124, 58, 237, 0.4)",
                 background: "linear-gradient(135deg, #312e81 0%, #8b5cf6 50%, #312e81 100%)",
                 textShadow: "0 0 8px rgba(255,255,255,0.5)"
               }}
               whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay z-0 pointer-events-none"></div>
              
              <div className="relative z-10 flex items-center gap-2">
                <Github size={16} />
                <span>DEX-1101/czn-unigram</span>
              </div>
            </motion.a>
          </div>
      </div>
    </motion.div>

    {/* Emoji Picker Portal */}
    {createPortal(
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            ref={pickerRef}
            initial={{ opacity: 0, scale: 0.95, y: pickerPos.top ? -10 : 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: pickerPos.top ? -10 : 10 }}
            style={{
              position: 'fixed',
              top: pickerPos.top,
              bottom: pickerPos.bottom,
              right: pickerPos.right,
              zIndex: 9999,
              transformOrigin: pickerPos.top ? 'top right' : 'bottom right'
            }}
            className="w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-3 backdrop-blur-lg flex flex-col gap-2"
          >
            <div className="grid grid-cols-7 gap-1 max-h-64 overflow-y-auto custom-scrollbar p-1">
              {COMMON_EMOJIS.map((emoji, idx) => (
                <button
                  key={idx}
                  onClick={() => addEmoji(emoji)}
                  className="text-xl hover:bg-white/10 p-1.5 rounded transition-colors flex items-center justify-center select-none"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </>
  );
};

export default Controls;