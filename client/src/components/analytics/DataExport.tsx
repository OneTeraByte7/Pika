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
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Data Export
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Export your data in GDPR-compliant formats
                </p>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Select Format</h2>
                <div className="grid md:grid-cols-4 gap-4">
                    {formats.map((format) => {
                        const Icon = format.icon;
                        return (
                            <button key={format.id} onClick={() => setSelectedFormat(format.id)} className={`p-4 rounded-xl border-2 ${selectedFormat === format.id ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}>
                                <Icon className="w-8 h-8 mx-auto mb-2" />
                                <p className="font-semibold">{format.name}</p>
                                <p className="text-xs text-gray-500">{format.description}</p>
                            </button>
                        );
                    })}
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Select Data to Export</h2>
                <div className="space-y-3">
                    {dataTypes.map((dataType) => (
                        <button key={dataType.id} onClick={() => toggleDataType(dataType.id)} className={`w-full p-4 rounded-xl border-2 ${selectedData.includes(dataType.id) ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-6 h-6 rounded-lg ${selectedData.includes(dataType.id) ? 'bg-purple-500' : 'bg-gray-200'}`} />
                                <div className="flex-1 text-left">
                                    <p className="font-semibold">{dataType.name}</p>
                                    <p className="text-sm text-gray-500">{dataType.description}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
                <button onClick={handleExport} disabled={loading || selectedData.length === 0} className="px-8 py-4 bg-gradient-pika text-white rounded-2xl">
                    {loading ? 'Exporting...' : 'Export Data'}
                </button>
            </motion.div>
        </div>
    );
}
