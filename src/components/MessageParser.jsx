import React from 'react';
import WeatherDisplay from './WeatherDisplay';

/**
 * MessageParser component for parsing and displaying different types of message content
 * @param {Object} props - Component props
 * @param {string} props.content - The message content to parse
 * @param {Object} props.weatherData - Optional weather data object
 */
const MessageParser = ({ content, weatherData }) => {
  // Function to parse the raw message content
  const parseContent = (rawContent) => {
    if (!rawContent) return '';
    
    // Check if the content is in the format with 0: prefixes
    if (rawContent.includes('0:"')) {
      // Extract all the 0: prefixed content
      const matches = rawContent.match(/0:"([^"]+)"/g) || [];
      
      // Join the extracted content
      return matches
        .map(match => match.substring(3, match.length - 1))
        .join('')
        .trim();
    }
    
    // Remove any API response formatting
    let cleanContent = rawContent
      // Remove tool call IDs and other API artifacts
      .replace(/f:\{"messageId":"[^"]+"\}/g, '')
      .replace(/9:\{"toolCallId":"[^"]+","toolName":"[^"]+","args":\{[^}]+\}\}/g, '')
      .replace(/a:\{"toolCallId":"[^"]+","result":\{[^}]+\}\}/g, '')
      .replace(/e:\{"finishReason":"[^"]+","usage":\{[^}]+\}\}/g, '')
      // Clean up any remaining artifacts
      .replace(/\s+/g, ' ')
      .trim();
    
    return cleanContent;
  };

  // Function to check if a string is valid JSON
  const isJsonString = (str) => {
    if (!str || typeof str !== 'string') return false;
    
    try {
      if (str.trim().startsWith('{') || str.trim().startsWith('[')) {
        JSON.parse(str);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };
  
  // Function to format JSON content for display
  const formatJsonContent = (content) => {
    if (!content || !isJsonString(content)) return null;
    
    try {
      const jsonObj = JSON.parse(content);
      return (
        <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto font-mono text-sm whitespace-pre-wrap break-words">
          {JSON.stringify(jsonObj, null, 2)}
        </pre>
      );
    } catch (e) {
      return null;
    }
  };
  
  const parsedContent = parseContent(content);
  const jsonFormatted = formatJsonContent(parsedContent);
  
  return (
    <div className="message-content">
      {jsonFormatted ? (
        jsonFormatted
      ) : (
        <div className="whitespace-pre-wrap break-words">
          {parsedContent}
        </div>
      )}
      
      {weatherData && Object.keys(weatherData).length > 0 && <WeatherDisplay weatherData={weatherData} />}
    </div>
  );
};

export default MessageParser;