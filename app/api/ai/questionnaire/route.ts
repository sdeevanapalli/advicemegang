import { NextRequest, NextResponse } from 'next/server'
import openai, { safeOpenAICall } from '@/lib/openai'
import { z } from 'zod'

const QuestionnaireRequestSchema = z.object({
  stage: z.enum(['initial', 'followup']),
  previousAnswers: z.array(z.object({
    questionId: z.string(),
    question: z.string(),
    answer: z.string(),
    answerType: z.string(),
  })).optional(),
  currentContext: z.object({
    budget: z.object({
      min: z.number(),
      max: z.number(),
    }).optional(),
    preferences: z.any().optional(),
  }).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = QuestionnaireRequestSchema.parse(body)
    const { stage, previousAnswers = [], currentContext } = validatedData

    let prompt = ''

    if (stage === 'initial') {
      prompt = `Generate an initial set of smart questions for senior car buyers in India. Create questions that help understand their specific needs and preferences.

REQUIREMENTS:
1. Questions should be senior-friendly (clear, simple language)
2. Cover essential car buying factors for 55+ buyers
3. Include practical considerations for Indian conditions
4. Progressive disclosure - start with most important questions
5. Each question should have multiple choice options where appropriate

RESPONSE FORMAT (JSON):
{
  "questions": [
    {
      "id": "budget_range",
      "question": "What is your comfortable budget for your new car?",
      "type": "radio",
      "options": [
        {"value": "3-5", "label": "₹3-5 Lakhs (Compact cars)"},
        {"value": "5-8", "label": "₹5-8 Lakhs (Mid-size cars)"},
        {"value": "8-15", "label": "₹8-15 Lakhs (Premium cars)"},
        {"value": "15-25", "label": "₹15-25 Lakhs (Luxury cars)"},
        {"value": "25+", "label": "Above ₹25 Lakhs (Ultra-luxury)"}
      ],
      "required": true,
      "helpText": "Consider the total on-road price including insurance and registration"
    }
  ],
  "progressInfo": {
    "currentStep": 1,
    "totalSteps": 8,
    "completionMessage": "These questions help us understand your needs better"
  }
}

Create 6-8 essential questions covering: budget, car type preference, primary usage, physical needs, driving experience, and key features.`

    } else {
      // Follow-up questions based on previous answers
      const answersContext = previousAnswers.map(qa => 
        `Q: ${qa.question}\nA: ${qa.answer}`
      ).join('\n\n')

      prompt = `Based on the previous answers, generate 2-3 intelligent follow-up questions that will help narrow down the best car recommendations for this senior buyer.

PREVIOUS ANSWERS:
${answersContext}

CURRENT CONTEXT:
${currentContext ? JSON.stringify(currentContext) : 'None'}

REQUIREMENTS:
1. Generate contextually relevant follow-up questions
2. Focus on clarifying ambiguous preferences
3. Ask about specific features that matter to seniors
4. Consider Indian market specific factors
5. Questions should lead to better car recommendations

RESPONSE FORMAT (JSON):
{
  "questions": [
    {
      "id": "followup_1",
      "question": "Based on your preferences, which of these features matter most to you?",
      "type": "checkbox",
      "options": [
        {"value": "automatic_transmission", "label": "Automatic transmission for easier driving"},
        {"value": "high_seating", "label": "Higher seating position for better visibility"},
        {"value": "simple_controls", "label": "Simple, easy-to-understand dashboard"}
      ],
      "required": false,
      "helpText": "Select all that are important to you"
    }
  ],
  "analysisInsight": "Why these questions will help refine recommendations",
  "nextSteps": "What happens after these questions are answered"
}

Make questions that build upon their previous answers to get more specific preferences.`
    }

    // Call OpenAI API
    const completion = await safeOpenAICall(async () => {
      return await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert in creating senior-friendly questionnaires for car buying in India. Generate contextually relevant questions that lead to better recommendations. Always respond with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1500,
      })
    })

    if (!completion) {
      return NextResponse.json(
        { error: 'Failed to generate questions. Please try again.' },
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
      console.error('Failed to parse AI questionnaire response:', parseError)
      
      // Fallback questions if AI parsing fails
      const fallbackQuestions = stage === 'initial' ? {
        questions: [
          {
            id: "budget_range",
            question: "What is your comfortable budget for your new car?",
            type: "radio",
            options: [
              {value: "3-5", label: "₹3-5 Lakhs"},
              {value: "5-8", label: "₹5-8 Lakhs"},
              {value: "8-15", label: "₹8-15 Lakhs"},
              {value: "15+", label: "Above ₹15 Lakhs"}
            ],
            required: true,
            helpText: "Consider the total on-road price"
          }
        ],
        progressInfo: {
          currentStep: 1,
          totalSteps: 6,
          completionMessage: "Let's find the perfect car for you"
        }
      } : {
        questions: [],
        analysisInsight: "Please try again to get personalized follow-up questions",
        nextSteps: "We'll analyze your preferences to suggest the best cars"
      }

      return NextResponse.json(fallbackQuestions)
    }

  } catch (error) {
    console.error('Questionnaire API Error:', error)
    
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