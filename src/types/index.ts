export interface Document {
  document_id: string;
  content: string;
  metadata: {
    source?: string;
    filename?: string;
    file_type?: string;
    [key: string]: any;
  };
  similarity_score: number;
  distance: number;
  rank: number;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Document[];
}

export interface UploadedFile {
  filename: string;
  filepath: string;
  chunks_created: number;
  upload_time: Date;
}