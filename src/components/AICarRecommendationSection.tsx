'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Bot, 
  MessageSquare, 
  ClipboardList, 
  GitCompare,
  Sparkles,
  Clock,
  Users,
  Shield
} from 'lucide-react'
import { AIQuestionnaire } from './AIQuestionnaire'
import { AIRecommendationResults } from './AIRecommendationResults'
import { AIChat } from './AIChat'
import { useCarRecommendations, useCarComparison } from '@/hooks/useAI'
import { UserPreferences, CarRecommendation, RecommendationResponse } from '@/types/ai'

export function AICarRecommendationSection() {
  const [currentStep, setCurrentStep] = useState<'questionnaire' | 'results' | 'chat' | 'comparison'>('questionnaire')
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null)
  const [recommendationResults, setRecommendationResults] = useState<RecommendationResponse | null>(null)
  const [selectedCarsForComparison, setSelectedCarsForComparison] = useState<Array<{ brand: string; model: string; variant: string }>>([])

  const { getRecommendations, isLoading: isLoadingRecommendations, error: recommendationError } = useCarRecommendations()
  const { compareCars, comparison, isLoading: isLoadingComparison } = useCarComparison()

  // Handle questionnaire completion
  const handleQuestionnaireComplete = async (preferences: UserPreferences) => {
    setUserPreferences(preferences)
    
    // Get AI recommendations
    try {
      const result = await new Promise<RecommendationResponse>((resolve, reject) => {
        getRecommendations({ preferences }, {
          onSuccess: resolve,
          onError: reject,
        })
      })
      
      setRecommendationResults(result)
      setCurrentStep('results')
    } catch (error) {
      console.error('Failed to get recommendations:', error)
    }
  }

  // Handle car comparison request
  const handleCompareRequest = (cars: Array<{ brand: string; model: string; variant: string }>) => {
    setSelectedCarsForComparison(cars)
    compareCars({
      cars,
      userContext: userPreferences ? {
        budget: userPreferences.budget,
        primaryUse: userPreferences.primaryUse,
        seniorNeeds: userPreferences.physicalNeeds,
        location: userPreferences.location,
      } : undefined,
      focusAreas: ['senior-friendly', 'safety', 'comfort', 'value-for-money']
    })
    setCurrentStep('comparison')
  }

  // Handle chat about specific car
  const handleChatAboutCar = (car: CarRecommendation) => {
    setCurrentStep('chat')
    // The chat component will handle the initial message
  }

  // Reset to questionnaire
  const handleStartOver = () => {
    setCurrentStep('questionnaire')
    setUserPreferences(null)
    setRecommendationResults(null)
    setSelectedCarsForComparison([])
  }

  return (
    <section id="recommendation" className="py-20 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm mb-6">
              <Bot className="h-4 w-4 mr-2 text-primary" />
              <span className="text-primary font-medium">AI-Powered Car Discovery</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Find Your Perfect Car
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto senior-friendly">
              Our AI expert asks smart questions, analyzes your needs, and recommends the best cars 
              from every brand in India - tailored specifically for senior buyers.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-4">
              <StepIndicator
                step={1}
                title="Smart Questions"
                description="AI learns your needs"
                isActive={currentStep === 'questionnaire'}
                isCompleted={userPreferences !== null}
                icon={<ClipboardList className="h-4 w-4" />}
              />
              <div className="w-8 h-0.5 bg-gray-200" />
              <StepIndicator
                step={2}
                title="AI Analysis"
                description="Personalized recommendations"
                isActive={currentStep === 'results'}
                isCompleted={recommendationResults !== null}
                icon={<Sparkles className="h-4 w-4" />}
              />
              <div className="w-8 h-0.5 bg-gray-200" />
              <StepIndicator
                step={3}
                title="Expert Chat"
                description="Ask anything"
                isActive={currentStep === 'chat'}
                isCompleted={false}
                icon={<MessageSquare className="h-4 w-4" />}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {currentStep === 'questionnaire' && (
              <div>
                <AIQuestionnaire onComplete={handleQuestionnaireComplete} />
              </div>
            )}

            {currentStep === 'results' && recommendationResults && (
              <div>
                <Tabs defaultValue="recommendations" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="recommendations" className="text-base">
                      <Bot className="h-4 w-4 mr-2" />
                      AI Recommendations
                    </TabsTrigger>
                    <TabsTrigger value="chat" className="text-base" onClick={() => setCurrentStep('chat')}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat with Expert
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="recommendations">
                    <AIRecommendationResults
                      recommendations={recommendationResults}
                      onCompareSelected={handleCompareRequest}
                      onChatAboutCar={handleChatAboutCar}
                      isLoading={isLoadingRecommendations}
                    />
                  </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 mt-8">
                  <Button onClick={handleStartOver} variant="outline" size="lg">
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Try Different Preferences
                  </Button>
                  <Button onClick={() => setCurrentStep('chat')} size="lg">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat with AI Expert
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 'chat' && (
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bot className="h-6 w-6 text-primary" />
                        <div>
                          <CardTitle>Chat with AI Car Expert</CardTitle>
                          <CardDescription>
                            Get instant answers about any car, feature, or buying advice
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setCurrentStep('results')}
                          variant="outline"
                          size="sm"
                        >
                          Back to Results
                        </Button>
                        <Button
                          onClick={handleStartOver}
                          variant="outline"
                          size="sm"
                        >
                          Start Over
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                <AIChat
                  userPreferences={userPreferences || undefined}
                  currentCars={recommendationResults?.recommendations}
                  onRecommendationRequest={() => setCurrentStep('results')}
                />
              </div>
            )}

            {currentStep === 'comparison' && comparison && (
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <GitCompare className="h-6 w-6 text-primary" />
                        <div>
                          <CardTitle>AI Car Comparison</CardTitle>
                          <CardDescription>
                            Detailed analysis of your selected cars
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setCurrentStep('results')}
                          variant="outline"
                          size="sm"
                        >
                          Back to Results
                        </Button>
                        <Button
                          onClick={() => setCurrentStep('chat')}
                          variant="outline"
                          size="sm"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Ask AI
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Comparison results would be rendered here */}
                <Card>
                  <CardContent className="p-8">
                    <div className="text-center">
                      <Bot className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">AI Comparison Analysis</h3>
                      <p className="text-gray-600 mb-4">
                        Comparing {selectedCarsForComparison.map(car => `${car.brand} ${car.model}`).join(' vs ')}
                      </p>
                      {isLoadingComparison && (
                        <div className="animate-pulse">Processing comparison...</div>
                      )}
                      {comparison && !isLoadingComparison && (
                        <div className="bg-green-50 p-4 rounded-lg border">
                          <p className="text-green-800 font-medium">
                            {comparison.recommendation.winner} is our AI recommendation
                          </p>
                          <p className="text-green-700 text-sm mt-2">
                            {comparison.recommendation.reasoning}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {recommendationError && (
              <Alert variant="destructive" className="max-w-2xl mx-auto">
                <AlertDescription>
                  Failed to get AI recommendations. Please try again or contact support.
                  <Button
                    onClick={handleStartOver}
                    variant="outline"
                    size="sm"
                    className="ml-4"
                  >
                    Try Again
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 bg-white/60 backdrop-blur-sm rounded-xl p-8 border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <Clock className="h-8 w-8 text-blue-600" />
                <h4 className="font-medium">Real-time Analysis</h4>
                <p className="text-sm text-gray-600">
                  Current market prices and availability
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Users className="h-8 w-8 text-green-600" />
                <h4 className="font-medium">Senior-Focused</h4>
                <p className="text-sm text-gray-600">
                  Prioritizes comfort, safety, and ease of use
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Shield className="h-8 w-8 text-purple-600" />
                <h4 className="font-medium">Unbiased Advice</h4>
                <p className="text-sm text-gray-600">
                  No dealer partnerships, purely AI-driven
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Step indicator component
function StepIndicator({
  step,
  title,
  description,
  isActive,
  isCompleted,
  icon
}: {
  step: number
  title: string
  description: string
  isActive: boolean
  isCompleted: boolean
  icon: React.ReactNode
}) {
  return (
    <div className={`flex flex-col items-center text-center max-w-32 ${
      isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-gray-400'
    }`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 border-2 ${
        isActive 
          ? 'bg-primary text-white border-primary' 
          : isCompleted 
          ? 'bg-green-600 text-white border-green-600'
          : 'bg-gray-100 border-gray-300'
      }`}>
        {icon}
      </div>
      <div className="text-sm font-medium">{title}</div>
      <div className="text-xs opacity-75">{description}</div>
    </div>
  )
}