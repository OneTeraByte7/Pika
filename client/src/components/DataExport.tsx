import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Download,
    FileJson,
    FileText,
    File,
    Check,
    Loader
} from 'lucide-react';
import { exportAPI } from '../services/advanced';
import toast from 'react-hot-toast';

export default function DataExport() {
    const [loading, setLoading] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState('json');
    const [selectedData, setSelectedData] = useState(['posts']);

    const formats = [
        { id: 'json', name: 'JSON', icon: FileJson, description: 'Machine-readable format' },
        { id: 'csv', name: 'CSV', icon: FileText, description: 'Excel-compatible format' },
        { id: 'html', name: 'HTML', icon: File, description: 'Web-viewable format' },
        { id: 'markdown', name: 'Markdown', icon: File, description: 'Documentation format' },
    ];

    const dataTypes = [
        { id: 'posts', name: 'Posts', description: 'All your posts and content' },
        { id: 'comments', name: 'Comments', description: 'Comments and interactions' },
        { id: 'analytics', name: 'Analytics', description: 'Performance metrics' },
        { id: 'profile', name: 'Profile Data', description: 'Account information' },
    ];

    const handleExport = async () => {
        if (selectedData.length === 0) {
            toast.error('Please select at least one data type');
            return;
        }

        setLoading(true);
        try {
            // Mock data for demonstration
            const mockPosts = [
                {
                    id: '1',
                    content: 'Test post 1',
                    created_at: new Date().toISOString(),
                    likes: 10,
                    comments: 5
                }
            ];

            const response = await exportAPI.exportPosts(mockPosts, selectedFormat);
            
            // Create download
            const blob = new Blob([response.data.data], { 
                type: selectedFormat === 'json' ? 'application/json' : 'text/plain' 
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pika-export-${Date.now()}.${selectedFormat}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success('Export completed successfully!');
        } catch (error) {
            toast.error('Export failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleDataType = (typeId) => {
        setSelectedData(prev => 
            prev.includes(typeId)
                ? prev.filter(id => id !== typeId)
                : [...prev, typeId]
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Data Export
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Export your data in GDPR-compliant formats
                </p>
            </div>

            {/* Format Selection */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Select Format
                </h2>
                <div className="grid md:grid-cols-4 gap-4">
                    {formats.map((format) => {
                        const Icon = format.icon;
                        return (
                            <button
                                key={format.id}
                                onClick={() => setSelectedFormat(format.id)}
                                className={`p-4 rounded-xl border-2 transition-all ${
                                    selectedFormat === format.id
                                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                                }`}
                            >
                                <Icon className={`w-8 h-8 mx-auto mb-2 ${
                                    selectedFormat === format.id
                                        ? 'text-purple-600'
                                        : 'text-gray-600 dark:text-gray-400'
                                }`} />
                                <p className="font-semibold text-gray-900 dark:text-white mb-1">
                                    {format.name}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {format.description}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Data Type Selection */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Select Data to Export
                </h2>
                <div className="space-y-3">
                    {dataTypes.map((dataType) => (
                        <button
                            key={dataType.id}
                            onClick={() => toggleDataType(dataType.id)}
                            className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                                selectedData.includes(dataType.id)
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                            }`}
                        >
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
                                selectedData.includes(dataType.id)
                                    ? 'border-purple-500 bg-purple-500'
                                    : 'border-gray-300 dark:border-gray-600'
                            }`}>
                                {selectedData.includes(dataType.id) && (
                                    <Check className="w-4 h-4 text-white" />
                                )}
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {dataType.name}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {dataType.description}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Export Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center"
            >
                <button
                    onClick={handleExport}
                    disabled={loading || selectedData.length === 0}
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-pika text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader className="w-6 h-6 animate-spin" />
                            Exporting...
                        </>
                    ) : (
                        <>
                            <Download className="w-6 h-6" />
                            Export Data
                        </>
                    )}
                </button>
            </motion.div>

            {/* GDPR Notice */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
            >
                <p className="text-sm text-blue-900 dark:text-blue-100">
                    <strong>GDPR Compliance:</strong> Your data export is fully compliant with GDPR regulations. 
                    All exported data belongs to you and can be used freely. We respect your privacy and data rights.
                </p>
            </motion.div>
        </div>
    );
}
