import React, { useState, useRef, useEffect } from 'react';
import { X, Download, ArrowUpFromLine, ArrowDownFromLine, BoxSelect, Square } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImagePreviewModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ imageUrl, onClose }) => {
  const [trimTop, setTrimTop] = useState(0);
  const [trimBottom, setTrimBottom] = useState(0);
  const [cornerRadius, setCornerRadius] = useState(32); // Default to approx what the card looks like
  
  const imgRef = useRef<HTMLImageElement>(null);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    setDisplaySize({ width: img.width, height: img.height });
  };
  
  // Update display size on window resize to ensure radius calculation is accurate
  useEffect(() => {
    const updateSize = () => {
        if(imgRef.current) {
            setDisplaySize({ width: imgRef.current.width, height: imgRef.current.height });
        }
    }
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleSave = () => {
    if (!naturalSize.width || !imgRef.current) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate crop in actual pixels based on percentage
    const topPx = (trimTop / 100) * naturalSize.height;
    const bottomPx = (trimBottom / 100) * naturalSize.height;
    const finalHeight = naturalSize.height - topPx - bottomPx;
    
    if (finalHeight <= 0) return;

    canvas.width = naturalSize.width;
    canvas.height = finalHeight;
    
    // Calculate radius scale factor
    // The image displayed on screen might be smaller than the actual generated PNG (usually 3x density)
    // We scale the visual radius (px) up to match the resolution of the output image.
    const scale = naturalSize.width / (displaySize.width || 1);
    const scaledRadius = cornerRadius * scale;

    // Create rounded clipping path
    if (typeof ctx.roundRect === 'function') {
         ctx.beginPath();
         ctx.roundRect(0, 0, canvas.width, canvas.height, scaledRadius);
         ctx.clip();
    } else {
        // Fallback for older browsers (though unlikely needed for this stack)
        // Simple rectangular clip if roundRect not supported
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.clip();
    }

    // Draw the image, shifted up by topPx to crop the top
    // Source: (0, topPx) with size (width, finalHeight)
    // Dest: (0, 0) with size (width, finalHeight)
    ctx.drawImage(
      imgRef.current, 
      0, topPx, naturalSize.width, finalHeight, 
      0, 0, canvas.width, finalHeight
    );

    const link = document.createElement('a');
    link.download = `unigram-export-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    onClose();
  };

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
        onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}
    >
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] md:h-auto md:max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
        >
            {/* Preview Area */}
            <div className="flex-1 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-slate-950/50 relative flex items-center justify-center p-4 md:p-8 overflow-hidden select-none min-h-0">
                <div className="relative shadow-2xl transition-all duration-200" style={{
                    // Use CSS clip-path for instant visual feedback of the crop and radius
                    clipPath: `inset(${trimTop}% 0 ${trimBottom}% 0 round ${cornerRadius}px)`
                }}>
                    <img 
                        ref={imgRef}
                        src={imageUrl} 
                        alt="Preview" 
                        onLoad={onImageLoad}
                        // Mobile: max-h-[45vh] to leave room for controls. Desktop: max-h-[75vh].
                        className="max-h-[45vh] md:max-h-[75vh] w-auto max-w-full object-contain"
                        draggable={false}
                    />
                </div>
            </div>

            {/* Controls Area */}
            <div className="w-full md:w-80 bg-slate-800 border-t md:border-t-0 md:border-l border-slate-700 p-6 flex flex-col gap-6 z-10 shrink-0 overflow-y-auto custom-scrollbar max-h-[50vh] md:max-h-none">
                <div className="flex justify-between items-center sticky top-0 bg-slate-800 z-20 pb-2">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <BoxSelect size={20} className="text-purple-400" />
                        Adjust Image
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Trim Top */}
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-300 flex items-center gap-2">
                                <ArrowUpFromLine size={14} /> Trim Top
                            </span>
                            <span className="text-purple-300 font-mono">{trimTop}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="50" 
                            step="1"
                            value={trimTop}
                            onChange={(e) => setTrimTop(Number(e.target.value))}
                            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                    </div>

                    {/* Trim Bottom */}
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-300 flex items-center gap-2">
                                <ArrowDownFromLine size={14} /> Trim Bottom
                            </span>
                            <span className="text-purple-300 font-mono">{trimBottom}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="50" 
                            step="1"
                            value={trimBottom}
                            onChange={(e) => setTrimBottom(Number(e.target.value))}
                            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                    </div>

                    <div className="h-px bg-slate-700 my-2" />

                    {/* Rounded Corners */}
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-300 flex items-center gap-2">
                                <Square size={14} className="rounded-sm" /> Corner Radius
                            </span>
                            <span className="text-purple-300 font-mono">{cornerRadius}px</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="60" 
                            step="1"
                            value={cornerRadius}
                            onChange={(e) => setCornerRadius(Number(e.target.value))}
                            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                    </div>
                </div>

                <div className="mt-auto pt-6 flex flex-col gap-3">
                    <button 
                        onClick={handleSave}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        <Download size={18} /> Download Image
                    </button>
                    <button 
                        onClick={onClose}
                        className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-medium transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </motion.div>
    </motion.div>
  );
};

export default ImagePreviewModal;