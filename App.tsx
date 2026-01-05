import { Analytics } from "@vercel/analytics/react"
import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import { Message, ChatConfig, Character, Sender } from './types';
import { INITIAL_MESSAGES, INITIAL_CONFIG } from './constants';
import ChatBubble from './components/ChatBubble';
import SystemMessage from './components/SystemMessage';
import Controls from './components/Controls';
import ImagePreviewModal from './components/ImagePreviewModal';

const AUDIO_URL = 'https://github.com/DEX-1101/czn-unigram/raw/refs/heads/main/asset/send.wav';

// Simple Audio Synthesis for Sound Effects
const playSound = (type: 'send' | 'receive' | 'system') => {
  if (type === 'send' || type === 'receive') {
      // Create a new instance for every play to handle rapid firing
      const audio = new Audio(AUDIO_URL);
      audio.volume = 0.5;
      audio.play().catch((e) => {
        // Auto-play policy might block this if no user interaction yet.
        // We catch to prevent errors in console.
      });
      return;
  }

  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    const now = ctx.currentTime;

    // System notification (subtle chord-like arpeggio effect via quick frequency jump)
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(300, now);
    oscillator.frequency.setValueAtTime(400, now + 0.05);
    
    gainNode.gain.setValueAtTime(0.05, now);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
    
    oscillator.start(now);
    oscillator.stop(now + 0.3);
  } catch (e) {
    // Silent fail if audio context not supported or blocked
  }
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [config, setConfig] = useState<ChatConfig>(INITIAL_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const tutorialRunning = useRef(false);

  // Splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Tutorial Logic
  useEffect(() => {
    if (!isLoading) {
      const hasSeenTutorial = localStorage.getItem('unigram_tutorial_completed');

      if (!hasSeenTutorial && !tutorialRunning.current) {
        tutorialRunning.current = true;
        setIsTutorialActive(true);
        
        const runTutorial = async () => {
          // Clear default messages and set up Renoa
          setMessages([]);
          setConfig(prev => ({
            ...prev,
            activeCharacterId: 'char_renoa',
            headerTitle: 'Renoa',
            showFooter: false
          }));

          const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

          // Attempt to wake up audio context on first user interaction if possible, 
          // but for tutorial we just try to play.
          
          // Message 1
          await delay(800);
          playSound('receive');
          setMessages(prev => [...prev, {
            id: 'tut-1',
            sender: 'character',
            characterId: 'char_renoa',
            text: 'Welcome to Unigram, Captain!'
          }]);

          // Message 2
          await delay(2500);
          playSound('receive');
          setMessages(prev => [...prev, {
            id: 'tut-2',
            sender: 'character',
            characterId: 'char_renoa',
            text: "I'm here to help you get started. Did you know you can edit any message?"
          }]);

          // Message 3
          await delay(2500);
          playSound('receive');
          setMessages(prev => [...prev, {
            id: 'tut-3',
            sender: 'character',
            characterId: 'char_renoa',
            text: 'Simply double-click on a chat bubble to change the text directly!'
          }]);

          // Message 4
          await delay(3000);
          playSound('receive');
          setMessages(prev => [...prev, {
            id: 'tut-4',
            sender: 'character',
            characterId: 'char_renoa',
            text: 'And if you want to delete a message, just hover over it and click the trash icon.'
          }]);

           // Message 5
           await delay(2000);
           playSound('receive');
           setMessages(prev => [...prev, {
             id: 'tut-5',
             sender: 'character',
             characterId: 'char_renoa',
             text: "That's it! Have fun creating your story, Captain."
           }]);

           // Extended Interaction
           
           await delay(1500);
           playSound('send');
           setMessages(prev => [...prev, {
             id: 'tut-6',
             sender: 'user',
             text: "Thankyou my wif-"
           }]);
           
           await delay(1000);
           playSound('send');
           setMessages(prev => [...prev, {
             id: 'tut-7',
             sender: 'user',
             text: "i mean.. Renoa."
           }]);

           await delay(1000);
           playSound('system');
           setMessages(prev => [...prev, {
             id: 'tut-8',
             sender: 'system',
             text: "Renoa is offline"
           }]);

           await delay(1000);
           playSound('system');
           setMessages(prev => [...prev, {
             id: 'tut-9',
             sender: 'system',
             text: "Renoa is online"
           }]);

           await delay(1500);
           playSound('receive');
           setMessages(prev => [...prev, {
             id: 'tut-10',
             sender: 'character',
             characterId: 'char_renoa',
             text: "What did you just say captain?"
           }]);

           await delay(1500);
           playSound('send');
           setMessages(prev => [...prev, {
             id: 'tut-11',
             sender: 'user',
             text: "Ehem... nothing important"
           }]);

           await delay(1000);
           playSound('receive');
           setMessages(prev => [...prev, {
             id: 'tut-12',
             sender: 'character',
             characterId: 'char_renoa',
             text: "??"
           }]);

           // Footer
           await delay(1000);
           setConfig(prev => ({
             ...prev,
             showFooter: true,
             footerText: "The conversation has ended."
           }));

          localStorage.setItem('unigram_tutorial_completed', 'true');
          setIsTutorialActive(false);
        };

        runTutorial();
      }
    }
  }, [isLoading]);

  // Auto-scroll window to bottom when messages change since the container grows
  useEffect(() => {
    // Timeout helps wait for animation frame/DOM update
    const timeoutId = setTimeout(() => {
        if (scrollRef.current) {
          // Scroll the internal container if needed, or window. 
          // Based on current layout, the window scrolls.
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [messages.length]);

  const handleUpdateText = (id: string, newText: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, text: newText } : msg
    ));
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const handleAddMessage = (sender: Sender, text: string) => {
    if (sender === 'user') {
      playSound('send');
    } else if (sender === 'character') {
      playSound('receive');
    } else {
      playSound('system');
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      sender,
      text,
      // If the sender is a character, assign the currently active character ID
      characterId: sender === 'character' ? config.activeCharacterId : undefined
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Helper to find the character for a message
  const getMessageCharacter = (msg: Message): Character | undefined => {
    if (msg.sender === 'user' || msg.sender === 'system') return undefined;
    // Prefer the message's specific characterId. 
    // Fallback to the FIRST character in the list if the ID is missing/invalid, 
    // rather than the active one, to keep history stable when switching active characters.
    const charId = msg.characterId || config.characters[0]?.id;
    return config.characters.find(c => c.id === charId) || config.characters[0];
  };

  // Helper to determine identity for grouping messages
  const getGroupingId = (msg: Message): string => {
    if (msg.sender === 'user') return 'user_sender';
    if (msg.sender === 'system') return `system_${msg.id}`; // System messages are unique/don't group
    return msg.characterId || config.characters[0]?.id || 'unknown_char';
  };

  const handleDownload = async () => {
    if (chatRef.current) {
      try {
        await document.fonts.ready;

        // html-to-image usually renders exactly what is on screen
        const dataUrl = await toPng(chatRef.current, {
          cacheBust: true,
          pixelRatio: 3,
          backgroundColor: null,
          style: {
            transform: 'none' // Reset any potential transforms on the container
          }
        });
        
        // Instead of downloading immediately, set the preview URL to open the modal
        setPreviewUrl(dataUrl);

      } catch (err) {
        console.error('Screenshot failed:', err);
        alert('Failed to create screenshot. Please check console.');
      }
    }
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="splash-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(20px)' }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
          >
            {/* Animated Gradient Background */}
            <motion.div 
               className="absolute inset-0 z-0"
               animate={{
                 background: [
                   "linear-gradient(135deg, #020617 0%, #2e1065 40%, #020617 100%)",
                   "linear-gradient(135deg, #020617 0%, #4c1d95 60%, #020617 100%)", 
                   "linear-gradient(135deg, #020617 0%, #2e1065 40%, #020617 100%)"
                 ]
               }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 z-0 mix-blend-overlay pointer-events-none"></div>

            {/* Content Container - Row Layout */}
            <motion.div 
              className="relative z-10 flex items-center gap-8 md:gap-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
                {/* Logo Section */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, x: 20 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="relative shrink-0"
                >
                     {/* Glow effect behind logo */}
                     <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-20 rounded-full scale-110"></div>
                     <img 
                        src="https://raw.githubusercontent.com/DEX-1101/czn-unigram/refs/heads/main/asset/logo.png" 
                        alt="Logo" 
                        className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-2xl relative z-10"
                     />
                </motion.div>

                {/* Text and Divider Section */}
                <div className="flex flex-col items-start justify-center h-full">
                    <h1 className="text-4xl md:text-6xl font-light text-white tracking-[0.4em] drop-shadow-2xl whitespace-nowrap leading-tight">
                        UNIGRAM
                    </h1>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="text-white/50 text-[10px] md:text-xs tracking-[0.3em] font-light uppercase mt-2 ml-1 mb-4"
                    >
                        LOADING INTERFACE...
                    </motion.p>
                    
                    <div className="w-full h-[1px] bg-white/10 rounded-full overflow-hidden relative">
                        <motion.div 
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className="relative min-h-screen w-full flex items-center justify-center p-4 lg:p-4 pb-[50vh] lg:pb-4 overflow-y-auto transition-colors duration-300"
        style={{ backgroundColor: config.backgroundColor }}
      >
        
        {/* Background overlay for depth (optional) */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/20 pointer-events-none fixed" />
        
        {/* Main Chat Interface Card */}
        <motion.div 
          ref={chatRef}
          data-id="chat-card"
          layout
          className="relative w-full flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-transparent"
          style={{ maxWidth: `${config.chatWidth}px` }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
        >
          
          {/* Header Background Image */}
          <div className="absolute top-0 left-0 right-0 h-52 z-0">
             {/* Gradient Mask to smooth bottom edge */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-black/60" />
            <img 
              src="https://raw.githubusercontent.com/DEX-1101/czn-unigram/refs/heads/main/asset/header.png" 
              alt="Header Background" 
              className="w-full h-full object-cover object-top scale-105"
            />
          </div>

          {/* Header Content */}
          <div className="relative z-20 h-16 shrink-0 flex items-center justify-between pl-6 pr-2 text-white">
            <h1 
              className="text-3xl font-normal tracking-normal text-shadow-sm drop-shadow-md truncate max-w-[85%]"
              title={config.headerTitle}
            >
              {config.headerTitle}
            </h1>
            <button className="opacity-80 hover:opacity-100 transition-opacity drop-shadow-md p-1">
              <X size={36} strokeWidth={1.5} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="relative z-10 flex-1 flex flex-col" data-id="message-container">
            {/* Dynamic Background Layer with rounded top corners */}
            <div 
              className="absolute inset-0 backdrop-blur-xl transition-colors duration-300 rounded-t-xl" 
              style={{ backgroundColor: config.chatBoxColor }}
            />
            
            <div 
              ref={scrollRef}
              data-id="scroll-area"
              className="relative z-10 flex-1 p-4 space-y-2 pb-4"
            >
              <div className="mt-2 space-y-2">
                <AnimatePresence initial={false} mode="popLayout">
                  {messages.map((msg, index) => {
                    if (msg.sender === 'system') {
                      return (
                        <motion.div
                          key={msg.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                        >
                          <SystemMessage 
                            message={msg}
                            onUpdateText={handleUpdateText}
                            onDelete={handleDeleteMessage}
                          />
                        </motion.div>
                      );
                    }

                    // Grouping Logic:
                    const currentId = getGroupingId(msg);
                    const prevId = index > 0 ? getGroupingId(messages[index - 1]) : null;
                    const nextId = index < messages.length - 1 ? getGroupingId(messages[index + 1]) : null;

                    const isFirstInGroup = index === 0 || currentId !== prevId;
                    const isLastInGroup = index === messages.length - 1 || currentId !== nextId;

                    const showAvatar = msg.sender === 'character' && isFirstInGroup;
                    const character = getMessageCharacter(msg);

                    return (
                      <motion.div
                        key={msg.id}
                        className="message-row"
                        layout
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <ChatBubble 
                          message={msg} 
                          character={character} // Pass specific character details
                          onUpdateText={handleUpdateText}
                          onDelete={handleDeleteMessage}
                          showAvatar={showAvatar}
                          isFirstInGroup={isFirstInGroup}
                          isLastInGroup={isLastInGroup}
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                
                {/* Footer Message */}
                {config.showFooter && config.footerText && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-4 py-2 px-8 mt-2"
                  >
                    <div 
                        className="h-px flex-1 border-b-[2px] border-dotted border-white/60"
                        style={{ maskImage: 'linear-gradient(to right, transparent, black)', WebkitMaskImage: 'linear-gradient(to right, transparent, black)' }}
                    ></div>
                    <span className="text-white/80 text-sm font-medium tracking-wide whitespace-nowrap drop-shadow-sm">
                      {config.footerText}
                    </span>
                    <div 
                        className="h-px flex-1 border-b-[2px] border-dotted border-white/60"
                        style={{ maskImage: 'linear-gradient(to left, transparent, black)', WebkitMaskImage: 'linear-gradient(to left, transparent, black)' }}
                    ></div>
                  </motion.div>
                )}

              </div>
            </div>
          </div>

        </motion.div>

        {/* Control Panel */}
        {!isLoading && (
          <Controls 
            config={config} 
            onConfigChange={setConfig} 
            onAddMessage={handleAddMessage} 
            onDownload={handleDownload}
            disabled={isTutorialActive}
          />
        )}
        
        {/* Image Preview Modal */}
        <AnimatePresence>
          {previewUrl && (
            <ImagePreviewModal 
              imageUrl={previewUrl} 
              onClose={() => setPreviewUrl(null)} 
            />
          )}
        </AnimatePresence>

      </div>
	  <Analytics />
    </>
  );
};

export default App;
