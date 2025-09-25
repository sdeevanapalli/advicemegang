// Chat types
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

export interface ChatResponse {
  message: string
  timestamp: string
  error?: boolean
}

// Loading states
export interface LoadingState {
  isLoading: boolean
  message?: string
}