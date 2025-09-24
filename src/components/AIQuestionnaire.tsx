'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Bot, ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { useQuestionnaire, useAIThinking } from '@/hooks/useAI'
import { Question, QuestionAnswer, UserPreferences } from '@/types/ai'

interface AIQuestionnaireProps {
  onComplete: (preferences: UserPreferences) => void
  onAnswersChange?: (answers: QuestionAnswer[]) => void
}

export function AIQuestionnaire({ onComplete, onAnswersChange }: AIQuestionnaireProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showFollowupQuestions, setShowFollowupQuestions] = useState(false)
  const { thinkingState, startThinking, stopThinking } = useAIThinking()
  
  const {
    initialQuestions,
    currentQuestions,
    isLoadingInitial,
    isLoadingFollowup,
    answers,
    addAnswer,
    removeAnswer,
    getFollowupQuestions,
    getUserPreferences,
    resetQuestionnaire,
    error,
  } = useQuestionnaire()

  const allQuestions = showFollowupQuestions 
    ? [...(initialQuestions?.questions || []), ...(currentQuestions?.questions || [])]
    : (initialQuestions?.questions || [])

  const currentQuestion = allQuestions[currentQuestionIndex]
  const progress = allQuestions.length > 0 ? ((currentQuestionIndex + 1) / allQuestions.length) * 100 : 0

  // Handle answer submission
  const handleAnswer = (questionId: string, answer: string | string[], question: string, type: string) => {
    const answerText = Array.isArray(answer) ? answer.join(', ') : answer
    const questionAnswer: QuestionAnswer = {
      questionId,
      question,
      answer: answerText,
      answerType: type,
    }
    
    addAnswer(questionAnswer)
    onAnswersChange?.(answers)
    
    // Auto-advance to next question
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  // Generate follow-up questions when initial questionnaire is completed
  const handleGenerateFollowups = async () => {
    if (!showFollowupQuestions && answers.length >= 4) {
      startThinking('generating')
      const preferences = getUserPreferences()
      await getFollowupQuestions(preferences ? { preferences } : undefined)
      setShowFollowupQuestions(true)
      stopThinking()
    }
  }

  // Complete questionnaire and return preferences
  const handleComplete = () => {
    const preferences = getUserPreferences()
    if (preferences) {
      onComplete(preferences)
    }
  }

  // Navigation functions
  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const goToNext = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  // Reset questionnaire
  const handleReset = () => {
    resetQuestionnaire()
    setCurrentQuestionIndex(0)
    setShowFollowupQuestions(false)
  }

  const isAnswered = (questionId: string) => {
    return answers.some(a => a.questionId === questionId)
  }

  const getAnswer = (questionId: string) => {
    return answers.find(a => a.questionId === questionId)?.answer
  }

  if (isLoadingInitial) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Bot className="h-12 w-12 text-primary animate-pulse mb-4" />
          <h3 className="text-lg font-medium mb-2">AI is preparing your personalized questionnaire...</h3>
          <p className="text-sm text-muted-foreground text-center">
            Creating questions tailored for senior car buyers in India
          </p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load questionnaire. Please try again.
          <Button onClick={handleReset} variant="outline" size="sm" className="ml-2">
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!currentQuestion && answers.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No questions available. Please try again.</p>
        </CardContent>
      </Card>
    )
  }

  // Show completion screen
  if (!currentQuestion && answers.length > 0) {
    const preferences = getUserPreferences()
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle>Questionnaire Complete!</CardTitle>
          <CardDescription>
            We've analyzed your preferences and are ready to find the perfect cars for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h4 className="font-medium">Your Answers Summary:</h4>
            <div className="grid grid-cols-1 gap-2">
              {answers.slice(0, 5).map((answer, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{answer.question}</span>
                  <span className="font-medium text-right max-w-xs truncate">{answer.answer}</span>
                </div>
              ))}
              {answers.length > 5 && (
                <p className="text-xs text-muted-foreground">
                  +{answers.length - 5} more answers
                </p>
              )}
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={handleComplete} className="flex-1">
              Get My Recommendations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button onClick={handleReset} variant="outline">
              Start Over
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestionIndex + 1} of {allQuestions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="w-full" />
          
          {thinkingState.isThinking && (
            <div className="flex items-center gap-2 mt-3">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">{thinkingState.message}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Question */}
      {currentQuestion && (
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <Bot className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div className="flex-1">
                <CardTitle className="text-lg leading-relaxed senior-friendly">
                  {currentQuestion.question}
                </CardTitle>
                {currentQuestion.helpText && (
                  <CardDescription className="mt-2 text-base">
                    {currentQuestion.helpText}
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <QuestionInput
              question={currentQuestion}
              onAnswer={handleAnswer}
              currentAnswer={getAnswer(currentQuestion.id)}
            />
            
            {/* Answer Status */}
            {isAnswered(currentQuestion.id) && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Answered</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <Button
              onClick={goToPrevious}
              disabled={currentQuestionIndex === 0}
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              {/* Generate Follow-up Questions Button */}
              {!showFollowupQuestions && answers.length >= 4 && 
               currentQuestionIndex === (initialQuestions?.questions.length || 0) - 1 && (
                <Button
                  onClick={handleGenerateFollowups}
                  disabled={isLoadingFollowup}
                >
                  {isLoadingFollowup ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      AI Generating...
                    </>
                  ) : (
                    <>
                      <Bot className="mr-2 h-4 w-4" />
                      Get Smart Questions
                    </>
                  )}
                </Button>
              )}

              {/* Next/Complete Button */}
              {currentQuestionIndex < allQuestions.length - 1 ? (
                <Button
                  onClick={goToNext}
                  disabled={!isAnswered(currentQuestion?.id || '')}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={answers.length < 3}
                >
                  Complete
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answers Summary */}
      {answers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Your Answers ({answers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {answers.slice(-5).map((answer, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {answer.answer}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Component for rendering different question types
function QuestionInput({ 
  question, 
  onAnswer, 
  currentAnswer 
}: { 
  question: Question
  onAnswer: (id: string, answer: string | string[], question: string, type: string) => void
  currentAnswer?: string
}) {
  const [localAnswer, setLocalAnswer] = useState<string | string[]>(
    currentAnswer ? 
      (question.type === 'checkbox' ? currentAnswer.split(', ') : currentAnswer) 
      : (question.type === 'checkbox' ? [] : '')
  )

  const handleSubmit = () => {
    if (localAnswer && (Array.isArray(localAnswer) ? localAnswer.length > 0 : localAnswer.trim())) {
      onAnswer(question.id, localAnswer, question.question, question.type)
    }
  }

  switch (question.type) {
    case 'radio':
      return (
        <RadioGroup
          value={localAnswer as string}
          onValueChange={(value) => {
            setLocalAnswer(value)
            onAnswer(question.id, value, question.question, question.type)
          }}
        >
          {question.options?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className="text-base cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )

    case 'checkbox':
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            {question.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={(localAnswer as string[]).includes(option.value)}
                  onCheckedChange={(checked) => {
                    const newAnswer = checked
                      ? [...(localAnswer as string[]), option.value]
                      : (localAnswer as string[]).filter(v => v !== option.value)
                    setLocalAnswer(newAnswer)
                  }}
                />
                <Label htmlFor={option.value} className="text-base cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={(localAnswer as string[]).length === 0}
            size="sm"
          >
            Confirm Selection
          </Button>
        </div>
      )

    case 'select':
      return (
        <Select
          value={localAnswer as string}
          onValueChange={(value) => {
            setLocalAnswer(value)
            onAnswer(question.id, value, question.question, question.type)
          }}
        >
          <SelectTrigger className="text-base">
            <SelectValue placeholder="Choose an option..." />
          </SelectTrigger>
          <SelectContent>
            {question.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )

    case 'text':
      return (
        <div className="space-y-3">
          <Input
            value={localAnswer as string}
            onChange={(e) => setLocalAnswer(e.target.value)}
            placeholder="Type your answer..."
            className="text-base"
          />
          <Button 
            onClick={handleSubmit} 
            disabled={!(localAnswer as string).trim()}
            size="sm"
          >
            Submit Answer
          </Button>
        </div>
      )

    default:
      return (
        <div className="text-muted-foreground">
          Unsupported question type: {question.type}
        </div>
      )
  }
}