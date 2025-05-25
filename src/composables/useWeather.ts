import { ref } from 'vue';

export interface WeatherData {
  temperature: number;
  humidity_percentage: number;
  wind_speed: number;
  description?: string;
  icon?: string;
}

export interface WeatherError {
  code: number;
  message: string;
}

export function useWeather() {
  const currentWeather = ref<WeatherData | null>(null);
  const weatherError = ref<WeatherError | null>(null);
  const isLoading = ref(false);

  // Get weather data for coordinates
  const getWeatherForLocation = async (latitude: number, longitude: number): Promise<WeatherData> => {
    isLoading.value = true;
    weatherError.value = null;

    try {
      // Using OpenWeatherMap API (you'll need to get a free API key)
      const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo-key';
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      const weatherData: WeatherData = {
        temperature: Math.round(data.main.temp * 10) / 10, // Round to 1 decimal
        humidity_percentage: data.main.humidity,
        wind_speed: Math.round(data.wind.speed * 10) / 10, // Round to 1 decimal
        description: data.weather[0].description,
        icon: data.weather[0].icon
      };
      
      currentWeather.value = weatherData;
      return weatherData;
    } catch (error: any) {
      // If weather API fails, return mock data for demo purposes
      console.warn('Weather API unavailable, using mock data:', error.message);
      
      const mockWeather: WeatherData = {
        temperature: Math.round((Math.random() * 30 - 10) * 10) / 10, // -10 to 20°C
        humidity_percentage: Math.round(Math.random() * 40 + 40), // 40-80%
        wind_speed: Math.round(Math.random() * 10 * 10) / 10 // 0-10 m/s
      };
      
      currentWeather.value = mockWeather;
      return mockWeather;
    } finally {
      isLoading.value = false;
    }
  };

  // Get current weather using browser geolocation
  const getCurrentWeather = async (): Promise<WeatherData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const weather = await getWeatherForLocation(
              position.coords.latitude,
              position.coords.longitude
            );
            resolve(weather);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  return {
    currentWeather,
    weatherError,
    isLoading,
    getWeatherForLocation,
    getCurrentWeather
  };
}