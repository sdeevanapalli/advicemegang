import { NextRequest, NextResponse } from 'next/server'
import openai, { safeOpenAICall } from '@/lib/openai'
import { z } from 'zod'

const ChatRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional(),
  context: z.object({
    userPreferences: z.any().optional(),
    currentCars: z.array(z.any()).optional(),
  }).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = ChatRequestSchema.parse(body)
    const { message, conversationHistory = [], context } = validatedData

    // Build system prompt for Indian car expert
    const systemPrompt = `You are an expert Indian car advisor with comprehensive knowledge of all car brands available in India. You specialize in helping senior buyers (55+ years) find suitable vehicles.

EXPERTISE AREAS:
- All Indian car brands: Maruti Suzuki, Hyundai, Tata, Mahindra, Honda, Toyota, Volkswagen, Skoda, Kia, MG, Nissan, Renault, Ford, Chevrolet, Jeep, BMW, Mercedes-Benz, Audi, Volvo, Jaguar, Land Rover, Porsche, etc.
- Current pricing in Indian Rupees (₹)
- Senior-friendly features and accessibility
- Indian road conditions and driving patterns
- Regional dealership networks and service availability
- Insurance, financing, and maintenance costs
- Safety ratings and reliability data

COMMUNICATION STYLE:
- Use simple, jargon-free language
- Explain technical terms when necessary
- Be patient and thorough
- Focus on practical benefits
- Provide specific, actionable advice
- Use Indian currency (₹) and measurements (kmpl, etc.)

SENIOR BUYER FOCUS:
- Prioritize safety, comfort, and ease of use
- Consider physical accessibility (entry/exit, seat height, controls)
- Emphasize reliability and low maintenance
- Suggest test driving multiple options
- Recommend features like automatic transmission, power steering, good visibility

${context?.userPreferences ? `USER CONTEXT: ${JSON.stringify(context.userPreferences)}` : ''}
${context?.currentCars ? `CARS BEING CONSIDERED: ${JSON.stringify(context.currentCars)}` : ''}

Provide helpful, accurate, and personalized advice based on the user's question.`

    // Prepare conversation messages
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ]

    // Call OpenAI API
    const completion = await safeOpenAICall(async () => {
      return await openai.chat.completions.create({
        model: "gpt-4",
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 800,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      })
    })

    if (!completion) {
      return NextResponse.json(
        { error: 'Failed to get AI response. Please try again.' },
        { status: 500 }
      )
    }

    const responseText = completion.choices[0]?.message?.content
    if (!responseText) {
      return NextResponse.json(
        { error: 'Empty response from AI service' },
        { status: 500 }
      )
    }

    // Check if the response might contain car recommendations
    const containsRecommendations = /recommend|suggest|consider|look at|try|best.*car/i.test(responseText)
    
    return NextResponse.json({
      message: responseText,
      containsRecommendations,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request format', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        message: "I apologize, but I'm having trouble processing your question right now. Please try asking again or rephrase your question.",
        error: true,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

// GET endpoint for health check
export async function GET() {
  return NextResponse.json({ 
    status: 'Chat API is running',
    timestamp: new Date().toISOString(),
  })
}