import HeroSection from '@/components/HeroSection'
import { FeaturesSection } from '@/components/FeaturesSection'
import { AICarRecommendationSection } from '@/components/AICarRecommendationSection'
import { AIChat } from '@/components/AIChat'
import Footer from '@/components/Footer'
import AppNavBar from '@/components/AppNavBar'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AppNavBar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <AICarRecommendationSection />
        
        {/* Standalone Chat Section */}
        <section id="chat" className="py-20 bg-gradient-to-br from-purple-50/50 via-white to-blue-50/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Chat with AI Expert
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto senior-friendly">
                Get instant answers about any car model, compare features, or ask for buying advice. 
                Our AI knows every car available in India and speaks in simple, senior-friendly language.
              </p>
            </div>
            <AIChat />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}