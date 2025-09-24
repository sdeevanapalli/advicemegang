import { 
  UserPreferences, 
  QuestionAnswer, 
  RecommendationResponse,
  ChatResponse,
  ChatMessage,
  ComparisonResponse,
  QuestionnaireResponse
} from '@/types/ai'

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Error handling wrapper
async function apiCall<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }))
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error)
    throw error
  }
}

// Car Recommendations Service
export const recommendationsService = {
  async getRecommendations(
    preferences: UserPreferences,
    previousAnswers?: QuestionAnswer[]
  ): Promise<RecommendationResponse> {
    return apiCall<RecommendationResponse>('/api/ai/recommendations', {
      method: 'POST',
      body: JSON.stringify({
        preferences,
        previousAnswers,
      }),
    })
  },
}

// Chat Service
export const chatService = {
  async sendMessage(
    message: string,
    conversationHistory?: ChatMessage[],
    context?: {
      userPreferences?: UserPreferences
      currentCars?: any[]
    }
  ): Promise<ChatResponse> {
    return apiCall<ChatResponse>('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        conversationHistory,
        context,
      }),
    })
  },

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return apiCall('/api/ai/chat', {
      method: 'GET',
    })
  },
}

// Comparison Service
export const comparisonService = {
  async compareCars(
    cars: Array<{ brand: string; model: string; variant?: string }>,
    userContext?: {
      budget?: { min: number; max: number }
      primaryUse?: string
      seniorNeeds?: string[]
      location?: string
    },
    focusAreas?: string[]
  ): Promise<ComparisonResponse> {
    return apiCall<ComparisonResponse>('/api/ai/compare', {
      method: 'POST',
      body: JSON.stringify({
        cars,
        userContext,
        focusAreas,
      }),
    })
  },
}

// Questionnaire Service
export const questionnaireService = {
  async getInitialQuestions(): Promise<QuestionnaireResponse> {
    return apiCall<QuestionnaireResponse>('/api/ai/questionnaire', {
      method: 'POST',
      body: JSON.stringify({
        stage: 'initial',
      }),
    })
  },

  async getFollowupQuestions(
    previousAnswers: QuestionAnswer[],
    currentContext?: {
      budget?: { min: number; max: number }
      preferences?: any
    }
  ): Promise<QuestionnaireResponse> {
    return apiCall<QuestionnaireResponse>('/api/ai/questionnaire', {
      method: 'POST',
      body: JSON.stringify({
        stage: 'followup',
        previousAnswers,
        currentContext,
      }),
    })
  },
}

// Utility functions for client-side processing
export const aiUtils = {
  // Convert questionnaire answers to user preferences
  convertAnswersToPreferences(answers: QuestionAnswer[]): UserPreferences {
    const preferences: Partial<UserPreferences> = {}
    
    answers.forEach(answer => {
      switch (answer.questionId) {
        case 'budget_range':
          const budgetParts = answer.answer.split('-')
          if (budgetParts.length === 2) {
            preferences.budget = {
              min: parseInt(budgetParts[0]) * 100000, // Convert lakhs to rupees
              max: parseInt(budgetParts[1]) * 100000,
            }
          } else if (answer.answer.includes('+')) {
            preferences.budget = {
              min: parseInt(answer.answer.replace('+', '')) * 100000,
              max: 5000000, // 50 lakhs as upper limit
            }
          }
          break
        case 'body_type':
          preferences.bodyType = answer.answer.split(',').map(s => s.trim())
          break
        case 'fuel_type':
          preferences.fuelType = answer.answer.split(',').map(s => s.trim())
          break
        case 'transmission':
          preferences.transmission = answer.answer
          break
        case 'primary_use':
          preferences.primaryUse = answer.answer
          break
        case 'driving_experience':
          preferences.drivingExperience = answer.answer
          break
        case 'physical_needs':
          preferences.physicalNeeds = answer.answer.split(',').map(s => s.trim())
          break
        case 'location':
          preferences.location = answer.answer
          break
        default:
          // Handle custom questions by adding to features array
          if (!preferences.features) preferences.features = []
          preferences.features.push(`${answer.question}: ${answer.answer}`)
      }
    })

    return preferences as UserPreferences
  },

  // Format price in Indian currency
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  },

  // Format price in lakhs/crores
  formatPriceInLakhs(price: number): string {
    if (price >= 10000000) { // 1 crore
      return `₹${(price / 10000000).toFixed(1)} Cr`
    } else {
      return `₹${(price / 100000).toFixed(1)} L`
    }
  },

  // Extract car details from text (for parsing user input)
  extractCarFromText(text: string): { brand?: string; model?: string } | null {
    const carPatterns = [
      // Common Indian car brands and models
      /(?:maruti|suzuki)\s+(\w+)/i,
      /hyundai\s+(\w+)/i,
      /tata\s+(\w+)/i,
      /mahindra\s+(\w+)/i,
      /honda\s+(\w+)/i,
      /toyota\s+(\w+)/i,
    ]

    for (const pattern of carPatterns) {
      const match = text.match(pattern)
      if (match) {
        return {
          brand: match[0].split(' ')[0],
          model: match[1],
        }
      }
    }

    return null
  },

  // Generate loading messages for AI processing
  getLoadingMessage(stage: string): string {
    const messages = {
      analyzing: "AI is analyzing your preferences...",
      generating: "Generating personalized recommendations...",
      comparing: "Comparing vehicles across all brands...",
      finalizing: "Finalizing your perfect car matches...",
      chat: "AI expert is thinking...",
      questionnaire: "Creating personalized questions...",
    }
    return messages[stage as keyof typeof messages] || "Processing your request..."
  },
}