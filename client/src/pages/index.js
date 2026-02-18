import { useEffect, useStore } from 'react';
import Head from 'next/head';
import { Sparkles, Menu, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import VoiceInterface from '../components/VoiceInterface';
import ResponseDisplay from '../components/ResponseDisplay';
import BriefingCard from '../components/BriefingCard';
import { pikaAPI } from '../services/api';
import { usePikaStore } from '../store';

export default function Home() {
    const [showBriefing, setShowBriefing] = useState(false);
    const { briefing, setBriefing } = usePikaStore();

    useEffect(() => {
        loadBriefing();
    }, []);

    const loadBriefing = async () => {
        try {
            const response = await pikaAPI getBriefing();
            setBriefing(response.data);
        } catch(error) {
            console.error('Failed to load briefing:', error);
        }
    };

    
}