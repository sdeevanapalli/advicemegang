'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Car, 
  IndianRupee, 
  Fuel, 
  Shield, 
  Users, 
  Wrench,
  Star,
  TrendingUp,
  MapPin,
  MessageCircle,
  GitCompare,
  ExternalLink,
  Bot,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { CarRecommendation, RecommendationResponse } from '@/types/ai'
import { aiUtils } from '@/services/ai'

interface AIRecommendationResultsProps {
  recommendations: RecommendationResponse
  onCompareSelected?: (cars: Array<{ brand: string; model: string; variant: string }>) => void
  onChatAboutCar?: (car: CarRecommendation) => void
  isLoading?: boolean
}

export function AIRecommendationResults({
  recommendations,
  onCompareSelected,
  onChatAboutCar,
  isLoading = false
}: AIRecommendationResultsProps) {
  const [selectedCars, setSelectedCars] = useState<string[]>([])
  const [expandedCards, setExpandedCards] = useState<string[]>([])

  const toggleCarSelection = (carId: string) => {
    setSelectedCars(prev => 
      prev.includes(carId) 
        ? prev.filter(id => id !== carId)
        : [...prev, carId]
    )
  }

  const toggleCardExpansion = (carId: string) => {
    setExpandedCards(prev =>
      prev.includes(carId)
        ? prev.filter(id => id !== carId)
        : [...prev, carId]
    )
  }

  const handleCompareSelected = () => {
    if (selectedCars.length >= 2 && onCompareSelected) {
      const carsToCompare = recommendations.recommendations
        .filter((_, index) => selectedCars.includes(getCarId(index)))
        .map(car => ({
          brand: car.brand,
          model: car.model,
          variant: car.variant
        }))
      onCompareSelected(carsToCompare)
    }
  }

  const getCarId = (index: number) => `${recommendations.recommendations[index].brand}-${recommendations.recommendations[index].model}-${index}`

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bot className="h-12 w-12 text-primary animate-pulse mb-4" />
            <h3 className="text-lg font-medium mb-2">AI is finding your perfect cars...</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Analyzing thousands of car models across all Indian brands to match your preferences
            </p>
            <Progress value={75} className="w-64 mt-4" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* AI Analysis Summary */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl">AI Analysis Complete</CardTitle>
          </div>
          <CardDescription className="text-base">
            Based on your preferences, here are the best cars for you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <MessageCircle className="h-4 w-4" />
            <AlertDescription className="text-base">
              {recommendations.additionalAdvice}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Selection and Compare Tools */}
      {recommendations.recommendations.length > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitCompare className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {selectedCars.length} cars selected for comparison
                </span>
              </div>
              <Button
                onClick={handleCompareSelected}
                disabled={selectedCars.length < 2}
                size="sm"
              >
                Compare Selected Cars
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Car Recommendations */}
      <div className="grid gap-6">
        {recommendations.recommendations.map((car, index) => {
          const carId = getCarId(index)
          const isSelected = selectedCars.includes(carId)
          const isExpanded = expandedCards.includes(carId)

          return (
            <Card 
              key={carId} 
              className={`transition-all duration-200 ${
                isSelected ? 'ring-2 ring-primary shadow-lg' : ''
              } ${index === 0 ? 'border-green-200 bg-green-50/50' : ''}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {index === 0 && (
                      <Badge className="bg-green-500 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        AI Top Pick
                      </Badge>
                    )}
                    <div>
                      <CardTitle className="text-xl senior-friendly">
                        {car.brand} {car.model}
                      </CardTitle>
                      <CardDescription className="text-base text-gray-600">
                        {car.variant}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCarSelection(carId)}
                    >
                      {isSelected ? 'Deselect' : 'Select'}
                    </Button>
                  </div>
                </div>

                {/* Price Range */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-5 w-5 text-primary" />
                      <span className="text-lg font-semibold">
                        {aiUtils.formatPriceInLakhs(car.priceRange.min)} - {aiUtils.formatPriceInLakhs(car.priceRange.max)}
                      </span>
                    </div>
                    <Badge variant="secondary">
                      Starting at {aiUtils.formatPrice(car.priceRange.min)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Why Recommended */}
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Why AI Recommends This Car
                  </h4>
                  <p className="text-blue-800 senior-friendly leading-relaxed">
                    {car.whyRecommended}
                  </p>
                </div>

                {/* Senior-Friendly Features */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-600" />
                    Senior-Friendly Features
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {car.seniorFriendlyFeatures.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="justify-start p-2 text-sm">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Quick Specs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <Fuel className="h-4 w-4 mx-auto mb-1 text-gray-600" />
                    <p className="text-xs text-gray-600">Fuel Economy</p>
                    <p className="text-sm font-medium">{car.keySpecs.fuelEconomy}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <Shield className="h-4 w-4 mx-auto mb-1 text-gray-600" />
                    <p className="text-xs text-gray-600">Safety</p>
                    <p className="text-sm font-medium">{car.keySpecs.safetyRating}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <Wrench className="h-4 w-4 mx-auto mb-1 text-gray-600" />
                    <p className="text-xs text-gray-600">Engine</p>
                    <p className="text-sm font-medium">{car.keySpecs.engine}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <Star className="h-4 w-4 mx-auto mb-1 text-gray-600" />
                    <p className="text-xs text-gray-600">Warranty</p>
                    <p className="text-sm font-medium">{car.keySpecs.warranty}</p>
                  </div>
                </div>

                {/* Expandable Pros/Cons */}
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCardExpansion(carId)}
                    className="w-full justify-between"
                  >
                    <span>View Detailed Analysis</span>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>

                  {isExpanded && (
                    <div className="space-y-4 mt-4 border-t pt-4">
                      {/* Pros */}
                      <div>
                        <h5 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4" />
                          Advantages for Senior Buyers
                        </h5>
                        <ul className="space-y-1">
                          {car.pros.map((pro, idx) => (
                            <li key={idx} className="text-sm text-green-600 flex items-start gap-2">
                              <span className="text-green-500 mt-1">•</span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Cons */}
                      {car.cons.length > 0 && (
                        <div>
                          <h5 className="font-medium text-orange-700 mb-2 flex items-center gap-2">
                            <ThumbsDown className="h-4 w-4" />
                            Consider These Points
                          </h5>
                          <ul className="space-y-1">
                            {car.cons.map((con, idx) => (
                              <li key={idx} className="text-sm text-orange-600 flex items-start gap-2">
                                <span className="text-orange-500 mt-1">•</span>
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Availability Notes */}
                      {car.availabilityNotes && (
                        <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                          <h5 className="font-medium text-yellow-800 mb-1 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Availability Information
                          </h5>
                          <p className="text-sm text-yellow-700">{car.availabilityNotes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => onChatAboutCar?.(car)}
                    variant="outline"
                    size="sm"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Ask AI About This Car
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(
                        `${car.brand} ${car.model} ${car.variant} price India dealer`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Find Dealers
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Next Steps */}
      {recommendations.nextSteps.length > 0 && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-green-600" />
              Recommended Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recommendations.nextSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Badge className="bg-green-100 text-green-800 min-w-6 h-6 flex items-center justify-center text-xs">
                    {index + 1}
                  </Badge>
                  <p className="text-green-700 senior-friendly">{step}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}