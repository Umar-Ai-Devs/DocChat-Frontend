'use client';

import { useState } from 'react';
import { Trash2, Database, FileX, AlertTriangle, RefreshCw } from 'lucide-react';
import { apiService } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ManagementPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
  const [filepath, setFilepath] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [textInput, setTextInput] = useState('');

  const handleClearEmbeddings = async () => {
    setIsLoading(true);
    try {
      await apiService.clearEmbeddings();
      toast.success('All embeddings cleared successfully');
      setShowConfirm(null);
    } catch (error: any) {
      toast.error(`Failed to clear embeddings: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCleanup = async () => {
    setIsLoading(true);
    try {
      const result = await apiService.cleanup();
      toast.success(`Cleanup completed: ${result.total_files_deleted} files deleted`);
      setShowConfirm(null);
    } catch (error: any) {
      toast.error(`Cleanup failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFile = async () => {
    if (!filepath.trim()) {
      toast.error('Please enter a file path');
      return;
    }

    setIsLoading(true);
    try {
      await apiService.deleteFile(filepath);
      toast.success('File deleted successfully');
      setFilepath('');
    } catch (error: any) {
      toast.error(`Failed to delete file: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDocument = async () => {
    if (!documentId.trim()) {
      toast.error('Please enter a document ID');
      return;
    }

    setIsLoading(true);
    try {
      await apiService.deleteDocument(documentId);
      toast.success('Document deleted successfully');
      setDocumentId('');
    } catch (error: any) {
      toast.error(`Failed to delete document: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateEmbeddings = async () => {
    if (!textInput.trim()) {
      toast.error('Please enter some text');
      return;
    }

    setIsLoading(true);
    try {
      const result = await apiService.generateEmbeddings(textInput);
      toast.success(`Embeddings generated: ${result.chunks_created} chunks created`);
      setTextInput('');
    } catch (error: any) {
      toast.error(`Failed to generate embeddings: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const ConfirmDialog = ({ action, onConfirm, onCancel }: { action: string; onConfirm: () => void; onCancel: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Confirm Action</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to {action}? This action cannot be undone.
        </p>
        <div className="flex space-x-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Document Management</h2>

      {/* Generate Embeddings */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Generate Embeddings from Text
        </h3>
        <div className="space-y-4">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter text to generate embeddings..."
            className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleGenerateEmbeddings}
            disabled={isLoading || !textInput.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Generating...' : 'Generate Embeddings'}
          </button>
        </div>
      </div>

      {/* Delete File */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <FileX className="h-5 w-5 mr-2" />
          Delete File
        </h3>
        <div className="space-y-4">
          <input
            type="text"
            value={filepath}
            onChange={(e) => setFilepath(e.target.value)}
            placeholder="Enter file path to delete..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleDeleteFile}
            disabled={isLoading || !filepath.trim()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Deleting...' : 'Delete File'}
          </button>
        </div>
      </div>

      {/* Delete Document */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <Trash2 className="h-5 w-5 mr-2" />
          Delete Document by ID
        </h3>
        <div className="space-y-4">
          <input
            type="text"
            value={documentId}
            onChange={(e) => setDocumentId(e.target.value)}
            placeholder="Enter document ID to delete..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleDeleteDocument}
            disabled={isLoading || !documentId.trim()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Deleting...' : 'Delete Document'}
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Danger Zone
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-700">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Clear All Embeddings</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Remove all embeddings from the vector database</p>
            </div>
            <button
              onClick={() => setShowConfirm('clear-embeddings')}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Clear Embeddings
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-700">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Complete Cleanup</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Remove all files and embeddings</p>
            </div>
            <button
              onClick={() => setShowConfirm('cleanup')}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Complete Cleanup
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      {showConfirm === 'clear-embeddings' && (
        <ConfirmDialog
          action="clear all embeddings"
          onConfirm={handleClearEmbeddings}
          onCancel={() => setShowConfirm(null)}
        />
      )}

      {showConfirm === 'cleanup' && (
        <ConfirmDialog
          action="perform complete cleanup"
          onConfirm={handleCleanup}
          onCancel={() => setShowConfirm(null)}
        />
      )}
    </div>
  );
}