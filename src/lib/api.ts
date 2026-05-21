import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface QueryResponse {
  answer: string;
  question: string;
  sources: Array<{
    document_id: string;
    content: string;
    metadata: any;
    similarity_score: number;
    distance: number;
    rank: number;
  }>;
  total_sources: number;
}

export interface ChatResponse {
  response: string;
  message: string;
  used_context: boolean;
}

export interface SearchResponse {
  results: Array<{
    document_id: string;
    content: string;
    metadata: any;
    similarity_score: number;
    distance: number;
    rank: number;
  }>;
  query: string;
  total_results: number;
}

export interface UploadResponse {
  message: string;
  filename: string;
  chunks_created: number;
  filepath: string;
}

export const apiService = {
  // Upload file
  uploadFile: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Query documents
  queryDocuments: async (question: string, top_k: number = 3): Promise<QueryResponse> => {
    const response = await api.post('/query', { question, top_k });
    return response.data;
  },

  // Chat
  chat: async (message: string, use_context: boolean = true): Promise<ChatResponse> => {
    const response = await api.post('/chat', { message, use_context });
    return response.data;
  },

  // Search embeddings
  searchEmbeddings: async (query: string, top_k: number = 5, score_threshold: number = 0.0): Promise<SearchResponse> => {
    const response = await api.post('/search', { query, top_k, score_threshold });
    return response.data;
  },

  // Generate embeddings from text
  generateEmbeddings: async (text: string, metadata: any = {}) => {
    const response = await api.post('/generate-embeddings', { text, metadata });
    return response.data;
  },

  // Extract text from file
  extractText: async (filepath: string) => {
    const response = await api.post('/extract', { filepath });
    return response.data;
  },

  // Delete file
  deleteFile: async (filepath: string) => {
    const response = await api.delete('/delete-file', { data: { filepath } });
    return response.data;
  },

  // Clear all embeddings
  clearEmbeddings: async () => {
    const response = await api.delete('/clear-embeddings');
    return response.data;
  },

  // Delete specific document
  deleteDocument: async (document_id: string) => {
    const response = await api.delete('/delete-document', { data: { document_id } });
    return response.data;
  },

  // Complete cleanup
  cleanup: async () => {
    const response = await api.delete('/cleanup');
    return response.data;
  },

  // Check if a document exists in vector store
  documentStatus: async (): Promise<{ has_document: boolean; chunk_count: number }> => {
    const response = await api.get('/document-status');
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/health`);
    return response.data;
  },
};

export default api;