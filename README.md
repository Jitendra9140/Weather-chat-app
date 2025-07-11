# Weather Chat Application

A full-stack application that allows users to chat with a weather agent to get weather information for different locations.

## Project Structure

```
weather-chat/
├── backend/           # Backend server
│   ├── config/        # Configuration files
│   ├── controllers/   # Request handlers
│   ├── routes/        # API routes
│   ├── schemas/       # Data schemas
│   └── server.js      # Entry point
├── public/            # Static assets
└── src/               # Frontend React application
    ├── assets/        # Images and other assets
    ├── components/    # React components
    └── config.js      # Frontend configuration
```

## Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with:
   ```
   PORT=5000
   WEATHER_API_ENDPOINT=https://brief-thousands-sunset-9fcb1c78-485f-4967-ac04-2759a8fa1462.mastra.cloud/api/agents/weatherAgent/stream
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

## Frontend Setup

1. From the project root, install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## API Integration

The application integrates with the Weather Agent API:

- **Endpoint**: `https://brief-thousands-sunset-9fcb1c78-485f-4967-ac04-2759a8fa1462.mastra.cloud/api/agents/weatherAgent/stream`
- **Method**: `POST`
- **Headers**:
  ```
  Accept: */*
  Accept-Language: en-GB,en-US;q=0.9,en;q=0.8,fr;q=0.7
  Connection: keep-alive
  Content-Type: application/json
  x-mastra-dev-playground: true
  ```
- **Request Body**:
  ```json
  {
    "messages": [
      {
        "role": "user",
        "content": "What's the weather like today in Mumbai?"
      }
    ],
    "runId": "weatherAgent",
    "maxRetries": 2,
    "maxSteps": 5,
    "temperature": 0.5,
    "topP": 1,
    "runtimeContext": {},
    "threadId": "BVP123456",  // Replace with your college roll number
    "resourceId": "weatherAgent"
  }
  ```

## Features

- Real-time chat interface
- Streaming responses from the weather agent
- Responsive design with Tailwind CSS
- Error handling and loading states
