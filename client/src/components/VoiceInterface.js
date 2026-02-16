import {useState, useEffect} from 'react';
import {Mic, MicOff, Loader2} from 'lucide-react';
import {motion, AnimatePrecense} from 'framer-motion';
import voiceService from '../services/voice';
import {pikaAPI} from '../services/api';
import {usePikaStore} from '../store';
import toast from 'react-hot-toast';

