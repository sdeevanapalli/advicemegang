// Car recommendation types
export interface CarRecommendation {
  brand: string
  model: string
  variant: string
  priceRange: {
    min: number
    max: number
  }
  whyRecommended: string
  seniorFriendlyFeatures: string[]
  pros: string[]
  cons: string[]
  keySpecs: {
    engine: string
    fuelEconomy: string
    safetyRating: string
    warranty: string
  }
  availabilityNotes?: string
}

export interface RecommendationResponse {
  recommendations: CarRecommendation[]
  additionalAdvice: string
  nextSteps: string[]
}

// Chat types
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

export interface ChatResponse {
  message: string
  containsRecommendations?: boolean
  timestamp: string
  error?: boolean
}

// Comparison types
export interface CarComparison {
  overallRecommendation: string
  priceComparison: Array<{
    car: string
    startingPrice: number
    onRoadPrice: number
    valueRating: string
  }>
  featureComparison: {
    seniorFriendlyFeatures: Array<{
      feature: string
      cars: Array<{
        car: string
        rating: string
        details: string
      }>
    }>
    safetyFeatures: Array<{
      car: string
      airbags: number
      safetyRating: string
      keyFeatures: string[]
    }>
    comfortFeatures: Array<{
      car: string
      highlights: string[]
      seniorBenefit: string
    }>
  }
  prosAndCons: Array<{
    car: string
    prosForSeniors: string[]
    consForSeniors: string[]
    bestFor: string
  }>
}

export interface ComparisonResponse {
  comparison: CarComparison
  recommendation: {
    winner: string
    reasoning: string
    alternatives: Array<{
      car: string
      whenToChoose: string
    }>
  }
  buyingAdvice: {
    testDriveChecklist: string[]
    negotiationTips: string[]
    financingOptions: string[]
    dealershipNotes: string
  }
}

// Questionnaire types
export interface QuestionOption {
  value: string
  label: string
}

export interface Question {
  id: string
  question: string
  type: 'radio' | 'checkbox' | 'select' | 'text' | 'range'
  options?: QuestionOption[]
  required: boolean
  helpText?: string
  min?: number
  max?: number
}

export interface QuestionnaireResponse {
  questions: Question[]
  progressInfo?: {
    currentStep: number
    totalSteps: number
    completionMessage: string
  }
  analysisInsight?: string
  nextSteps?: string
}

// User preferences types
export interface UserPreferences {
  budget: {
    min: number
    max: number
  }
  bodyType?: string[]
  fuelType?: string[]
  transmission?: string
  features?: string[]
  primaryUse?: string
  drivingExperience?: string
  physicalNeeds?: string[]
  location?: string
}

export interface QuestionAnswer {
  questionId: string
  question: string
  answer: string
  answerType: string
}

// API Error types
export interface APIError {
  error: string
  details?: any
}

// Loading states
export interface LoadingState {
  isLoading: boolean
  message?: string
  progress?: number
}

// AI thinking states
export interface AIThinkingState {
  isThinking: boolean
  stage: 'analyzing' | 'generating' | 'comparing' | 'finalizing'
  message: string
}