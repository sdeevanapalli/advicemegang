import { useState, useCallback, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  recommendationsService,
  chatService,
  comparisonService,
  questionnaireService,
  aiUtils
} from '@/services/ai'
import {
  UserPreferences,
  QuestionAnswer,
  RecommendationResponse,
  ChatMessage,
  ChatResponse,
  ComparisonResponse,
  QuestionnaireResponse,
  AIThinkingState
} from '@/types/ai'

// Hook for car recommendations
export function useCarRecommendations() {
  const [isGenerating, setIsGenerating] = useState(false)
  
  const getRecommendations = useMutation({
    mutationFn: async ({ 
      preferences, 
      previousAnswers 
    }: { 
      preferences: UserPreferences
      previousAnswers?: QuestionAnswer[] 
    }) => {
      setIsGenerating(true)
      try {
        return await recommendationsService.getRecommendations(preferences, previousAnswers)
      } finally {
        setIsGenerating(false)
      }
    },
    onError: (error) => {
      console.error('Recommendation error:', error)
    },
  })

  return {
    getRecommendations: getRecommendations.mutate,
    recommendations: getRecommendations.data,
    isLoading: getRecommendations.isPending || isGenerating,
    error: getRecommendations.error,
    isSuccess: getRecommendations.isSuccess,
  }
}

// Hook for AI chat functionality
export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const queryClient = useQueryClient()

  const sendMessage = useMutation({
    mutationFn: async ({ 
      message, 
      context 
    }: { 
      message: string
      context?: {
        userPreferences?: UserPreferences
        currentCars?: any[]
      }
    }) => {
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
        
        return response
      } finally {
        setIsTyping(false)
      }
    },
    onError: (error) => {
      setIsTyping(false)
      // Add error message
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I apologize, but I'm having trouble responding right now. Please try again.",
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMessage])
    },
  })

  const clearChat = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    sendMessage: sendMessage.mutate,
    isTyping: isTyping || sendMessage.isPending,
    clearChat,
    error: sendMessage.error,
  }
}

// Hook for car comparisons
export function useCarComparison() {
  const [isComparing, setIsComparing] = useState(false)

  const compareCars = useMutation({
    mutationFn: async ({ 
      cars, 
      userContext, 
      focusAreas 
    }: { 
      cars: Array<{ brand: string; model: string; variant?: string }>
      userContext?: {
        budget?: { min: number; max: number }
        primaryUse?: string
        seniorNeeds?: string[]
        location?: string
      }
      focusAreas?: string[]
    }) => {
      setIsComparing(true)
      try {
        return await comparisonService.compareCars(cars, userContext, focusAreas)
      } finally {
        setIsComparing(false)
      }
    },
  })

  return {
    compareCars: compareCars.mutate,
    comparison: compareCars.data,
    isLoading: compareCars.isPending || isComparing,
    error: compareCars.error,
    isSuccess: compareCars.isSuccess,
  }
}

// Hook for dynamic questionnaire
export function useQuestionnaire() {
  const [answers, setAnswers] = useState<QuestionAnswer[]>([])
  const [currentQuestions, setCurrentQuestions] = useState<QuestionnaireResponse | null>(null)
  
  // Get initial questions
  const initialQuestions = useQuery({
    queryKey: ['questionnaire', 'initial'],
    queryFn: questionnaireService.getInitialQuestions,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  // Get follow-up questions
  const getFollowupQuestions = useMutation({
    mutationFn: async (context?: { budget?: { min: number; max: number }; preferences?: any }) => {
      return await questionnaireService.getFollowupQuestions(answers, context)
    },
    onSuccess: (data) => {
      setCurrentQuestions(data)
    },
  })

  const addAnswer = useCallback((answer: QuestionAnswer) => {
    setAnswers(prev => [...prev.filter(a => a.questionId !== answer.questionId), answer])
  }, [])

  const removeAnswer = useCallback((questionId: string) => {
    setAnswers(prev => prev.filter(a => a.questionId !== questionId))
  }, [])

  const getUserPreferences = useCallback((): UserPreferences | null => {
    if (answers.length === 0) return null
    return aiUtils.convertAnswersToPreferences(answers)
  }, [answers])

  const resetQuestionnaire = useCallback(() => {
    setAnswers([])
    setCurrentQuestions(null)
  }, [])

  return {
    // Questions data
    initialQuestions: initialQuestions.data,
    currentQuestions,
    
    // Loading states
    isLoadingInitial: initialQuestions.isLoading,
    isLoadingFollowup: getFollowupQuestions.isPending,
    
    // User interactions
    answers,
    addAnswer,
    removeAnswer,
    getFollowupQuestions: getFollowupQuestions.mutate,
    
    // Utilities
    getUserPreferences,
    resetQuestionnaire,
    
    // Errors
    error: initialQuestions.error || getFollowupQuestions.error,
  }
}

// Hook for AI thinking states (for better UX)
export function useAIThinking() {
  const [thinkingState, setThinkingState] = useState<AIThinkingState>({
    isThinking: false,
    stage: 'analyzing',
    message: '',
  })

  const startThinking = useCallback((stage: AIThinkingState['stage']) => {
    setThinkingState({
      isThinking: true,
      stage,
      message: aiUtils.getLoadingMessage(stage),
    })
  }, [])

  const updateThinking = useCallback((stage: AIThinkingState['stage'], message?: string) => {
    setThinkingState(prev => ({
      ...prev,
      stage,
      message: message || aiUtils.getLoadingMessage(stage),
    }))
  }, [])

  const stopThinking = useCallback(() => {
    setThinkingState({
      isThinking: false,
      stage: 'analyzing',
      message: '',
    })
  }, [])

  return {
    thinkingState,
    startThinking,
    updateThinking,
    stopThinking,
    isThinking: thinkingState.isThinking,
  }
}

// Hook for managing user session and preferences
export function useUserSession() {
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null)
  const [sessionData, setSessionData] = useState({
    completedQuestionnaire: false,
    viewedRecommendations: false,
    comparedCars: false,
    chatHistory: [] as ChatMessage[],
  })

  const updatePreferences = useCallback((preferences: UserPreferences) => {
    setUserPreferences(preferences)
  }, [])

  const updateSessionData = useCallback((updates: Partial<typeof sessionData>) => {
    setSessionData(prev => ({ ...prev, ...updates }))
  }, [])

  const resetSession = useCallback(() => {
    setUserPreferences(null)
    setSessionData({
      completedQuestionnaire: false,
      viewedRecommendations: false,
      comparedCars: false,
      chatHistory: [],
    })
  }, [])

  return {
    userPreferences,
    sessionData,
    updatePreferences,
    updateSessionData,
    resetSession,
  }
}