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

