'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Upload, CheckCircle, XCircle, Activity } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import FileUpload from '@/components/FileUpload';
import { apiService } from '@/lib/api';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

export default function Home() {
  const [showUpload, setShowUpload] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [clearChatTrigger, setClearChatTrigger] = useState(0);
  const [hasDocument, setHasDocument] = useState(false);

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      await apiService.healthCheck();
      setBackendStatus('online');
  // Check if vector store already has a document
      try {
        const res = await apiService.documentStatus();
        setHasDocument(res.has_document);
      } catch {
        setHasDocument(false);
      }
    } catch (error) {
      setBackendStatus('offline');
      toast.error('Backend server is offline. Please start the Flask server.');
    }
  };

  const handleUploadSuccess = () => {
    toast.success('File uploaded successfully!');
    setShowUpload(false);
    setHasDocument(true);
  };

  const handleClearDocument = async () => {
    try {
      await apiService.clearEmbeddings();
      setHasDocument(false);
      setClearChatTrigger(prev => prev + 1);
      toast.success('Document and chat history cleared.');
    } catch (error: any) {
      toast.error('Failed to clear document.');
    }
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">DocChat</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {hasDocument && (
              <button
                onClick={handleClearDocument}
                className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear Document</span>
              </button>
            )}
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </button>
            
            <div className="flex items-center space-x-2">
              {backendStatus === 'checking' && (
                <>
                  <Activity className="h-4 w-4 text-yellow-500 animate-pulse" />
                  <span className="text-sm text-yellow-600 dark:text-yellow-400">Checking...</span>
                </>
              )}
              {backendStatus === 'online' && (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400">Online</span>
                </>
              )}
              {backendStatus === 'offline' && (
                <>
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600 dark:text-red-400">Offline</span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Upload Panel */}
      {showUpload && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Upload Documents
            </h2>
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <ChatInterface className="flex-1" clearTrigger={clearChatTrigger} />
      </div>
    </div>
  );
}