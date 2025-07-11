/**
 * Schema for weather API request
 */
export const createWeatherRequestSchema = (userMessage, threadId = '21141002') => {
  return {
    messages: [
      {
        role: 'user',
        content: userMessage
      }
    ],
    runId: 'weatherAgent',
    maxRetries: 2,
    maxSteps: 5,
    temperature: 0.5,
    topP: 1,
    runtimeContext: {},
    threadId: threadId, // College roll number
    resourceId: 'weatherAgent'
  };
};