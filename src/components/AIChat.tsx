'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Bot, 
  User, 
  Send, 
  MessageCircle, 
  Loader2,
  Lightbulb,
  Car,
  IndianRupee,
  MapPin,
  AlertCircle
} from 'lucide-react'
import { useAIChat } from '@/hooks/useAI'
import { ChatMessage, UserPreferences, CarRecommendation } from '@/types/ai'
import { aiUtils } from '@/services/ai'

interface AIChatProps {
  userPreferences?: UserPreferences
  currentCars?: CarRecommendation[]
  initialMessage?: string
  onRecommendationRequest?: () => void
}

export function AIChat({ 
  userPreferences, 
  currentCars, 
  initialMessage,
  onRecommendationRequest 
}: AIChatProps) {
  const [inputMessage, setInputMessage] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { messages, sendMessage, isTyping, clearChat, error } = useAIChat()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages, isTyping])

  // Send initial message if provided
  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      handleSendMessage(initialMessage)
    }
  }, [initialMessage])

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage.trim()
    if (!messageToSend) return

    setInputMessage('')
    setShowSuggestions(false)

    try {
      await sendMessage({
        message: messageToSend,
        context: {
          userPreferences,
          currentCars,
        }
      })
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const suggestedQuestions = [
    "What are the most reliable cars for senior buyers?",
    "Which cars have the easiest entry and exit?",
    "Compare automatic vs manual transmission for seniors",
    "What safety features should I prioritize?",
    "Which cars have the best service networks in India?",
    "What's the best fuel type for city driving?",
    "How do I choose between sedan and SUV?",
    "What are the maintenance costs for different brands?"
  ]

  const getContextualSuggestions = () => {
    if (userPreferences?.budget) {
      const budget = userPreferences.budget
      return [
        `Show me cars in my budget range (${aiUtils.formatPriceInLakhs(budget.min)} - ${aiUtils.formatPriceInLakhs(budget.max)})`,
        "What's the best value for money car in my budget?",
        "Should I consider going slightly above my budget?"
      ]
    }
    return suggestedQuestions.slice(0, 3)
  }

  return (
    <div className="flex flex-col h-[600px] max-w-4xl mx-auto">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-lg">AI Car Expert</CardTitle>
                <CardDescription>
                  Ask me anything about cars, get personalized advice
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-xs">
                Senior Specialist
              </Badge>
              {messages.length > 0 && (
                <Button
                  onClick={clearChat}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Clear Chat
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col min-h-0">
          {/* Chat Messages */}
          <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Welcome to AI Car Expert!</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    I'm here to help you find the perfect car. I know everything about Indian car market, 
                    senior-friendly features, and can explain technical terms in simple language.
                  </p>
                </div>
              )}

              {messages.map((message, index) => (
                <ChatBubble key={index} message={message} />
              ))}

              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to send message. Please try again.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </ScrollArea>

          {/* Suggested Questions */}
          {showSuggestions && messages.length === 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-blue-600" />
                Try asking:
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {getContextualSuggestions().map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="justify-start text-left h-auto p-2 text-blue-700 hover:bg-blue-100"
                    onClick={() => handleSendMessage(question)}
                  >
                    <MessageCircle className="h-3 w-3 mr-2 flex-shrink-0" />
                    <span className="text-xs">{question}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="mt-4 flex gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about any car, feature, or buying advice..."
                disabled={isTyping}
                className="pr-12"
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isTyping}
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Context Info */}
          {(userPreferences || currentCars) && (
            <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
              {userPreferences && (
                <Badge variant="outline" className="text-xs">
                  <IndianRupee className="h-3 w-3 mr-1" />
                  Budget: {aiUtils.formatPriceInLakhs(userPreferences.budget.min)} - {aiUtils.formatPriceInLakhs(userPreferences.budget.max)}
                </Badge>
              )}
              {currentCars && currentCars.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  <Car className="h-3 w-3 mr-1" />
                  {currentCars.length} car{currentCars.length > 1 ? 's' : ''} in context
                </Badge>
              )}
              {userPreferences?.location && (
                <Badge variant="outline" className="text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  {userPreferences.location}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Individual chat bubble component
function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'
  const [isExpanded, setIsExpanded] = useState(false)
  const contentLength = message.content.length
  const shouldTruncate = contentLength > 300

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-primary/10'
      }`}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
      </div>
      
      <div className={`rounded-lg p-3 max-w-[80%] ${
        isUser 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-gray-100'
      }`}>
        <div className={`${
          isUser ? 'text-primary-foreground' : 'text-gray-900'
        } senior-friendly leading-relaxed`}>
          {shouldTruncate && !isExpanded ? (
            <div>
              {message.content.substring(0, 300)}...
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-xs h-6 p-1"
                onClick={() => setIsExpanded(true)}
              >
                Read more
              </Button>
            </div>
          ) : (
            <div className="whitespace-pre-wrap">
              {message.content}
              {shouldTruncate && isExpanded && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-xs h-6 p-1"
                  onClick={() => setIsExpanded(false)}
                >
                  Show less
                </Button>
              )}
            </div>
          )}
        </div>
        
        {message.timestamp && (
          <div className={`text-xs mt-2 opacity-70 ${
            isUser ? 'text-primary-foreground' : 'text-gray-500'
          }`}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  )
}