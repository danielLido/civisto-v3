// Test script for ChatReportPage API integration
// This script simulates API calls and validates responses

// Mock geolocation data
const mockGeolocation = {
  latitude: 48.8566,
  longitude: 2.3522,
  city: "Paris",
  street: "Champs-Élysées"
};

// Mock weather data
const mockWeather = {
  temperature: -18.5,
  humidity_percentage: 60,
  wind_speed: 5.2
};

// Mock user data
const mockUser = {
  id: "123e4567-e89b-12d3-a456-426614174000"
};

// Mock report data
const mockReportData = {
  user_id: mockUser.id,
  geo: {
    lat: mockGeolocation.latitude,
    lng: mockGeolocation.longitude,
    city: mockGeolocation.city,
    street: mockGeolocation.street
  },
  weather: mockWeather,
  categories: ["traffic"],
  comments: [
    {
      who: mockUser.id,
      who_type: "user",
      text: "It is very slow"
    }
  ]
};

// Test the formatter function
function testFormatter() {
  console.log("Testing data formatter...");
  
  // Import the formatter function
  const { formatDataForServer } = require('./dataFormatter');
  
  // Test with complete data
  const formattedComplete = formatDataForServer(mockReportData);
  console.log("Complete data test:", 
    JSON.stringify(formattedComplete) === JSON.stringify(mockReportData) ? "PASS" : "FAIL");
  
  // Test with missing data
  const incompleteData = {
    user_id: mockUser.id,
    geo: {
      lat: mockGeolocation.latitude,
      lng: mockGeolocation.longitude
      // Missing city and street
    },
    // Missing weather
    categories: [],
    comments: []
  };
  
  const formattedIncomplete = formatDataForServer(incompleteData);
  console.log("Incomplete data test:", 
    formattedIncomplete.geo.city === "Unknown" && 
    formattedIncomplete.geo.street === "Unknown" &&
    formattedIncomplete.weather.temperature === 0 ? "PASS" : "FAIL");
}

// Test the API call function
async function testApiCall() {
  console.log("Testing API call...");
  
  // Mock fetch function
  global.fetch = async (url, options) => {
    console.log("API URL:", url);
    console.log("Request headers:", options.headers);
    console.log("Request body:", options.body);
    
    // Simulate successful response
    return {
      ok: true,
      json: async () => ({
        comment: "The issue is related to slow traffic on Champs-Élysées, Paris due to cold weather conditions.",
        probability: 80
      })
    };
  };
  
  // Import the sendToAI function
  const { sendToAI } = require('./apiService');
  
  // Test API call
  try {
    const response = await sendToAI(mockReportData);
    console.log("API response:", response);
    console.log("API call test:", 
      response.comment && response.probability ? "PASS" : "FAIL");
  } catch (error) {
    console.error("API call test: FAIL", error);
  }
}

// Test error handling
async function testErrorHandling() {
  console.log("Testing error handling...");
  
  // Mock fetch function that fails
  global.fetch = async () => {
    throw new Error("Network error");
  };
  
  // Import the sendToAI function
  const { sendToAI } = require('./apiService');
  
  // Test error handling
  try {
    const response = await sendToAI(mockReportData);
    console.log("Mock response:", response);
    console.log("Error handling test:", 
      response.comment && response.probability ? "PASS" : "FAIL");
  } catch (error) {
    console.error("Error handling test: FAIL", error);
  }
}

// Run all tests
async function runTests() {
  console.log("=== STARTING API INTEGRATION TESTS ===");
  testFormatter();
  await testApiCall();
  await testErrorHandling();
  console.log("=== API INTEGRATION TESTS COMPLETE ===");
}

runTests();
