import {useState, useEffect} from 'react';
import {Mic, MicOff, Loader2} from 'lucide-react';
import {motion, AnimatePresence} from 'framer-motion';
import voiceService from '../services/voice';
import {pikaAPI} from '../services/api';
import {usePikaStore} from '../store';
import toast from 'react-hot-toast';

export default function VoiceInterface() {
    const [isProcessing, setIsProcessing] = useState(false);
    const{ isListening, setListening, currentQuery, setCurrentQuery, setResponse} = usePikaStore();
    
    const handleVoiceInput = () => {
        if(isListening) {
            voiceService.stopListening();
            setListening(false);
            return;
        }

        setListening(true);

        voiceService.startListening(
            async(transcript) => {
                setCurrentQuery(transcript);
                setListening(false);
                setIsProcessing(true);

                try{
                  const session_id = `local-${Date.now()}`;
                  const response = await pikaAPI.query({ text: transcript, session_id });
                    setResponse(response.data);

                    if(response.data.audio_url) {
                        await voiceService.playAudio(response.data.audio_url);
                    }
                    else{
                        voiceService.speak(response.data.text);
                    }
                } catch(error) {
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

    return(
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      {/* Voice Button */}
      <motion.button
        onClick={handleVoiceInput}
        disabled={isProcessing}
        className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
          isListening
            ? 'bg-gradient-to-br from-pink-500 to-purple-600 shadow-2xl shadow-purple-500/50'
            : isProcessing
            ? 'bg-gradient-to-br from-gray-400 to-gray-600'
            : 'bg-gradient-pika shadow-xl hover:shadow-2xl'
        }`}
        whileHover={{ scale: isProcessing ? 1 : 1.05 }}
        whileTap={{ scale: isProcessing ? 1 : 0.95 }}
      >
        {/* Pulse Animation */}
        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-full bg-purple-400 opacity-30"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {isProcessing ? (
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        ) : isListening ? (
          <MicOff className="w-12 h-12 text-white" />
        ) : (
          <Mic className="w-12 h-12 text-white" />
        )}
      </motion.button>

      {/* Status Text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isListening ? 'listening' : isProcessing ? 'processing' : 'idle'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-8 text-center"
        >
          <p className="text-xl font-semibold text-gray-800 dark:text-white">
            {isListening ? (
              "I'm listening..."
            ) : isProcessing ? (
              "Thinking..."
            ) : (
              "Tap to talk with Pika"
            )}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {isListening ? (
              "Speak now..."
            ) : isProcessing ? (
              "Processing your request..."
            ) : (
              'Try saying "Hey Pika, what\'s up?"'
            )}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Current Query Display */}
      {currentQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">You said:</p>
          <p className="text-gray-800 dark:text-white font-medium">{currentQuery}</p>
        </motion.div>
      )}
    </div>
  );
}
