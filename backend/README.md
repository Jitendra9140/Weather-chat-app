# Weather Chat Backend

This is the backend service for the Weather Chat application. It provides an API to communicate with the weather agent service.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   WEATHER_API_ENDPOINT=https://brief-thousands-sunset-9fcb1c78-485f-4967-ac04-2759a8fa1462.mastra.cloud/api/agents/weatherAgent/stream
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Get Weather Information

- **URL**: `/api/weather`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "message": "What's the weather like today in Mumbai?",
    "threadId": "BVP123456" // Your college roll number
  }
  ```
- **Response**: Stream of text data from the weather agent

### Health Check

- **URL**: `/health`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "status": "ok",
    "message": "Server is running"
  }
  ```

## Project Structure

```
backend/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── routes/         # API routes
├── schemas/        # Data schemas
├── .env            # Environment variables
├── package.json    # Project dependencies
├── README.md       # Documentation
└── server.js       # Entry point
```