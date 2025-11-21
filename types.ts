export enum ImageSize {
  Size512 = '512',
  Size1K = '1K',
  Size2K = '2K'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  size: ImageSize;
}

export interface GenerationState {
  status: 'idle' | 'searching' | 'refining' | 'generating' | 'complete' | 'error';
  message?: string;
  error?: string;
}