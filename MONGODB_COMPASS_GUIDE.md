# MongoDB Compass Guide for Weather Chat Application

## Introduction

This guide will help you use MongoDB Compass to view and manage the data stored in the Weather Chat application database. MongoDB Compass is a graphical user interface for MongoDB that allows you to visualize and interact with your data.

## Connecting to MongoDB

1. Open MongoDB Compass
2. Use the following connection string to connect to your MongoDB server:
   ```
   mongodb+srv://jitendrastudy9140:Jitendra%409140@technosavvy.jehwerb.mongodb.net/weather-chat
   ```
3. Click "Connect"

## Exploring the Database

Once connected, you'll see the `weather-chat` database in the left sidebar. Click on it to expand and see the collections:

- `users` - Contains user account information
- `chats` - Contains chat history and weather data

## Viewing User Data

1. Click on the `users` collection
2. You'll see a list of all registered users with their information:
   - `_id`: MongoDB's unique identifier
   - `name`: User's full name
   - `email`: User's email address (unique)
   - `password`: Hashed password (never displayed in plain text)
   - `createdAt`: Account creation timestamp
   - `lastLogin`: Last login timestamp

## Viewing Chat History and Weather Data

1. Click on the `chats` collection
2. You'll see a list of chat threads with the following structure:
   - `_id`: MongoDB's unique identifier
   - `threadId`: Chat thread identifier
   - `userId`: Reference to the user who owns this chat
   - `messages`: Array of messages in the chat
   - `createdAt`: Chat creation timestamp
   - `updatedAt`: Last update timestamp

3. Click on any chat document to expand it and see the detailed structure:

```json
{
  "_id": "ObjectId(...)",
  "threadId": "2",
  "userId": "ObjectId(...)",
  "messages": [
    {
      "messageId": "msg-user-1638271849000",
      "role": "user",
      "content": "What's the weather in Mumbai?",
      "timestamp": "2023-12-01T10:30:49.000Z"
    },
    {
      "messageId": "msg-agent-1638271850000",
      "role": "agent",
      "content": "The current weather in Mumbai is 27.5°C, but it feels like 32.3°C due to the high humidity of 87%. There are slight rain showers, and the wind is blowing at a speed of 13.2 km/h with gusts up to 21.2 km/h.",
      "timestamp": "2023-12-01T10:30:50.000Z",
      "weatherData": {
        "temperature": 27.5,
        "feelsLike": 32.3,
        "humidity": 87,
        "windSpeed": 13.2,
        "windGust": 21.2,
        "conditions": "Slight rain showers",
        "location": "Mumbai"
      }
    }
  ],
  "createdAt": "2023-12-01T10:30:49.000Z",
  "updatedAt": "2023-12-01T10:30:50.000Z"
}
```

## Filtering Data

MongoDB Compass provides powerful filtering capabilities:

1. Click on the "Filter" bar at the top of the collection view
2. Enter a query using MongoDB query syntax, for example:
   - Find chats for a specific location: `{"messages.weatherData.location": "Mumbai"}`
   - Find chats with high temperatures: `{"messages.weatherData.temperature": {$gt: 30}}`
   - Find chats from a specific user: `{"userId": ObjectId("user_id_here")}`

## Analyzing Weather Data

You can use MongoDB Compass's aggregation features to analyze weather data:

1. Click on the "Aggregations" tab
2. Create a pipeline to analyze data, for example:

```json
[
  {
    "$unwind": "$messages"
  },
  {
    "$match": {
      "messages.weatherData": {"$ne": null}
    }
  },
  {
    "$group": {
      "_id": "$messages.weatherData.location",
      "avgTemperature": {"$avg": "$messages.weatherData.temperature"},
      "avgHumidity": {"$avg": "$messages.weatherData.humidity"},
      "count": {"$sum": 1}
    }
  }
]
```

This will show average temperature and humidity by location.

## Schema Validation

The Weather Chat application uses the following MongoDB schemas:

### User Schema

```javascript
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
});
```

### Weather Data Schema

```javascript
const weatherDataSchema = new mongoose.Schema({
  temperature: {
    type: Number,
    required: true
  },
  feelsLike: {
    type: Number,
    required: true
  },
  humidity: {
    type: Number,
    required: true
  },
  windSpeed: {
    type: Number,
    required: true
  },
  windGust: {
    type: Number,
    required: true
  },
  conditions: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  }
});
```

### Message Schema

```javascript
const messageSchema = new mongoose.Schema({
  messageId: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'agent', 'system', 'error'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  weatherData: weatherDataSchema
});
```

### Chat Schema

```javascript
const chatSchema = new mongoose.Schema({
  threadId: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
```

## Troubleshooting

### Common Issues

1. **Connection Failed**: 
   - Verify that MongoDB service is running
   - Check if the connection string is correct
   - Ensure network connectivity to the MongoDB server

2. **Missing Data**:
   - Check if the application is properly saving data
   - Verify that the required fields are being provided
   - Check for errors in the application logs

3. **Schema Validation Errors**:
   - Ensure that the data being saved matches the schema
   - Check for required fields that might be missing
   - Verify data types match the schema definition

## Conclusion

MongoDB Compass provides a powerful interface for exploring and managing your Weather Chat application data. Use it to monitor user activity, analyze weather data patterns, and troubleshoot any data-related issues.