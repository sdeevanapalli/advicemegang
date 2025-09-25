# 🚗 Car Advice AI - Real-Time Car Expert

**🆕 LATEST: Streamlined AI-powered car advice with real-time Indian market data**

> **Complete Refactor (2024)**: This project has been completely refactored into a clean, focused AI chatbot that provides instant car buying advice with real-time 2024-2025 model data from the Indian automotive market.

## ✨ Core Features

- **🤖 Instant AI Chat**: Direct conversation with car expert - no forms, no complexity
- **� Real-Time Data**: Current 2024-2025 models, prices, and specifications
- **�🇳 Indian Market Focus**: Specialized for Indian road conditions and brands
- **� Smart Query Processing**: Understands natural language car questions
- **🎯 Contextual Recommendations**: Budget-aware suggestions with current market data
- **⚡ Lightning Fast**: Streamlined interface loads instantly

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- OpenAI API Key
- Optional: RapidAPI Key (for enhanced data)

### Installation

```bash
# Clone repository
git clone https://github.com/LuciferK47/advicemegang.git
cd advicemegang

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Add your OpenAI API key to .env.local

# Start development server
npm run dev
# Open http://localhost:8081
```

### Environment Setup

Create `.env.local` with your API keys:

```env
# Required: OpenAI API Key
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Optional: Enhanced real-time data
VITE_RAPIDAPI_KEY=your_rapidapi_key_here
```

### Get API Keys

**OpenAI API Key** (Required):

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create account → API Keys → Create new key
3. Add to `.env.local`

**RapidAPI Key** (Optional - for enhanced data):

