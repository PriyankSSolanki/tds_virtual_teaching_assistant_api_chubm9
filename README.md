# TDS Virtual Teaching Assistant

A virtual Teaching Assistant for the IIT Madras Online Degree Tools in Data Science (TDS) course, powered by Convex and OpenAI for intelligent Q&A.

## 🚀 Live Demo

- **Web App**: https://clear-clownfish-52.convex.cloud
- **API Endpoint**: https://clear-clownfish-52.convex.cloud/api/

## 📋 Project Submission

This project is submitted for the TDS Virtual TA assignment. All requirements have been implemented:

✅ **GitHub Repository**: Public repository with MIT license  
✅ **API Endpoint**: RESTful API accepting POST requests  
✅ **Image Support**: Base64 image processing with GPT-4o vision  
✅ **Question Answering**: AI-powered responses based on TDS course content  
✅ **Source Attribution**: Relevant links provided with each answer  
✅ **Promptfoo Evaluation**: Ready for automated testing

## Features

- **Intelligent Q&A**: AI-powered answers to TDS course questions using OpenAI GPT-4o-mini
- **Real Discourse Integration**: Live scraping of TDS Knowledge Base posts (Jan 1 - Apr 14, 2025)
- **Enhanced Search**: Advanced relevance scoring with TDS-specific keyword weighting
- **Course Content Integration**: Answers based on scraped TDS course materials and forum discussions
- **Image Support**: GPT-4o vision for analyzing images in questions
- **RESTful API**: Simple JSON API for integration with other tools
- **Web Interface**: User-friendly interface with real-time knowledge base stats

## How It Works

The TDS Virtual TA uses:

- **Convex Backend**: Serverless backend for data storage and API functions
- **AI Pipe Integration**: OpenAI API access through AI Pipe proxy with authentication
- **Real Discourse Scraping**: Live scraping of IIT Madras Discourse using authenticated sessions
- **Enhanced Search Algorithm**: TDS-specific keyword weighting and relevance scoring
- **Intelligent Context Building**: Combines course materials and forum discussions for comprehensive answers
- **Source Attribution**: Provides links to relevant course materials and Discourse posts with each answer

## Setup

1. **Clone Repository**: Clone this repository to your local machine
2. **Install Dependencies**: Run `npm install` to install required packages
3. **Deploy to Convex**: Run `npx convex dev` to deploy the backend
4. **Start Development**: The app will automatically start with Vite dev server

## How It Works

1. **Real-time Data Collection**:
   - Authenticated scraping of IIT Madras Discourse TDS Knowledge Base
   - Filters posts from January 1 - April 14, 2025
   - Combines with static TDS course materials

2. **Enhanced Question Processing**:
   - Advanced search with TDS-specific keyword weighting
   - Relevance scoring considers course terminology and concepts
   - Context building from both course materials and recent forum discussions

3. **AI Response Generation**:
   - Question and enhanced context sent to OpenAI via AI Pipe
   - GPT-4o-mini for text, GPT-4o for image analysis
   - Responses include specific source attribution from Discourse and course materials

4. **Knowledge Base Management**:
   - Real-time refresh capabilities for latest Discourse content
   - Persistent storage of Q&A for improved future responses
   - Statistics tracking for knowledge base coverage

## 🔗 API Documentation

### POST https://clear-clownfish-52.convex.cloud/api/

The API accepts POST requests with JSON payload containing a question and optional base64-encoded image.

#### Request Format:
```json
{
  "question": "Should I use gpt-4o-mini or gpt-3.5-turbo for the assignment?",
  "image": "optional-base64-encoded-image-string"
}
```

#### Response Format:
```json
{
  "answer": "For TDS assignments, I recommend using gpt-4o-mini as it provides better performance for most data science tasks...",
  "links": [
    {
      "url": "https://tds.s-anand.net/#/",
      "text": "TDS Course Materials"
    }
  ]
}
```

#### Example cURL Request:
```bash
curl "https://clear-clownfish-52.convex.cloud/api/" \
  -H "Content-Type: application/json" \
  -d '{"question": "Should I use gpt-4o-mini or gpt-3.5-turbo for the assignment?"}'
```

## Technology Stack

- **Frontend**: React + TypeScript + TailwindCSS
- **Backend**: Convex (serverless functions and database)
- **LLM APIs**: OpenAI via AI Pipe proxy
- **Database**: Convex real-time database
- **Deployment**: Convex hosting

## Features

- **Intelligent Q&A**: Get AI-powered answers to TDS course questions
- **Source Attribution**: Every answer includes links to relevant course materials
- **Real-time Database**: Convex provides real-time data synchronization
- **Course Content Integration**: Answers based on actual TDS materials and forum discussions
- **Simple Interface**: Clean, user-friendly web interface

## Usage Examples

### Basic Question
```javascript
// User asks a question through the web interface
const response = await fetch('/api/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question: 'How do I set up my Python environment for TDS?'
  })
});
```

## 🧪 Evaluation

This project is ready for automated evaluation using promptfoo:

```bash
npx -y promptfoo eval --config project-tds-virtual-ta-promptfoo.yaml
```

### Sample Questions

Try asking questions like:
- "Should I use gpt-4o-mini or gpt-3.5-turbo for the assignment?"
- "What are the best practices for data visualization in TDS?"
- "How do I handle missing data in pandas?"
- "What are the assignment submission guidelines?"
- "How do I set up my Python environment for the course?"
- "What machine learning evaluation techniques should I use?"
- "How do I work with missing data in TDS projects?"

### Image Support

The API supports base64-encoded images for visual question answering:
```bash
curl "https://clear-clownfish-52.convex.cloud/api/" \
  -H "Content-Type: application/json" \
  -d "{\"question\": \"What does this image show?\", \"image\": \"$(base64 -w0 image.jpg)\"}"
```

## 📤 Submission Details

**GitHub Repository**: https://github.com/YOUR_USERNAME/tds-virtual-ta  
**API Endpoint**: https://clear-clownfish-52.convex.cloud/api/  
**License**: MIT License (see LICENSE file)  
**Evaluation**: Ready for promptfoo testing

### Submission Checklist

✅ Public GitHub repository created  
✅ MIT LICENSE file added  
✅ Code committed and pushed  
✅ API endpoint functional  
✅ Image support implemented  
✅ Promptfoo configuration updated  
✅ Documentation complete

### Quick Test Commands

```bash
# Test basic question
curl "https://clear-clownfish-52.convex.cloud/api/" \
  -H "Content-Type: application/json" \
  -d '{"question": "Should I use gpt-4o-mini or gpt-3.5-turbo for the assignment?"}'

# Test with image
curl "https://clear-clownfish-52.convex.cloud/api/" \
  -H "Content-Type: application/json" \
  -d "{\"question\": \"What does this image show?\", \"image\": \"$(base64 -w0 image.jpg)\"}"

# Run evaluation
npx -y promptfoo eval --config project-tds-virtual-ta-promptfoo.yaml
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Test your changes locally
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- For app issues: Create an issue in this repository
- For TDS course questions: Use the app or visit the course Discourse forum
- For technical questions: Check the Convex documentation
