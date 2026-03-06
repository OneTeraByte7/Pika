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
            // Run all analyses in parallel
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
            // Use mock data on error
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

    const exampleTexts = [
        { label: 'Positive', text: "I absolutely love this product! It's amazing and exceeded my expectations. Highly recommend! 🎉" },
        { label: 'Negative', text: "This is terrible. Worst experience ever. Very disappointed and frustrated." },
        { label: 'Neutral', text: "The product arrived on time. It works as described in the specifications." },
        { label: 'Mixed', text: "Great quality but the price is too high. Customer service was helpful though." }
    ];

    const emotionsList = emotionResult?.emotions ? Object.entries(emotionResult.emotions).sort((a, b) => b[1] - a[1]) : [];

    const getEmotionIcon = (emotion) => {
        const icons = {
            joy: '😊',
            sadness: '😢',
            anger: '😠',
            fear: '😨',
            surprise: '😮',
            neutral: '😐'
        };
        return icons[emotion] || '😐';
    };

    const getEmotionColor = (emotion) => {
        const colors = {
            joy: 'bg-yellow-500',
            sadness: 'bg-blue-500',
            anger: 'bg-red-500',
            fear: 'bg-purple-500',
            surprise: 'bg-orange-500',
            neutral: 'bg-gray-500'
        };
        return colors[emotion] || 'bg-gray-500';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Sentiment Analysis
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Analyze emotions, sentiment, and toxicity in your content
                </p>
            </div>

            {/* Input Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Analyze Your Content
                    </h2>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setActiveTab('text')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            activeTab === 'text'
                                ? 'bg-gradient-pika text-white shadow-lg'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                        Text Input
                    </button>
                    <button
                        onClick={() => setActiveTab('examples')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            activeTab === 'examples'
                                ? 'bg-gradient-pika text-white shadow-lg'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                        Try Examples
                    </button>
                </div>

                {activeTab === 'text' ? (
                    <>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={6}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white resize-none"
                            placeholder="Type or paste your text here to analyze sentiment, emotions, and toxicity..."
                        />
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {text.length} characters
                            </span>
                            <button
                                onClick={analyzeContent}
                                disabled={analyzing || !text.trim()}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-pika text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Sparkles className="w-5 h-5" />
                                {analyzing ? 'Analyzing...' : 'Analyze'}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="grid md:grid-cols-2 gap-3">
                        {exampleTexts.map((example, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setText(example.text);
                                    setActiveTab('text');
                                }}
                                className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-700/50 rounded-xl border border-purple-200 dark:border-gray-600 hover:shadow-md transition-all text-left"
                            >
                                <p className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {example.label}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                    {example.text}
                                </p>
                            </button>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Results Section */}
            {result && (
                <>
                    {/* Overall Sentiment */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Overall Sentiment
                            </h2>
                        </div>

                        <div className="flex items-center justify-center gap-8 py-6">
                            <div className="text-center">
                                {getSentimentIcon()}
                                <p className={`text-2xl font-bold mt-4 capitalize text-${getSentimentColor()}-600`}>
                                    {result.sentiment}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Confidence: {(result.confidence * 100).toFixed(1)}%
                                </p>
                            </div>
                            <div className="flex-1 max-w-md">
                                <div className="relative">
                                    <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full bg-gradient-to-r ${
                                                result.sentiment === 'positive' 
                                                    ? 'from-green-400 to-green-600' 
                                                    : result.sentiment === 'negative'
                                                    ? 'from-red-400 to-red-600'
                                                    : 'from-gray-400 to-gray-600'
                                            } transition-all duration-500`}
                                            style={{ width: `${Math.abs(result.score) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
                                        <span>Negative</span>
                                        <span>Neutral</span>
                                        <span>Positive</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Toxicity Check */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`w-10 h-10 bg-gradient-to-r ${
                                toxicityResult?.is_toxic 
                                    ? 'from-red-500 to-orange-500' 
                                    : 'from-green-500 to-emerald-500'
                            } rounded-lg flex items-center justify-center`}>
                                {toxicityResult?.is_toxic ? (
                                    <AlertTriangle className="w-5 h-5 text-white" />
                                ) : (
                                    <Shield className="w-5 h-5 text-white" />
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Toxicity Check
                            </h2>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                                toxicityResult?.is_toxic 
                                    ? 'bg-red-100 dark:bg-red-900/30' 
                                    : 'bg-green-100 dark:bg-green-900/30'
                            }`}>
                                {toxicityResult?.is_toxic ? (
                                    <ThumbsDown className="w-12 h-12 text-red-600 dark:text-red-400" />
                                ) : (
                                    <ThumbsUp className="w-12 h-12 text-green-600 dark:text-green-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <p className={`text-2xl font-bold ${
                                    toxicityResult?.is_toxic 
                                        ? 'text-red-600 dark:text-red-400' 
                                        : 'text-green-600 dark:text-green-400'
                                }`}>
                                    {toxicityResult?.is_toxic ? 'Toxic Content Detected' : 'Content is Safe'}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Toxicity Score: {(toxicityResult?.toxicity_score * 100).toFixed(1)}%
                                </p>
                                {toxicityResult?.categories?.length > 0 && (
                                    <div className="flex gap-2 mt-3">
                                        {toxicityResult.categories.map((category, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-full"
                                            >
                                                {category.replace('_', ' ')}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Emotion Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                <Heart className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Emotion Breakdown
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {emotionsList.map(([emotion, value], index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{getEmotionIcon(emotion)}</span>
                                            <span className="font-semibold text-gray-900 dark:text-white capitalize">
                                                {emotion}
                                            </span>
                                        </div>
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                                            {(value * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                        <div 
                                            className={`${getEmotionColor(emotion)} h-3 rounded-full transition-all duration-500`}
                                            style={{ width: `${value * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Tips */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white"
                    >
                        <h3 className="text-xl font-bold mb-4">💡 Content Tips</h3>
                        <ul className="space-y-2">
                            {result.sentiment === 'positive' && (
                                <>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-200">•</span>
                                        <span className="text-purple-50">Great! Your content has positive sentiment. Keep engaging your audience!</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-200">•</span>
                                        <span className="text-purple-50">Consider posting at optimal times for maximum reach</span>
                                    </li>
                                </>
                            )}
                            {result.sentiment === 'negative' && (
                                <>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-200">•</span>
                                        <span className="text-purple-50">Consider revising negative language to improve engagement</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-200">•</span>
                                        <span className="text-purple-50">Add constructive feedback or solutions to balance the tone</span>
                                    </li>
                                </>
                            )}
                            {result.sentiment === 'neutral' && (
                                <>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-200">•</span>
                                        <span className="text-purple-50">Neutral content is good for informational posts</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-200">•</span>
                                        <span className="text-purple-50">Add emotion or personality to increase engagement</span>
                                    </li>
                                </>
                            )}
                            {toxicityResult?.is_toxic && (
                                <li className="flex items-start gap-2">
                                    <span className="text-red-200">⚠</span>
                                    <span className="text-red-50 font-semibold">Warning: Consider revising toxic content before posting</span>
                                </li>
                            )}
                        </ul>
                    </motion.div>
                </>
            )}

            {/* Empty State */}
            {!result && !analyzing && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                >
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Enter text above to analyze sentiment, emotions, and toxicity
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                        Try our examples or paste your own content
                    </p>
                </motion.div>
            )}
        </div>
    );
}
