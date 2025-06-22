# Multi-Agent Platform

A modern, full-stack multi-agent platform built with React, TypeScript, and Python. This platform demonstrates intelligent agent orchestration using OpenRouter's AI services.

## Features

- **Modern React Dashboard**: Beautiful, responsive UI with real-time agent monitoring
- **Multi-Agent Architecture**: Intelligent request routing to specialized AI agents
- **Real-time Chat Interface**: Integrated AI chat with agent classification
- **Workflow Management**: Visual workflow builder and execution
- **Analytics Dashboard**: Comprehensive metrics and insights
- **User Management**: Complete user authentication and profile system

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation

### Backend
- **FastAPI** (Python) for the API server
- **OpenRouter** for AI services (GPT-3.5-turbo)
- **Uvicorn** as the ASGI server

### AI Integration
- **OpenRouter API** for cost-effective AI access
- **Multi-Agent Classification**: Automatically routes requests to specialized agents
- **Agent Types**: Greeting, Data Analysis, Project Management, and General Assistant

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- OpenRouter API key (free at https://openrouter.ai/)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project13
   ```

2. **Install frontend dependencies**
   ```bash
   cd project
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../google-adk-service
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   
   Create `google-adk-service/.env`:
   ```env
   OPENROUTER_API_KEY=your-openrouter-api-key-here
   ```
   
   Get your free API key from: https://openrouter.ai/

5. **Start the servers**

   **Terminal 1 - Backend:**
   ```bash
   cd google-adk-service
   python main.py
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   cd project
   npm run dev
   ```

6. **Open the application**
   
   Navigate to `http://localhost:5173` in your browser.

## Multi-Agent System

The platform implements an intelligent multi-agent system that automatically classifies user requests and routes them to specialized AI agents:

### Agent Types

1. **Greeting Agent**: Handles greetings and introductions
2. **Data Agent**: Specializes in data analysis and queries
3. **Project Agent**: Manages project planning and coordination
4. **General Agent**: Provides general assistance

### How It Works

1. User sends a message through the chat interface
2. The system classifies the request based on keywords
3. The appropriate agent (with specialized system prompt) processes the request
4. Response is returned through OpenRouter's GPT-3.5-turbo model

## Project Structure

```
project13/
├── project/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   └── context/       # React context providers
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── google-adk-service/     # Backend Python API
│   ├── main.py           # FastAPI application
│   ├── requirements.txt  # Python dependencies
│   └── .env             # Environment variables
└── README.md            # This file
```

## API Endpoints

- `GET /` - Health check
- `POST /invoke_agent` - Main chat endpoint
- `GET /health` - Service health status

## Development

### Frontend Development
```bash
cd project
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development
```bash
cd google-adk-service
python main.py       # Start development server
```

## Deployment

### Frontend
The React app can be deployed to any static hosting service (Vercel, Netlify, etc.)

### Backend
The FastAPI server can be deployed to:
- Railway
- Render
- Heroku
- Google Cloud Run
- AWS Lambda

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository. 