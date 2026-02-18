import { motion} from 'framer-motion';
import { MessageCircle, ThumbsUp, Send } from 'lucide-react';
import { UsePikaStore } from '../store';

export default function ResponseDisplay()
{
    const { response } = usePikaStore();

    if(!response) return null;

    return (
        <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto px-4 py-6"
    >
      {/* Main Response */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 shadow-lg">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-pika rounded-full flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-2">
              Pika
            </p>
            <p className="text-gray-800 dark:text-white leading-relaxed whitespace-pre-wrap">
              {response.text}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {response.actions && response.actions.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {response.actions.map((action, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {action}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex justify-center space-x-4">
        <button className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-all">
          <ThumbsUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <button className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-all">
          <Send className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </motion.div>
  );
}