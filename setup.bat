@echo off
REM ADK Multi-Agent Platform Setup Script
REM For Windows

echo 🚀 Setting up ADK Multi-Agent Platform...
echo ==========================================

REM Check if Node.js is installed
echo [INFO] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo [INFO] Please install Node.js from https://nodejs.org/
    echo [INFO] After installation, run this script again.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [SUCCESS] Node.js found: %NODE_VERSION%
)

REM Check if npm is installed
echo [INFO] Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo [SUCCESS] npm found: %NPM_VERSION%
)

REM Check if Python is installed
echo [INFO] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed!
    echo [INFO] Please install Python 3.7+ from https://python.org/
    echo [INFO] After installation, run this script again.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
    echo [SUCCESS] Python found: %PYTHON_VERSION%
)

REM Check if pip is installed
echo [INFO] Checking pip installation...
pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] pip is not installed!
    echo [INFO] Please install pip and run this script again.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('pip --version') do set PIP_VERSION=%%i
    echo [SUCCESS] pip found: %PIP_VERSION%
)

REM Create .env file for backend if it doesn't exist
echo [INFO] Setting up environment variables...
if not exist "google-adk-service\.env" (
    (
        echo # Google Cloud Configuration
        echo GOOGLE_CLOUD_PROJECT=your-project-id
        echo GOOGLE_CLOUD_LOCATION=us-central1
        echo.
        echo # Backend Configuration
        echo PORT=8008
        echo HOST=0.0.0.0
        echo.
        echo # Frontend Configuration
        echo VITE_API_URL=http://localhost:8008
    ) > google-adk-service\.env
    echo [SUCCESS] Created .env file for backend
    echo [WARNING] Please update google-adk-service\.env with your Google Cloud credentials
) else (
    echo [SUCCESS] .env file already exists
)

REM Install frontend dependencies
echo [INFO] Installing frontend dependencies...
cd project
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
) else (
    echo [SUCCESS] Frontend dependencies installed successfully
)
cd ..

REM Install backend dependencies
echo [INFO] Installing backend dependencies...
cd google-adk-service
call pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
) else (
    echo [SUCCESS] Backend dependencies installed successfully
)
cd ..

REM Create start scripts
echo [INFO] Creating start scripts...

REM Create start-frontend.bat
(
    echo @echo off
    echo echo 🚀 Starting ADK Multi-Agent Platform Frontend...
    echo cd project
    echo npm run dev
) > start-frontend.bat

REM Create start-backend.bat
(
    echo @echo off
    echo echo 🚀 Starting ADK Multi-Agent Platform Backend...
    echo cd google-adk-service
    echo python main.py
) > start-backend.bat

REM Create start-all.bat
(
    echo @echo off
    echo echo 🚀 Starting ADK Multi-Agent Platform ^(Frontend + Backend^)...
    echo.
    echo REM Start backend in background
    echo echo Starting backend...
    echo cd google-adk-service
    echo start /B python main.py
    echo.
    echo REM Wait a moment for backend to start
    echo timeout /t 3 /nobreak ^>nul
    echo.
    echo REM Start frontend
    echo echo Starting frontend...
    echo cd ..\project
    echo start /B npm run dev
    echo.
    echo echo ✅ Platform started!
    echo echo Frontend: http://localhost:3000
    echo echo Backend: http://localhost:8008
    echo echo.
    echo echo Press any key to stop both services
    echo pause
) > start-all.bat

echo [SUCCESS] Start scripts created successfully

REM Create README for setup
(
    echo # ADK Multi-Agent Platform Setup
    echo.
    echo ## Quick Start
    echo.
    echo 1. **Run the setup script:**
    echo    ```cmd
    echo    setup.bat
    echo    ```
    echo.
    echo 2. **Update Google Cloud credentials:**
    echo    Edit `google-adk-service\.env` with your Google Cloud project details
    echo.
    echo 3. **Start the platform:**
    echo    ```cmd
    echo    REM Start both frontend and backend
    echo    start-all.bat
    echo    
    echo    REM Or start separately:
    echo    start-frontend.bat  REM Frontend only
    echo    start-backend.bat   REM Backend only
    echo    ```
    echo.
    echo ## Access the Platform
    echo.
    echo - **Frontend:** http://localhost:3000
    echo - **Backend API:** http://localhost:8008
    echo.
    echo ## Requirements
    echo.
    echo - Node.js 16+
    echo - Python 3.7+
    echo - Google Cloud account ^(for full functionality^)
    echo.
    echo ## Troubleshooting
    echo.
    echo - If you get port conflicts, change ports in the configuration files
    echo - If Google ADK is not available, the system will use mock agents
    echo - Check the console for any error messages
    echo.
    echo ## Support
    echo.
    echo For issues, check the console output and ensure all dependencies are installed correctly.
) > SETUP_README.md

echo [SUCCESS] Setup README created

echo.
echo 🎉 Setup completed successfully!
echo ==========================================
echo.
echo Next steps:
echo 1. Update google-adk-service\.env with your Google Cloud credentials
echo 2. Run 'start-all.bat' to start the platform
echo 3. Open http://localhost:3000 in your browser
echo.
echo For more information, see SETUP_README.md
echo.
echo [SUCCESS] ADK Multi-Agent Platform is ready to use!
pause 