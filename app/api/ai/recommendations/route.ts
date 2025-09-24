import { NextRequest, NextResponse } from 'next/server'
import openai, { safeOpenAICall } from '@/lib/openai'
import { z } from 'zod'

// Input validation schema
const RecommendationRequestSchema = z.object({
  preferences: z.object({
    budget: z.object({
      min: z.number().min(0),
      max: z.number().min(0),
    }),
    bodyType: z.array(z.string()).optional(),
    fuelType: z.array(z.string()).optional(),
    transmission: z.string().optional(),
    features: z.array(z.string()).optional(),
    primaryUse: z.string().optional(),
    drivingExperience: z.string().optional(),
    physicalNeeds: z.array(z.string()).optional(),
    location: z.string().optional(),
  }),
  previousAnswers: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = RecommendationRequestSchema.parse(body)
    const { preferences, previousAnswers = [] } = validatedData

    // Create context from previous answers
    const conversationContext = previousAnswers
      .map(qa => `Q: ${qa.question}\nA: ${qa.answer}`)
      .join('\n\n')

    // Construct the AI prompt for Indian car market
    const prompt = `You are an expert car advisor specializing in the Indian automotive market with deep knowledge of senior buyer needs. Based on the user preferences and conversation context, provide personalized car recommendations.

USER PREFERENCES:
- Budget: ₹${preferences.budget.min.toLocaleString('en-IN')} - ₹${preferences.budget.max.toLocaleString('en-IN')}
- Body Types: ${preferences.bodyType?.join(', ') || 'Any'}
- Fuel Types: ${preferences.fuelType?.join(', ') || 'Any'}
- Transmission: ${preferences.transmission || 'Any'}
- Required Features: ${preferences.features?.join(', ') || 'Standard features'}
- Primary Use: ${preferences.primaryUse || 'General driving'}
- Driving Experience: ${preferences.drivingExperience || 'Not specified'}
- Physical Needs: ${preferences.physicalNeeds?.join(', ') || 'None specified'}
- Location: ${preferences.location || 'India'}

CONVERSATION CONTEXT:
${conversationContext}

REQUIREMENTS:
1. Recommend 3-5 cars from ALL Indian market brands (Maruti Suzuki, Hyundai, Tata, Mahindra, Honda, Toyota, Volkswagen, Skoda, Kia, MG, Nissan, Renault, Ford, Chevrolet, Jeep, BMW, Mercedes-Benz, Audi, Volvo, Jaguar, Land Rover, Porsche, etc.)
2. Include both popular and lesser-known suitable options
3. Consider senior-friendly features: easy ingress/egress, comfortable seating, simple controls, good visibility, safety features
4. Provide current market pricing in Indian Rupees
5. Explain WHY each car fits their specific needs
6. Include pros and cons relevant to senior buyers
7. Mention availability in their region if location provided

RESPONSE FORMAT (JSON):
{
  "recommendations": [
    {
      "brand": "Brand Name",
      "model": "Model Name",
      "variant": "Specific Variant",
      "priceRange": {
        "min": 800000,
        "max": 1200000
      },
      "whyRecommended": "Detailed explanation of why this car suits their needs",
      "seniorFriendlyFeatures": ["High seating position", "Easy entry/exit", "Simple dashboard"],
      "pros": ["Pro 1", "Pro 2", "Pro 3"],
      "cons": ["Con 1", "Con 2"],
      "keySpecs": {
        "engine": "Engine details",
        "fuelEconomy": "XX kmpl",
        "safetyRating": "X stars",
        "warranty": "X years"
      },
      "availabilityNotes": "Regional availability information"
    }
  ],
  "additionalAdvice": "General advice for senior car buyers based on their preferences",
  "nextSteps": ["Visit dealership X", "Test drive recommendations", "Consider financing options"]
}

Focus on practical, safety-conscious recommendations that prioritize comfort and ease of use for senior buyers.`

    // Call OpenAI API
    const completion = await safeOpenAICall(async () => {
      return await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert Indian automotive consultant specializing in senior-friendly car recommendations. Always respond with valid JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      })
    })

    if (!completion) {
      return NextResponse.json(
        { error: 'Failed to get AI recommendations. Please try again.' },
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

    try {
      const aiResponse = JSON.parse(responseText)
      return NextResponse.json(aiResponse)
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      return NextResponse.json(
        { 
          error: 'Invalid AI response format',
          recommendations: [],
          additionalAdvice: "I apologize, but I'm having trouble processing your request right now. Please try again or contact support."
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Recommendation API Error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request format', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}