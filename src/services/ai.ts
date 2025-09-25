import { 
  ChatResponse,
  ChatMessage,
} from '@/types/ai'
import openai, { safeOpenAICall } from '@/lib/openai'
import { carDataService, CarSearchFilters } from './carData'

// AI Chat service using OpenAI API
export const chatService = {
  async sendMessage(
    message: string,
    conversationHistory?: ChatMessage[],
    context?: any
  ): Promise<ChatResponse> {
    try {
      // Extract car-related information from user message
      const carData = await this.getRelevantCarData(message)
      
      // Prepare the conversation context with real-time car data
      const systemPrompt = `You are an AI car buying assistant with access to CURRENT 2024-2025 Indian car market data. 

CRITICAL: You must ONLY use the real-time car data provided below, NOT your training data which may be outdated. Ignore any previous knowledge about car models, prices, or specifications that conflicts with the current data provided.

Your role:
- Provide advice based EXCLUSIVELY on the current market data provided
- If a car model is mentioned but not in the provided data, clearly state it's not currently available or you don't have current information
- Never reference older generations or discontinued models when current ones are available
- Use ONLY the prices, specifications, and features from the provided current data

Response guidelines:
- MANDATORY: Use only the real-time car data provided in each conversation
- Always mention CURRENT prices from the data (format: ₹X.X L)
- Include exact specifications from the provided data (mileage, engine, features)
- If asked about a specific model, use ONLY the current data for that model
- If current data shows 2024 models, recommend those, not older generations
- Base ALL recommendations on the actual current data provided
- Keep responses conversational and helpful
- Don't mention being an AI assistant

CRITICAL RULE: Your training knowledge is outdated. Trust ONLY the current car data provided in each message.`

      // Build conversation messages for OpenAI
      const messages: any[] = [
        { role: 'system', content: systemPrompt }
      ]

      // Add conversation history
      if (conversationHistory && conversationHistory.length > 0) {
        // Limit history to last 10 messages to avoid token limits
        const recentHistory = conversationHistory.slice(-10)
        recentHistory.forEach(msg => {
          messages.push({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          })
        })
      }

      // Add car data context if available
      if (carData && carData.length > 0) {
        const carDataPrompt = `🚨 CURRENT MARKET DATA (2024-2025 Models ONLY) - USE THIS DATA EXCLUSIVELY:

${carData.map(car => 
  `${car.brand} ${car.model} (${car.year} MODEL):
   Price: ₹${(car.price.min/100000).toFixed(1)}L - ₹${(car.price.max/100000).toFixed(1)}L
   Specs: ${car.mileage} km/l, ${car.engineCapacity}cc, ${car.seatingCapacity}-seater
   Type: ${car.bodyType}, Fuel: ${car.fuelType.join('/')}, Transmission: ${car.transmission.join('/')}
   Safety: ${car.safetyRating || 'N/A'} stars, Status: ${car.availability}
   Key Features: ${car.features.slice(0, 4).join(', ')}
   Last Updated: ${new Date(car.lastUpdated).toLocaleDateString()}
`
).join('\n')}

🚨 MANDATORY: Use ONLY this data. Do NOT reference older models or outdated information from your training. If a user asks about a model not listed above, tell them you don't have current data for that specific model.`

        messages.push({ role: 'system', content: carDataPrompt })
      }

      // Add current user message
      messages.push({ role: 'user', content: message })

      // Call OpenAI API
      const response = await safeOpenAICall(async () => {
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 500,
          temperature: 0.7,
          stream: false,
        })

        return completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.'
      })

      if (!response) {
        throw new Error('Failed to get response from OpenAI')
      }

      return {
        message: response,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error('AI Service Error:', error)
      
      // Fallback response
      return {
        message: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment. In the meantime, I'd generally recommend considering factors like safety ratings, fuel efficiency, maintenance costs, and whether the car suits Indian road conditions when choosing a vehicle.",
        timestamp: new Date().toISOString(),
        error: true
      }
    }
  },

  // Extract car-related information from user message and fetch relevant data
  async getRelevantCarData(message: string): Promise<any[]> {
    try {
      const lowerMessage = message.toLowerCase()
      
      // Extract budget from message
      const budgetMatch = lowerMessage.match(/(\d+)\s*(?:lakh?s?|l)/i)
      let budget: { min: number; max: number } | undefined
      
      if (budgetMatch) {
        const amount = parseInt(budgetMatch[1])
        budget = {
          min: (amount - 2) * 100000, // 2L below
          max: (amount + 2) * 100000  // 2L above
        }
      }

      // Extract brand preferences and specific models
      const brands = []
      const specificModels = []
      const brandKeywords = {
        'maruti': 'maruti-suzuki',
        'suzuki': 'maruti-suzuki',
        'hyundai': 'hyundai',
        'tata': 'tata',
        'mahindra': 'mahindra',
        'honda': 'honda',
        'toyota': 'toyota'
      }

      // Check for specific model names that should prioritize 2024 versions
      const modelKeywords = {
        'swift': 'maruti-suzuki',
        'baleno': 'maruti-suzuki',
        'brezza': 'maruti-suzuki',
        'fronx': 'maruti-suzuki',
        'creta': 'hyundai',
        'venue': 'hyundai',
        'i20': 'hyundai',
        'exter': 'hyundai',
        'nexon': 'tata',
        'punch': 'tata',
        'harrier': 'tata',
        'curvv': 'tata',
        'thar': 'mahindra',
        'xuv700': 'mahindra',
        'xuv3xo': 'mahindra',
        'city': 'honda',
        'elevate': 'honda',
        'hyryder': 'toyota'
      }

      for (const [keyword, brand] of Object.entries(brandKeywords)) {
        if (lowerMessage.includes(keyword)) {
          brands.push(brand)
        }
      }

      for (const [model, brand] of Object.entries(modelKeywords)) {
        if (lowerMessage.includes(model)) {
          if (!brands.includes(brand)) brands.push(brand)
          specificModels.push(model)
        }
      }

      // Extract body type preferences
      const bodyTypes = []
      if (lowerMessage.includes('suv')) bodyTypes.push('SUV')
      if (lowerMessage.includes('sedan')) bodyTypes.push('Sedan')
      if (lowerMessage.includes('hatchback')) bodyTypes.push('Hatchback')

      // Extract fuel type preferences
      const fuelTypes = []
      if (lowerMessage.includes('petrol')) fuelTypes.push('Petrol')
      if (lowerMessage.includes('diesel')) fuelTypes.push('Diesel')
      if (lowerMessage.includes('electric') || lowerMessage.includes('ev')) fuelTypes.push('Electric')
      if (lowerMessage.includes('cng')) fuelTypes.push('CNG')

      // Extract transmission preferences
      const transmissions = []
      if (lowerMessage.includes('automatic') || lowerMessage.includes('amt') || lowerMessage.includes('cvt')) {
        transmissions.push('Automatic')
      }
      if (lowerMessage.includes('manual')) transmissions.push('Manual')

      // Build search filters
      const filters: CarSearchFilters = {}
      if (budget) filters.priceRange = budget
      if (brands.length > 0) filters.brand = brands
      if (bodyTypes.length > 0) filters.bodyType = bodyTypes
      if (fuelTypes.length > 0) filters.fuelType = fuelTypes
      if (transmissions.length > 0) filters.transmission = transmissions

      // If no specific filters, get popular cars in general price ranges
      if (Object.keys(filters).length === 0) {
        // Default to popular models across different price ranges
        filters.brand = ['maruti-suzuki', 'hyundai', 'tata']
      }

      const carData = await carDataService.searchCars(filters)
      
      // Limit to top 10 most relevant cars to avoid token limits
      return carData.slice(0, 10)
    } catch (error) {
      console.error('Error fetching car data:', error)
      return []
    }
  },

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return { 
      status: 'healthy', 
      timestamp: new Date().toISOString() 
    }
  },
}

// Utility functions for client-side processing
export const aiUtils = {
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