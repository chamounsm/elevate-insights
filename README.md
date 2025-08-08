
# Influencer Analytics Dashboard

A comprehensive React-based dashboard for analyzing influencer marketing campaigns with advanced predictive analytics, performance tracking, and AI-powered insights.

## Features

### Core Analytics
- **Influencer Performance Tracking**: Monitor engagement rates, views, conversions, and ROI metrics
- **Campaign Management**: Track multiple campaigns with detailed post-level analytics
- **Financial Analytics**: Revenue tracking, ROAS analysis, and cost-per-engagement metrics
- **Real-time Filtering & Sorting**: Advanced controls for data exploration

### Predictive Analytics
- **Machine Learning Predictions**: LightGBM and Random Forest models for 1-month growth forecasting
- **Growth Potential Ranking**: Intelligent ranking system based on predicted engagement and view growth
- **Confidence Indicators**: Model agreement analysis for prediction reliability
- **Growth Categories**: Automated categorization (High Growth, Moderate Growth, Steady, Stable)

### AI-Powered Insights
- **Neptune AI Chatbot**: Natural language querying of influencer data
- **Intelligent Recommendations**: AI-driven insights for campaign optimization
- **Custom Query Support**: Ask questions like "Show me top performers" or "Which campaigns had best ROI"

### Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Mode**: Built-in theme switching
- **Interactive Charts**: Powered by Recharts for rich data visualization
- **Component-based Architecture**: Built with shadcn/ui and Radix UI primitives

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5 for fast development and optimized builds
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: shadcn/ui + Radix UI primitives
- **State Management**: TanStack Query for server state
- **Routing**: React Router v6
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Sonner for toast messages

## Project Structure

```
src/
├── components/
│   ├── ui/                     # Reusable UI components (shadcn/ui)
│   ├── ChatBot.tsx            # AI chatbot interface
│   ├── InfluencerDashboard.tsx # Main dashboard component
│   ├── InfluencerDetail.tsx   # Detailed influencer view
│   ├── InfluencerList.tsx     # Influencer listing with filters
│   └── PostPerformance.tsx    # Post-level analytics
├── data/
│   ├── campaigns/             # Campaign performance data
│   ├── financial/            # Financial metrics and ROI data
│   ├── predictions/          # ML model predictions
│   └── influencers/          # Influencer profile data
├── services/
│   └── chatbotApi.ts         # AI chatbot API integration
├── utils/
│   ├── dataTransformation.ts  # Data processing utilities
│   └── analyticsDataTransformation.ts # Analytics calculations
└── pages/
    ├── Index.tsx             # Home page
    └── NotFound.tsx          # 404 page
```

## Getting Started

### Prerequisites
- Node.js 18+ (recommend using [nvm](https://github.com/nvm-sh/nvm))
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd elevate-insights-feature-trending-icons-ranking
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## Data Structure

### Influencer Data
The dashboard processes data from multiple sources:

- **Campaign Data**: Post-level performance metrics including impressions, engagement, conversions
- **Financial Data**: Revenue, costs, ROAS, and profitability metrics
- **Predictive Data**: ML model outputs for growth forecasting

### Key Metrics
- **Engagement Rate**: Calculated from likes, comments, shares, and saves
- **ROAS**: Return on Ad Spend
- **CPM/CPE/CPA**: Cost per thousand impressions/engagement/acquisition
- **Growth Predictions**: 1-month ahead forecasts for views and engagement

## Predictive Analytics

The dashboard includes sophisticated ML-based predictions:

### Models Used
- **LightGBM**: Gradient boosting for efficiency and categorical feature handling
- **Random Forest**: Ensemble method for robust predictions

### Ranking Algorithm
```
Growth Score = Views Growth % + Engagement Growth % + Growth Percentile
```

### Growth Categories
- **High Growth Potential**: ≥75th percentile
- **Moderate Growth**: 50-75th percentile  
- **Steady Growth**: 25-50th percentile
- **Stable Performance**: <25th percentile

See [PREDICTIVE_METRICS_README.md](./PREDICTIVE_METRICS_README.md) for detailed documentation.

## AI Chatbot Setup

The Neptune AI chatbot enables natural language querying of your data.

### Configuration
1. Update the API endpoint in `src/services/chatbotApi.ts`:
   ```typescript
   const API_BASE_URL = 'http://your-api-domain:port';
   ```

2. Ensure your API implements the `/query` endpoint:
   ```json
   POST /query
   {
     "query": "Show me top 5 influencers by views",
     "model": "gpt-4o"
   }
   ```

See [CHATBOT_SETUP.md](./CHATBOT_SETUP.md) for complete setup instructions.

## Customization

### Theming
The dashboard supports custom theming through CSS variables in `src/index.css`. Modify the color palette, spacing, or typography to match your brand.

### Adding New Metrics
1. Update the data interfaces in `src/components/InfluencerDashboard.tsx`
2. Modify the data transformation functions in `src/utils/dataTransformation.ts`
3. Add new chart components as needed

### Extending Predictions
To add new prediction models:
1. Update the prediction data structure in `src/data/predictions/`
2. Modify the ranking algorithm in the data transformation utilities
3. Update the UI components to display new metrics

## Responsive Design

The dashboard is fully responsive and includes:
- Mobile-optimized navigation
- Collapsible sidebar on smaller screens
- Touch-friendly interactive elements
- Adaptive chart sizing

## Performance Optimization

- **Code Splitting**: Automatic route-based code splitting
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Vite's built-in optimizations
- **Lazy Loading**: Components loaded on demand

## Troubleshooting

### Common Issues

1. **Build Errors**: Ensure all dependencies are installed with `npm install`
2. **Data Loading Issues**: Check that JSON files in `src/data/` are valid
3. **API Connection**: Verify chatbot API endpoint configuration
4. **Styling Issues**: Clear browser cache and restart dev server

### Debug Mode
Enable browser developer tools to inspect:
- Network requests
- Console logs
- Component state
- Performance metrics

## Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Vercel**: Connect your Git repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **Custom Server**: Deploy the `dist` folder to any static hosting service

### Environment Variables
Create `.env` files for different environments:
```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_TITLE=Elevate Insights Dashboard
```

## Future Enhancements

- **Real-time Data Sync**: WebSocket integration for live updates
- **Advanced Filtering**: Date range pickers, multi-select filters
- **Export Functionality**: PDF reports, CSV data export
- **User Management**: Authentication and role-based access
- **Custom Dashboards**: User-configurable dashboard layouts
- **Integration APIs**: Connect with social media platforms and analytics tools

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is proprietary and confidential. All rights reserved.

## Support
- [Predictive Metrics Documentation](./PREDICTIVE_METRICS_README.md)
- [Chatbot Setup Guide](./CHATBOT_SETUP.md)

