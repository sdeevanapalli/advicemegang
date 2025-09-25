import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

export default openai

// Error handling wrapper for OpenAI API calls
export async function safeOpenAICall<T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<T | null> {
  try {
    return await operation()
  } catch (error) {
    console.error('OpenAI API Error:', error)
    if (fallback !== undefined) {
      return fallback
    }
    return null
  }
}

// Token usage tracking for optimization
export function calculateTokens(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4)
}