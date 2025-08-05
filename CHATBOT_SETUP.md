# Neptune AI Chatbot Setup Guide

## Overview
The Neptune AI chatbot feature has been implemented with a fully functional chat interface that communicates with your existing API endpoint. The frontend sends requests to the `/query` endpoint and displays responses in a modern chat interface.

## Features Implemented

### Frontend Chat Interface
- ✅ Real-time chat interface with message history
- ✅ Loading states and error handling
- ✅ Auto-scroll to latest messages
- ✅ Timestamp display for messages
- ✅ Responsive design with shadcn/ui components

### API Integration
- ✅ TypeScript interfaces for request/response
- ✅ Error handling and toast notifications
- ✅ Health check endpoint support
- ✅ Configurable API base URL

## Configuration

### 1. Update API Endpoint
Edit `src/services/chatbotApi.ts` and update the `API_BASE_URL` constant:

```typescript
const API_BASE_URL = 'http://your-api-domain:port'; // Replace with your actual API URL
```

### 2. API Endpoint Requirements
Your API should implement the following endpoint:

**POST** `/query`
- **Request Body:**
  ```json
  {
    "query": "Show me the top 5 influencers by total views",
    "model": "gpt-4o"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "query": "Show me the top 5 influencers by total views",
    "result": "Based on the data from the Neptune graph database...",
    "model_used": "gpt-4o"
  }
  ```

### 3. Optional Health Check Endpoint
**GET** `/health`
- **Response:**
  ```json
  {
    "status": "ok",
    "message": "Chatbot API is running"
  }
  ```

## Usage

### Starting the Frontend
```bash
npm run dev
```

The Neptune AI chatbot is accessible in the "Neptune AI" tab of the Influencer Dashboard.

### Testing the Chatbot
1. Navigate to the Neptune AI tab
2. Type your query in the input field
3. Press Enter or click the Send button
4. View the AI response with timestamp and model information

### Example Queries
- "Show me the top 5 influencers by total views"
- "What's the average engagement rate?"
- "Which campaigns performed best?"
- "Show me revenue and ROAS data"

## Error Handling
The chatbot includes comprehensive error handling:
- Network errors are displayed as user-friendly messages
- Loading states prevent multiple simultaneous requests
- Toast notifications for API errors
- Graceful fallback for missing API responses

## Customization

### Styling
The chat interface uses Tailwind CSS classes and can be customized by modifying:
- `src/components/ChatBot.tsx` - Main chat interface
- `src/index.css` - Global styles

### Message Persistence
Currently, messages are stored in component state and reset on page refresh. To add persistence:
1. Implement localStorage or database storage
2. Add message persistence logic in `ChatBot.tsx`
3. Consider adding conversation management features

## Troubleshooting

### Common Issues
1. **API Connection Error**: Check if your API server is running and the URL is correct
2. **CORS Errors**: Ensure your API allows requests from the frontend domain
3. **Empty Responses**: Verify your API returns the expected response format

### Debug Mode
Enable browser developer tools to see:
- Network requests to the API
- Console logs for debugging
- Error messages and stack traces

## Next Steps
- Integrate with actual Neptune database queries
- Add conversation history persistence
- Implement user authentication
- Add file upload capabilities for data analysis
- Create custom prompt templates for specific use cases 