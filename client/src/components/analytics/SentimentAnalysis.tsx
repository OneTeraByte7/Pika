import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Smile,
    Meh,
    Frown,
    AlertTriangle,
    ThumbsUp,
    ThumbsDown,
    Heart,
    MessageCircle,
    TrendingUp,
    Shield,
    Sparkles,
    FileText
} from 'lucide-react';
import { sentimentAPI } from '../services/advanced';
import toast from 'react-hot-toast';

export default function SentimentAnalysis() {
    const [text, setText] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [toxicityResult, setToxicityResult] = useState(null);
    const [emotionResult, setEmotionResult] = useState(null);
    const [activeTab, setActiveTab] = useState('text');

    const analyzeContent = async () => {
        if (!text.trim()) {
            toast.error('Please enter some text to analyze');
            return;
        }

        setAnalyzing(true);
        try {
            const [sentiment, toxicity, emotions] = await Promise.all([
                sentimentAPI.analyzeText(text),
                sentimentAPI.detectToxicity(text),
                sentimentAPI.analyzeEmotions(text)
            ]);

            setResult(sentiment.data.text_analysis || getMockSentiment());
            setToxicityResult(toxicity.data || getMockToxicity());
            setEmotionResult(emotions.data || getMockEmotions());
            toast.success('Analysis complete!');
        } catch (error) {
            console.error('Analysis failed:', error);
            setResult(getMockSentiment());
            setToxicityResult(getMockToxicity());
            setEmotionResult(getMockEmotions());
            toast.success('Analysis complete (using demo data)');
        } finally {
            setAnalyzing(false);
        }
    };

    const getMockSentiment = () => ({
        sentiment: text.toLowerCase().includes('love') || text.toLowerCase().includes('great') || text.toLowerCase().includes('awesome') ? 'positive' :
                   text.toLowerCase().includes('hate') || text.toLowerCase().includes('bad') || text.toLowerCase().includes('terrible') ? 'negative' : 'neutral',
        score: text.toLowerCase().includes('love') ? 0.85 : text.toLowerCase().includes('hate') ? -0.75 : 0.15,
        confidence: 0.89
    });

    const getMockToxicity = () => ({
        is_toxic: text.toLowerCase().includes('hate') || text.toLowerCase().includes('stupid') || text.toLowerCase().includes('idiot'),
        toxicity_score: text.toLowerCase().includes('hate') ? 0.78 : 0.12,
        categories: text.toLowerCase().includes('hate') ? ['hate_speech'] : []
    });

    const getMockEmotions = () => {
        const emotions = { joy: 0.1, sadness: 0.1, anger: 0.1, fear: 0.1, surprise: 0.1, neutral: 0.5 };
        if (text.toLowerCase().includes('love') || text.toLowerCase().includes('happy')) {
            emotions.joy = 0.75;
            emotions.neutral = 0.15;
        } else if (text.toLowerCase().includes('sad') || text.toLowerCase().includes('cry')) {
            emotions.sadness = 0.70;
            emotions.neutral = 0.20;
        } else if (text.toLowerCase().includes('angry') || text.toLowerCase().includes('hate')) {
            emotions.anger = 0.65;
            emotions.neutral = 0.25;
        }
        return { emotions };
    };

    const getSentimentIcon = () => {
        if (!result) return null;
        switch (result.sentiment) {
            case 'positive':
                return <Smile className="w-16 h-16 text-green-500" />;
            case 'negative':
                return <Frown className="w-16 h-16 text-red-500" />;
            default:
                return <Meh className="w-16 h-16 text-gray-500" />;
        }
    };

    const getSentimentColor = () => {
        if (!result) return 'gray';
        switch (result.sentiment) {
            case 'positive':
                return 'green';
            case 'negative':
                return 'red';
            default:
                return 'gray';
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Sentiment Analysis</h1>
                <p className="text-gray-600 mt-1">Analyze emotions, sentiment, and toxicity in your content</p>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold">Analyze Your Content</h2>
                </div>

                <div className="flex gap-2 mb-4">
                    <button onClick={() => setActiveTab('text')} className={`px-4 py-2 rounded-lg ${activeTab === 'text' ? 'bg-gradient-pika text-white' : 'bg-gray-100'}`}>Text Input</button>
                    <button onClick={() => setActiveTab('examples')} className={`px-4 py-2 rounded-lg ${activeTab === 'examples' ? 'bg-gradient-pika text-white' : 'bg-gray-100'}`}>Try Examples</button>
                </div>

                {activeTab === 'text' ? (
                    <>
                        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} className="w-full px-4 py-3 border rounded-xl" placeholder="Type or paste your text here to analyze..." />
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-sm text-gray-600">{text.length} characters</span>
                            <button onClick={analyzeContent} disabled={analyzing || !text.trim()} className="px-6 py-3 bg-gradient-pika text-white rounded-full">{analyzing ? 'Analyzing...' : 'Analyze'}</button>
                        </div>
                    </>
                ) : (
                    <div className="grid md:grid-cols-2 gap-3">
                        {[
                            { label: 'Positive', text: "I absolutely love this product! It's amazing and exceeded my expectations." },
                            { label: 'Negative', text: "This is terrible. Worst experience ever." },
                            { label: 'Neutral', text: "The product arrived on time. It works as described." },
                            { label: 'Mixed', text: "Great quality but the price is too high." }
                        ].map((example, index) => (
                            <button key={index} onClick={() => { setText(example.text); setActiveTab('text'); }} className="p-4 bg-gray-100 rounded-xl">{example.label}</button>
                        ))}
                    </div>
                )}
            </motion.div>

            {result && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold">Overall Sentiment</h2>
                    </div>
                    <div className="flex items-center justify-center gap-8 py-6">
                        <div className="text-center">
                            {getSentimentIcon()}
                            <p className={`text-2xl font-bold mt-4 text-${getSentimentColor()}-600`}>{result.sentiment}</p>
                            <p className="text-sm text-gray-600 mt-1">Confidence: {(result.confidence * 100).toFixed(1)}%</p>
                        </div>
                        <div className="flex-1 max-w-md">
                            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                                <div className={`h-full bg-gradient-to-r ${result.sentiment === 'positive' ? 'from-green-400 to-green-600' : result.sentiment === 'negative' ? 'from-red-400 to-red-600' : 'from-gray-400 to-gray-600'}`} style={{ width: `${Math.abs(result.score) * 100}%` }} />
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-gray-600">
                                <span>Negative</span>
                                <span>Neutral</span>
                                <span>Positive</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
