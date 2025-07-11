/**
 * Utility functions for parsing weather data from API responses
 */

/**
 * Parses weather data from the Mastra API response format
 * @param {string} responseText - The raw response text from the API
 * @returns {Object|null} - Parsed weather data object or null if parsing fails
 */
export const parseWeatherData = (responseText) => {
  try {
    // Look for the tool call result containing weather data
    const toolCallMatch = responseText.match(/a:\{"toolCallId":"[^"]+","result":(\{[^}]+\})\}/i);
    
    if (toolCallMatch && toolCallMatch[1]) {
      return JSON.parse(toolCallMatch[1]);
    }
    
    // Alternative format: Look for data after the 0: prefix
    const dataLines = responseText.match(/0:"([^"]+)"/g);
    if (dataLines && dataLines.length > 0) {
      // Extract the content from each line
      const content = dataLines
        .map(line => line.substring(3, line.length - 1))
        .join('');
      
      // Extract weather information using regex patterns
      const weatherData = {};
      
      // Extract location
      const locationMatch = content.match(/in ([^\s]+) is/i) || content.match(/weather in ([^:]+):/i) || content.match(/weather in ([^\n]+)/i);
      if (locationMatch) weatherData.location = locationMatch[1].trim();
      
      // Extract temperature
      const tempMatch = content.match(/Temperature:\s*([\d.]+)°C/i) || content.match(/([\d.]+)°C \(feels like/i);
      if (tempMatch) weatherData.temperature = parseFloat(tempMatch[1]);
      
      // Extract feels like
      const feelsLikeMatch = content.match(/feels like\s*([\d.]+)°C/i) || content.match(/\(feels like ([\d.]+)°C\)/i);
      if (feelsLikeMatch) weatherData.feelsLike = parseFloat(feelsLikeMatch[1]);
      
      // Extract humidity
      const humidityMatch = content.match(/Humidity:\s*([\d.]+)%/i) || content.match(/\*\*Humidity:\*\* ([\d.]+)%/i);
      if (humidityMatch) weatherData.humidity = parseFloat(humidityMatch[1]);
      
      // Extract wind speed
      const windSpeedMatch = content.match(/Wind Speed:\s*([\d.]+)\s*km\/h/i) || content.match(/\*\*Wind Speed:\*\* ([\d.]+)\s*km\/h/i);
      if (windSpeedMatch) weatherData.windSpeed = parseFloat(windSpeedMatch[1]);
      
      // Extract wind gusts
      const windGustMatch = content.match(/gusts up to\s*([\d.]+)\s*km\/h/i) || content.match(/gusts\s*([\d.]+)\s*km\/h/i) || content.match(/\*\*Wind Speed:\*\*[^\n]+ with gusts up to ([\d.]+)\s*km\/h/i);
      if (windGustMatch) weatherData.windGust = parseFloat(windGustMatch[1]);
      
      // Extract conditions
      const conditionsMatch = content.match(/Conditions:\s*([^\n]+)/i) || content.match(/\*\*Conditions:\*\* ([^\n]+)/i) || content.match(/conditions: ([^\n]+)/i);
      if (conditionsMatch) weatherData.conditions = conditionsMatch[1].trim();
      
      // Return the extracted data if we have at least some fields
      if (Object.keys(weatherData).length > 0) {
        return weatherData;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing weather data:', error);
    return null;
  }
};

/**
 * Formats a weather data object into a readable string
 * @param {Object} weatherData - The weather data object
 * @returns {string} - Formatted weather information string
 */
export const formatWeatherInfo = (weatherData) => {
  if (!weatherData) return '';
  
  const {
    temperature,
    feelsLike,
    humidity,
    windSpeed,
    windGust,
    conditions,
    location
  } = weatherData;
  
  let result = '';
  
  if (location) result += `Weather in ${location}:\n`;
  if (temperature) result += `- Temperature: ${temperature}°C`;
  if (feelsLike) result += `, feels like ${feelsLike}°C\n`;
  if (humidity) result += `- Humidity: ${humidity}%\n`;
  if (windSpeed) result += `- Wind Speed: ${windSpeed} km/h`;
  if (windGust) result += ` with gusts up to ${windGust} km/h\n`;
  if (conditions) result += `- Conditions: ${conditions}\n`;
  
  return result;
};