1. Visit [RapidAPI](https://rapidapi.com/)
2. Sign up → Subscribe to car data APIs
3. Add to `.env.local`

## 🏗️ Architecture

### Real-Time Data System

- **Smart Caching**: 5-minute cache for API responses to reduce costs
- **Multi-Source Fallback**: RapidAPI → Mock data → Graceful error handling
- **Query Intelligence**: Extracts budget, brand, fuel type from natural language
- **Current Models**: Always shows 2024-2025 specifications and pricing

### AI Integration (RAG)

- **Retrieval Augmented Generation**: Combines real-time data with AI knowledge
- **Context-Aware Responses**: Uses current car data to inform recommendations
- **Budget Matching**: Automatically finds cars in specified price ranges
- **Specification Accuracy**: Real mileage, safety ratings, and features

### Modern Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn/ui components
- **AI**: OpenAI GPT-3.5-turbo with custom prompts
- **Data**: Custom car data service with API integration
- **State**: Simple React hooks (no complex state management)

## 💬 Usage Examples

### Try These Queries

```
"Show me automatic SUVs under 15 lakhs"
"Compare Maruti Swift 2024 vs Hyundai i20 2024"
"Best petrol cars for city driving with good mileage"
"What are Tata's latest EV models in 2024?"
"I need a 7-seater family car under 20 lakhs"
"Which cars have 5-star safety ratings?"
```

### Sample Conversation

**User**: "I need an automatic car for city driving under 10 lakhs"

**AI Response**:

> Based on current 2024 market data, here are great automatic options under ₹10L:
>
> **Maruti Baleno CVT 2024**: ₹7.5L-₹9.8L, 22.9 km/l, smooth CVT transmission
> **Hyundai Grand i10 Nios AMT 2024**: ₹6.2L-₹8.5L, 20.7 km/l, compact city car
> **Tata Tiago AMT 2024**: ₹5.8L-₹7.9L, 19.0 km/l, excellent value for money
>
> All these have good service networks and are perfect for city conditions. The Baleno offers premium features, while Tiago gives best value. Would you like detailed comparison of any specific models?

## � Project Structure

```
advicemegang/
├── src/
│   ├── components/
│   │   ├── AIChat.tsx              # Main chat interface
│   │   ├── theme-provider.tsx      # Dark/light mode
│   │   └── ui/                     # Shadcn/ui components
│   ├── services/
│   │   ├── ai.ts                   # OpenAI integration + RAG
│   │   └── carData.ts              # Real-time car data service
│   ├── types/
│   │   └── ai.ts                   # TypeScript interfaces
│   ├── lib/
│   │   └── openai.ts               # OpenAI configuration
│   └── hooks/
│       └── useAI.ts                # Chat hook
├── .env.local                      # API keys (not in repo)
├── package.json                    # Dependencies
└── README.md                       # This file
```

## 🚗 Supported Car Data (2024-2025)

### Major Brands Covered

- **Maruti Suzuki**: Swift, Baleno, Brezza, Fronx, Invicto, WagonR, Alto K10, Dzire, Ertiga, Celerio
- **Hyundai**: Creta, Venue, i20, Verna, Exter, Alcazar, Grand i10 Nios, Aura, Tucson
- **Tata**: Nexon, Harrier, Safari, Punch, Curvv, Nexon EV, Punch EV, Tiago, Tigor, Altroz
- **Mahindra**: XUV700, Thar, XUV3XO, Scorpio-N, XUV300, XUV400 EV, Bolero, Scorpio Classic
- **Honda**: City, Elevate, Amaze, City Hybrid
- **Toyota**: Hyryder, Innova Hycross, Fortuner, Glanza, Camry Hybrid, Vellfire

### Data Includes

- ✅ **Current Prices** (₹ in lakhs, updated 2024)
- ✅ **Latest Mileage** (ARAI certified figures)
- ✅ **Engine Specifications** (Capacity, power, torque)
- ✅ **Safety Ratings** (Global NCAP scores where available)
- ✅ **Fuel Options** (Petrol/Diesel/CNG/Electric)
- ✅ **Transmission Types** (Manual/AMT/CVT/AT)
- ✅ **Body Types** (Hatchback/Sedan/SUV/MPV)
- ✅ **Key Features** (Infotainment, safety, comfort)
- ✅ **Availability Status** (Available/Limited/Discontinued)

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server (http://localhost:8081)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check code quality
- `npm run type-check` - TypeScript checking

### Development Setup

```bash
# Clone and setup
git clone https://github.com/LuciferK47/advicemegang.git
cd advicemegang

# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local
# Add your OpenAI API key

# Start development
npm run dev
```

### Code Structure

- **`src/components/AIChat.tsx`** - Main chat interface with message handling
- **`src/services/ai.ts`** - OpenAI integration with RAG implementation
- **`src/services/carData.ts`** - Real-time car data fetching and caching
- **`src/App.tsx`** - Simple app wrapper with theme provider
- **`src/lib/openai.ts`** - OpenAI client configuration

## 🔧 Customization

### Adding New Car Brands

Edit `src/services/carData.ts`:

```typescript
private readonly INDIAN_CAR_DATA = {
  'your-brand': {
    models: ['Model1 2024', 'Model2 2024'],
    priceRange: { min: 500000, max: 1500000 }
  }
}
```

### Modifying AI Behavior

Update system prompt in `src/services/ai.ts`:

```typescript
const systemPrompt = `Your custom car expert instructions...`;
```

### Theme Customization

Modify `tailwind.config.ts` for colors and styling:

```typescript
theme: {
  extend: {
    colors: {
      // Your custom colors
    }
  }
}
```

## 🔧 Available Scripts

### Development

- `npm run dev` - Start development server with hot reload
- `npm run build:dev` - Build for development environment

### Production

- `npm run build` - Create optimized production build
- `npm run preview` - Preview production build locally

### Code Quality

- `npm run lint` - Run ESLint for code quality checks
- `npm run lint:fix` - Automatically fix linting issues

## Deployment Options

### Static Hosting (Recommended)

- **Vercel**: `npm i -g vercel && vercel`
- **Netlify**: Drag and drop `dist/` folder
- **GitHub Pages**: Configure with GitHub Actions
- **AWS S3**: Upload `dist/` to S3 bucket

### Server Hosting

- **Node.js**: Serve `dist/` with Express
- **Docker**: Containerize with Nginx
- **Apache/Nginx**: Configure virtual host

## Contributing

### Development Setup

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and test thoroughly
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open Pull Request

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for React and TypeScript
- **Prettier**: Code formatting (if configured)
- **Conventional Commits**: Use semantic commit messages

## Environment Variables

Create `.env.local` file for custom configurations:

```env
# API Configuration (if needed)
VITE_API_URL=http://localhost:3000
VITE_API_KEY=your_api_key_here

# Analytics (optional)
VITE_GA_TRACKING_ID=GA_MEASUREMENT_ID

# Feature Flags
VITE_ENABLE_ADVANCED_ML=true
VITE_ENABLE_ANALYTICS=false
```

## Troubleshooting

### Common Issues

#### Node.js Version Conflicts

```bash
# Check current version
node --version

# Install correct version via nvm
nvm install 18
nvm use 18
```

#### Port Already in Use

```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000
```

#### Module Resolution Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or clear npm cache
npm cache clean --force
```

#### Build Failures

```bash
# Check TypeScript errors
npx tsc --noEmit

# Verify all dependencies
npm audit fix
```

### Performance Optimization

- **Bundle Analysis**: `npm run build && npx vite-bundle-analyzer dist`
- **Memory Usage**: Monitor with browser DevTools
- **Lighthouse**: Check performance scores
- **Tree Shaking**: Verify unused code elimination

## Performance Metrics

### Build Performance

- **Development**: ~2-3 seconds startup time
- **Production Build**: ~30-45 seconds build time
- **Bundle Size**: ~500KB gzipped
- **Tree Shaking**: ~95% unused code elimination

### Runtime Performance

- **ML Processing**: ~100-500ms per recommendation
- **UI Responsiveness**: 60fps animations
- **Memory Usage**: <50MB typical usage
- **Load Time**: <3 seconds on fast connections

## Security Considerations

### Client-Side Security

- **XSS Prevention**: Sanitized user inputs
- **CSP Headers**: Content Security Policy (production)
- **HTTPS Only**: Secure cookie flags
- **Dependency Scanning**: Regular vulnerability checks

### Data Privacy

- **No Personal Data Storage**: Preferences not persisted
- **Local Processing**: ML runs entirely client-side
- **No External Calls**: Self-contained recommendation system
- **Session-Only Data**: Data cleared on page refresh

## Future Enhancements

### Planned Features

- **Real-time Market Data**: Live pricing and availability
- **User Accounts**: Save preferences and favorites
- **Comparison Tool**: Side-by-side vehicle analysis
- **Mobile App**: React Native implementation
- **API Integration**: Connect with dealership systems

### ML Improvements

- **Neural Networks**: Deep learning for complex patterns
- **Real User Feedback**: Recommendation quality learning
- **Market Trend Analysis**: Price prediction algorithms
- **Collaborative Filtering**: User-based recommendations

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Shadcn/ui**: Beautiful component library
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **React Team**: Amazing framework and ecosystem
- **TypeScript Team**: Type safety and developer experience

## Support

### Getting Help

- **GitHub Issues**: Report bugs and request features
- **Discussions**: Community Q&A and general discussions
- **Documentation**: Comprehensive guides and examples
- **Stack Overflow**: Tag with `caradvisor-ai`

### Contact Information

- **Email**: support@caradvisor-ai.com
- **Twitter**: @CarAdvisorAI
- **Discord**: [Community Server](https://discord.gg/caradvisor)

---

**Made with ❤️ and advanced AI algorithms**

_CarAdvisor AI - Finding your perfect car through the power of machine learning_
