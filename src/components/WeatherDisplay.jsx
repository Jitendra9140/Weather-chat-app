import React from 'react';
import { Card, CardContent } from './ui/card';

/**
 * WeatherDisplay component for showing weather information in a clean format
 * @param {Object} props - Component props
 * @param {Object} props.weatherData - Weather data object containing temperature, feelsLike, humidity, etc.
 */
const WeatherDisplay = ({ weatherData }) => {
  if (!weatherData) return null;
  
  const {
    temperature,
    feelsLike,
    humidity,
    windSpeed,
    windGust,
    conditions,
    location
  } = weatherData;

  return (
    <Card className="bg-blue-100 border-none overflow-hidden mb-3 w-full max-w-[250px] rounded-lg">
      <CardContent className="p-4">
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-base font-semibold text-blue-800">
              {location}
            </h3>
            <div className="text-sm text-blue-600">
              {conditions}
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="mb-2">
              <div className="text-3xl font-bold text-blue-900">
                {temperature}°C
              </div>
              <div className="text-xs text-blue-600">
                Feels like: <br/>{feelsLike}°C
              </div>
            </div>
            
            <div className="text-sm">
              <div className="flex justify-between">
                <div className="text-blue-700">Humidity:</div>
                <div className="text-blue-800">{humidity}%</div>
              </div>
              
              <div className="flex justify-between">
                <div className="text-blue-700">Wind:</div>
                <div className="text-blue-800">{windSpeed} km/h</div>
              </div>
              
              {windGust && (
                <div className="flex justify-between">
                  <div className="text-blue-700">Gusts:</div>
                  <div className="text-blue-800">{windGust} km/h</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherDisplay;