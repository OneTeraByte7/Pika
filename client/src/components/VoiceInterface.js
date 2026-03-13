import { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import voiceService from '../services/voice';
import { pikaAPI } from '../services/api';
import { usePikaStore } from '../store';
import toast from 'react-hot-toast';

export default function VoiceInterface() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { isListening, setListening, currentQuery, setCurrentQuery, setResponse } = usePikaStore();

  const handleVoiceInput = () => {
    if (isListening) {
      voiceService.stopListening();
      setListening(false);
      return;
    }

    setListening(true);

    voiceService.startListening(
      async (transcript) => {
        setCurrentQuery(transcript);
        setListening(false);
        setIsProcessing(true);

        try {
          const session_id = `local-${Date.now()}`;
          const response = await pikaAPI.query({ text: transcript, session_id });
          setResponse(response.data);

          if (response.data.audio_url) {
            await voiceService.playAudio(response.data.audio_url);
          }
          else {
            voiceService.speak(response.data.text);
          }
        } catch (error) {
          toast.error('Failed to process query');
          console.error(error);
        } finally {
          setIsProcessing(false);
        }
      },

      (error) => {
        toast.error(`Voice error: ${error}`);
        setListening(false);
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6">
      <div className="relative">
        {/* Glow Rings */}
        {isListening && [1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-electric-blue/30"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}

        {/* Voice Button */}
        <motion.button
          onClick={handleVoiceInput}
          disabled={isProcessing}
          className={`relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-700 ${isListening
              ? 'bg-electric-blue shadow-neon-blue border-transparent scale-110'
              : isProcessing
                ? 'bg-white/5 border border-white/10'
                : 'bg-pitch-black border-2 border-white/10 hover:border-electric-blue group shadow-[0_0_20px_rgba(255,255,255,0.02)]'
            }`}
          whileHover={{ scale: isProcessing ? 1 : 1.05 }}
          whileTap={{ scale: isProcessing ? 1 : 0.95 }}
        >
          <div className="relative z-10">
            {isProcessing ? (
              <Loader2 className="w-16 h-16 text-white animate-spin" />
            ) : isListening ? (
              <MicOff className="w-16 h-16 text-black" />
            ) : (
              <Mic className="w-16 h-16 text-white group-hover:text-electric-blue group-hover:scale-110 transition-all" />
            )}
          </div>

          {/* Inner Glow for listening state */}
          {isListening && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-2 rounded-full border-2 border-white/30"
            />
          )}
        </motion.button>
      </div>

      {/* Status Text */}
      <div className="mt-16 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={isListening ? 'listening' : isProcessing ? 'processing' : 'idle'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white">
              {isListening ? (
                "Void Listening."
              ) : isProcessing ? (
                "Scanning Flow..."
              ) : (
                "Awaken Pika."
              )}
            </h2>
            <p className="text-xs font-black uppercase tracking-[0.4em] text-white/30">
              {isListening ? (
                "Speak clearly into the ether"
              ) : isProcessing ? (
                "Deciphering your intent"
              ) : (
                'Command: "Post a sunset selfie"'
              )}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Current Query Display */}
      {currentQuery && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-16 group"
        >
          <div className="glass-card hover:border-white/20 transition-all p-8 flex items-center space-x-6">
            <div className="w-2 h-12 bg-electric-blue rounded-full" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Decrypted Intel</p>
              <p className="text-xl font-bold text-white italic">"{currentQuery}"</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
