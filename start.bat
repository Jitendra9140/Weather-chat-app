@echo off
echo Starting Weather Chat Application...

echo Installing backend dependencies...
cd backend
npm install bcrypt jsonwebtoken
npm install

echo Starting backend server...
start cmd /k "npm run dev"

echo Installing frontend dependencies...
cd ..
npm install

echo Starting frontend server...
start cmd /k "npm run dev"

echo Weather Chat Application is now running!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Note: The application now includes authentication and connects to the Mastra Weather API.