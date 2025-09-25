import { useState, useCallback } from 'react'
import { chatService } from '@/services/ai'
import { ChatMessage } from '@/types/ai'

// Simple hook for AI chat functionality
export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async ({ 
    message, 
    context 
  }: { 
    message: string
    context?: any
  }) => {
    setError(null)
    
    // Add user message immediately
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    try {
      const response = await chatService.sendMessage(message, messages, context)
      
      // Add AI response
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: response.timestamp,
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (err) {
      setError('Failed to send message')
      // Add error message
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I apologize, but I'm having trouble responding right now. Please try again.",
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }, [messages])

  const clearChat = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return {
    messages,
    sendMessage,
    isTyping,
    clearChat,
    error,
  }
}