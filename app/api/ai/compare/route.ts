import { NextRequest, NextResponse } from 'next/server'
import openai, { safeOpenAICall } from '@/lib/openai'
import { z } from 'zod'

const CompareRequestSchema = z.object({
  cars: z.array(z.object({
    brand: z.string(),
    model: z.string(),
    variant: z.string().optional(),
  })).min(2).max(5),
  userContext: z.object({
    budget: z.object({
      min: z.number(),
      max: z.number(),
    }).optional(),
    primaryUse: z.string().optional(),
    seniorNeeds: z.array(z.string()).optional(),
    location: z.string().optional(),
  }).optional(),
  focusAreas: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = CompareRequestSchema.parse(body)
    const { cars, userContext, focusAreas } = validatedData

    // Create car list for prompt
    const carList = cars.map((car, index) => 
      `${index + 1}. ${car.brand} ${car.model}${car.variant ? ` ${car.variant}` : ''}`
    ).join('\n')

    // Build comparison prompt
    const prompt = `You are an expert Indian automotive analyst. Provide a comprehensive comparison of these cars specifically for senior buyers (55+ years):

CARS TO COMPARE:
${carList}

USER CONTEXT:
${userContext?.budget ? `Budget: ₹${userContext.budget.min.toLocaleString('en-IN')} - ₹${userContext.budget.max.toLocaleString('en-IN')}` : ''}
${userContext?.primaryUse ? `Primary Use: ${userContext.primaryUse}` : ''}
${userContext?.seniorNeeds?.length ? `Senior-specific needs: ${userContext.seniorNeeds.join(', ')}` : ''}
${userContext?.location ? `Location: ${userContext.location}` : ''}

FOCUS AREAS: ${focusAreas?.join(', ') || 'Overall comparison for senior buyers'}

COMPARISON REQUIREMENTS:
1. Include current Indian market pricing
2. Emphasize senior-friendly aspects (comfort, ease of use, safety)
3. Consider Indian road conditions and service networks
4. Provide practical buying advice
5. Highlight key differentiators

RESPONSE FORMAT (JSON):
{
  "comparison": {
    "overallRecommendation": "Which car is best for senior buyers and why",
    "priceComparison": [
      {
        "car": "Brand Model",
        "startingPrice": 1200000,
        "onRoadPrice": 1350000,
        "valueRating": "Excellent/Good/Average/Poor"
      }
    ],
    "featureComparison": {
      "seniorFriendlyFeatures": [
        {
          "feature": "Seat Height & Entry/Exit",
          "cars": [
            {"car": "Brand Model", "rating": "Excellent", "details": "High seating, wide door opening"}
          ]
        },
        {
          "feature": "Dashboard & Controls",
          "cars": [
            {"car": "Brand Model", "rating": "Good", "details": "Simple layout, large buttons"}
          ]
        }
      ],
      "safetyFeatures": [
        {
          "car": "Brand Model",
          "airbags": 6,
          "safetyRating": "5 stars",
          "keyFeatures": ["ABS", "EBD", "ESP"]
        }
      ],
      "comfortFeatures": [
        {
          "car": "Brand Model",
          "highlights": ["Automatic climate control", "Powered seats"],
          "seniorBenefit": "Reduces physical effort"
        }
      ]
    },
    "prosAndCons": [
      {
        "car": "Brand Model",
        "prosForSeniors": ["Easy to drive", "Comfortable seating"],
        "consForSeniors": ["Complex infotainment", "Hard suspension"],
        "bestFor": "City driving and comfort"
      }
    ]
  },
  "recommendation": {
    "winner": "Brand Model",
    "reasoning": "Detailed explanation why this car is best for the user",
    "alternatives": [
      {
        "car": "Brand Model",
        "whenToChoose": "If you prioritize fuel economy over comfort"
      }
    ]
  },
  "buyingAdvice": {
    "testDriveChecklist": ["Check seat comfort", "Test visibility", "Try parking"],
    "negotiationTips": ["Best time to buy", "Expected discounts"],
    "financingOptions": ["Bank loan rates", "Dealer financing"],
    "dealershipNotes": "Service network and support quality"
  }
}`

    // Call OpenAI API
    const completion = await safeOpenAICall(async () => {
      return await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert Indian automotive consultant specializing in senior-friendly car comparisons. Always respond with valid JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 2500,
      })
    })

    if (!completion) {
      return NextResponse.json(
        { error: 'Failed to get AI comparison. Please try again.' },
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
      console.error('Failed to parse AI comparison response:', parseError)
      return NextResponse.json(
        { 
          error: 'Invalid AI response format',
          comparison: {
            overallRecommendation: "I apologize, but I'm having trouble generating the comparison right now. Please try again."
          }
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Compare API Error:', error)
    
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