import os
import logging
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY', 'your-openrouter-api-key-here')

app = FastAPI(title="Multi-Agent Platform API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, including the frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    prompt: str

# Define different agent personalities
AGENT_PROMPTS = {
    "greeting": "You are a friendly greeting agent. Respond warmly and briefly to greetings. Keep responses under 50 words.",
    "data": "You are a data analysis agent. Help with data queries, analytics, and insights. Be concise and technical.",
    "project": "You are a project management agent. Help with project planning, timelines, and coordination. Be organized and practical.",
    "general": "You are a helpful AI assistant. Provide clear, concise answers to general questions."
}

def classify_request(prompt: str) -> str:
    """Classify the type of request to determine which agent should handle it."""
    prompt_lower = prompt.lower()
    
    # Greeting patterns
    if any(word in prompt_lower for word in ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening']):
        return "greeting"
    
    # Data-related patterns
    if any(word in prompt_lower for word in ['data', 'analytics', 'report', 'statistics', 'metrics', 'dashboard']):
        return "data"
    
    # Project-related patterns
    if any(word in prompt_lower for word in ['project', 'timeline', 'deadline', 'task', 'milestone', 'plan']):
        return "project"
    
    # Default to general
    return "general"

def call_openrouter(prompt: str, system_prompt: str) -> str:
    """Call OpenRouter API with the given prompt and system prompt."""
    try:
        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }
        data = {
            "model": "nousresearch/nous-hermes-2-mixtral-8x7b-dpo",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ]
        }
        
        response = requests.post(url, headers=headers, json=data, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        return result["choices"][0]["message"]["content"]
        
    except requests.exceptions.RequestException as e:
        logger.error(f"OpenRouter API error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get response from AI service")
    except (KeyError, IndexError) as e:
        logger.error(f"Unexpected response format: {e}")
        raise HTTPException(status_code=500, detail="Unexpected response format from AI service")

@app.get("/")
async def root():
    return {"message": "Multi-Agent Platform API is running!"}

@app.post("/invoke_agent")
async def invoke_agent(request: ChatRequest):
    """Main endpoint that routes requests to appropriate agents."""
    try:
        logger.info(f"Received request: {request.prompt}")
        
        # Classify the request
        agent_type = classify_request(request.prompt)
        logger.info(f"Classified as {agent_type} agent")
        
        # Get the appropriate system prompt
        system_prompt = AGENT_PROMPTS[agent_type]
        
        # Call OpenRouter with the classified agent
        response = call_openrouter(request.prompt, system_prompt)
        
        logger.info(f"Agent {agent_type} responded successfully")
        return {"response": response}
        
    except Exception as e:
        logger.error(f"Error in invoke_agent: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "multi-agent-platform"}

@app.get("/debug-key")
async def debug_key():
    """Temporarily endpoint to debug the API key."""
    key = os.getenv('OPENROUTER_API_KEY', '')
    if len(key) > 10:
        return {
            "start_of_key": key[:6],
            "end_of_key": key[-4:],
            "key_length": len(key)
        }
    return {"error": "API key not found or too short."}

if __name__ == "__main__":
    import uvicorn
    
    if OPENROUTER_API_KEY == 'your-openrouter-api-key-here':
        logger.warning("OPENROUTER_API_KEY not set. Please set it in your environment variables.")
        logger.info("You can get a free API key from https://openrouter.ai/")
    
    logger.info("Starting Multi-Agent Platform API...")
    uvicorn.run(app, host="0.0.0.0", port=8009) 