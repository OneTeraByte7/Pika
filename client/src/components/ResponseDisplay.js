import { motion} from 'framer-motion';
import { MessageCircle, ThumbsUp, Send } from 'lucide-react';
import { UsePikaStore } from '../store';

export default function ResponseDisplay()
{
    const { response } = usePikaStore();

    if(!response) return null;

    return (
        
    )
}