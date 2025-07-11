# MongoDB Setup for Weather Chat Application

## Prerequisites

1. Install MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Install MongoDB Compass from [MongoDB Compass Download](https://www.mongodb.com/try/download/compass)

## Setting Up MongoDB

### Install MongoDB Community Server

1. Download the MongoDB Community Server installer for your operating system
2. Run the installer and follow the installation wizard
3. Choose "Complete" installation type
4. You can optionally install MongoDB Compass during this installation
5. Complete the installation

### Install MongoDB Compass (if not installed with MongoDB Server)

1. Download MongoDB Compass installer
2. Run the installer and follow the installation wizard
3. Complete the installation

## Connecting to MongoDB with Compass

1. Open MongoDB Compass
2. Use the following connection string to connect to your local MongoDB server:
   ```
   mongodb://localhost:27017/
   ```
3. Click "Connect"

## Creating the Weather Chat Database

1. In MongoDB Compass, click "Create Database"
2. Enter the following information:
   - Database Name: `weather-chat`
   - Collection Name: `users` (first collection)
3. Click "Create Database"

4. The database will be created with the `users` collection
5. Now create additional collections by clicking on the "weather-chat" database and then "Create Collection":
   - Create a collection named `chats`

## Schema Information

The application uses the following schemas:

### User Schema

```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date }
});
```

### Chat Schema

```javascript
const chatSchema = new mongoose.Schema({
  threadId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [
    {
      messageId: { type: String, required: true },
      role: { type: String, enum: ['user', 'agent', 'system', 'error'], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      weatherData: {
        temperature: Number,
        feelsLike: Number,
        humidity: Number,
        windSpeed: Number,
        windGust: Number,
        conditions: String,
        location: String
      }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

## Running the Application with MongoDB

1. Make sure MongoDB service is running on your system
2. Start the Weather Chat application using the provided start script
3. The application will automatically connect to the MongoDB database

## Troubleshooting

### MongoDB Connection Issues

If the application fails to connect to MongoDB, check the following:

1. Ensure MongoDB service is running
   - On Windows: Check Services app to see if MongoDB Server is running
   - On macOS/Linux: Run `sudo systemctl status mongodb` or `sudo service mongodb status`

2. Verify the connection string in `.env` file
   - The default connection string is `mongodb://localhost:27017/weather-chat`

3. Check MongoDB logs for any errors
   - Windows: Check the MongoDB log file in the MongoDB installation directory
   - macOS/Linux: Check `/var/log/mongodb/mongodb.log`

### Data Not Saving

If data is not being saved to the database:

1. Check the application logs for any errors
2. Verify that the schemas are correctly defined
3. Ensure that the required fields are being provided when creating documents

## Viewing Data in MongoDB Compass

1. Connect to your MongoDB server using MongoDB Compass
2. Navigate to the `weather-chat` database
3. Click on a collection (e.g., `users` or `chats`) to view its documents
4. Use the filter bar to search for specific documents
5. Click on a document to view its details