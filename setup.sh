#!/bin/bash

# ADK Multi-Agent Platform Setup Script
# For Linux and macOS

echo "🚀 Setting up ADK Multi-Agent Platform..."
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
print_status "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed!"
    print_status "Please install Node.js from https://nodejs.org/"
    print_status "After installation, run this script again."
    exit 1
else
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
fi

# Check if npm is installed
print_status "Checking npm installation..."
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed!"
    exit 1
else
    NPM_VERSION=$(npm --version)
    print_success "npm found: $NPM_VERSION"
fi

# Check if Python is installed
print_status "Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        print_error "Python is not installed!"
        print_status "Please install Python 3.7+ from https://python.org/"
        print_status "After installation, run this script again."
        exit 1
    else
        PYTHON_CMD="python"
    fi
else
    PYTHON_CMD="python3"
fi

PYTHON_VERSION=$($PYTHON_CMD --version)
print_success "Python found: $PYTHON_VERSION"

# Check if pip is installed
print_status "Checking pip installation..."
if ! command -v pip3 &> /dev/null; then
    if ! command -v pip &> /dev/null; then
        print_error "pip is not installed!"
        print_status "Please install pip and run this script again."
        exit 1
    else
        PIP_CMD="pip"
    fi
else
    PIP_CMD="pip3"
fi

PIP_VERSION=$($PIP_CMD --version)
print_success "pip found: $PIP_VERSION"

# Create .env file for backend if it doesn't exist
print_status "Setting up environment variables..."
if [ ! -f "google-adk-service/.env" ]; then
    cat > google-adk-service/.env << EOF
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1

# Backend Configuration
PORT=8008
HOST=0.0.0.0

# Frontend Configuration
VITE_API_URL=http://localhost:8008
EOF
    print_success "Created .env file for backend"
    print_warning "Please update google-adk-service/.env with your Google Cloud credentials"
else
    print_success ".env file already exists"
fi

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd project
if npm install; then
    print_success "Frontend dependencies installed successfully"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi
cd ..

# Install backend dependencies
print_status "Installing backend dependencies..."
cd google-adk-service
if $PIP_CMD install -r requirements.txt; then
    print_success "Backend dependencies installed successfully"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi
cd ..

# Create start scripts
print_status "Creating start scripts..."

# Create start-frontend.sh
cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting ADK Multi-Agent Platform Frontend..."
cd project
npm run dev
EOF

# Create start-backend.sh
cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting ADK Multi-Agent Platform Backend..."
cd google-adk-service
python3 main.py
EOF

# Create start-all.sh
cat > start-all.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting ADK Multi-Agent Platform (Frontend + Backend)..."

# Start backend in background
echo "Starting backend..."
cd google-adk-service
python3 main.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting frontend..."
cd ../project
npm run dev &
FRONTEND_PID=$!

echo "✅ Platform started!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8008"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for user to stop
wait
EOF

# Make scripts executable
chmod +x start-frontend.sh
chmod +x start-backend.sh
chmod +x start-all.sh

print_success "Start scripts created successfully"

# Create README for setup
cat > SETUP_README.md << 'EOF'
# ADK Multi-Agent Platform Setup

## Quick Start

1. **Run the setup script:**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Update Google Cloud credentials:**
   Edit `google-adk-service/.env` with your Google Cloud project details

3. **Start the platform:**
   ```bash
   # Start both frontend and backend
   ./start-all.sh
   
   # Or start separately:
   ./start-frontend.sh  # Frontend only
   ./start-backend.sh   # Backend only
   ```

## Access the Platform

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8008

## Requirements

- Node.js 16+
- Python 3.7+
- Google Cloud account (for full functionality)

## Troubleshooting

- If you get port conflicts, change ports in the configuration files
- If Google ADK is not available, the system will use mock agents
- Check the console for any error messages

## Support

For issues, check the console output and ensure all dependencies are installed correctly.
EOF

print_success "Setup README created"

echo ""
echo "🎉 Setup completed successfully!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Update google-adk-service/.env with your Google Cloud credentials"
echo "2. Run './start-all.sh' to start the platform"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "For more information, see SETUP_README.md"
echo ""
print_success "ADK Multi-Agent Platform is ready to use!" 