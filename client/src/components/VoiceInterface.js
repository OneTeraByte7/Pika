import {useState, useEffect} from 'react';
import {Mic, MicOff, Loader2} from 'lucide-react';
import {motion, AnimatePrecense} from 'framer-motion';
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
                    const response = await pikaAPI.query({text: transcript});
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
                toast.error('Voice error: ${error}');
                setListening(false);
            }
        );
    };

    return
}