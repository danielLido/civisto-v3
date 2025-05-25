// Validation script for ChatReportPage implementation
// This script validates the data accuracy and feature functionality

// Function to validate geolocation data
function validateGeolocation(reportData) {
  console.log("Validating geolocation data...");
  
  // Check if geo data exists and has required fields
  if (!reportData.geo) {
    console.error("FAIL: Missing geo object");
    return false;
  }
  
  // Check required geo fields
  const requiredGeoFields = ['lat', 'lng', 'city', 'street'];
  const missingFields = requiredGeoFields.filter(field => 
    reportData.geo[field] === undefined || reportData.geo[field] === null
  );
  
  if (missingFields.length > 0) {
    console.error(`FAIL: Missing geo fields: ${missingFields.join(', ')}`);
    return false;
  }
  
  // Validate latitude and longitude ranges
  if (reportData.geo.lat < -90 || reportData.geo.lat > 90) {
    console.error(`FAIL: Invalid latitude value: ${reportData.geo.lat}`);
    return false;
  }
  
  if (reportData.geo.lng < -180 || reportData.geo.lng > 180) {
    console.error(`FAIL: Invalid longitude value: ${reportData.geo.lng}`);
    return false;
  }
  
  console.log("PASS: Geolocation data is valid");
  return true;
}

// Function to validate weather data
function validateWeather(reportData) {
  console.log("Validating weather data...");
  
  // Check if weather data exists and has required fields
  if (!reportData.weather) {
    console.error("FAIL: Missing weather object");
    return false;
  }
  
  // Check required weather fields
  const requiredWeatherFields = ['temperature', 'humidity_percentage', 'wind_speed'];
  const missingFields = requiredWeatherFields.filter(field => 
    reportData.weather[field] === undefined || reportData.weather[field] === null
  );
  
  if (missingFields.length > 0) {
    console.error(`FAIL: Missing weather fields: ${missingFields.join(', ')}`);
    return false;
  }
  
  // Validate weather data ranges
  if (reportData.weather.humidity_percentage < 0 || reportData.weather.humidity_percentage > 100) {
    console.error(`FAIL: Invalid humidity value: ${reportData.weather.humidity_percentage}`);
    return false;
  }
  
  if (reportData.weather.wind_speed < 0) {
    console.error(`FAIL: Invalid wind speed value: ${reportData.weather.wind_speed}`);
    return false;
  }
  
  console.log("PASS: Weather data is valid");
  return true;
}

// Function to validate comments
function validateComments(reportData) {
  console.log("Validating comments...");
  
  // Check if comments array exists
  if (!Array.isArray(reportData.comments)) {
    console.error("FAIL: Comments is not an array");
    return false;
  }
  
  // Check each comment for required fields
  for (let i = 0; i < reportData.comments.length; i++) {
    const comment = reportData.comments[i];
    
    // Check required comment fields
    const requiredCommentFields = ['who', 'who_type', 'text'];
    const missingFields = requiredCommentFields.filter(field => 
      comment[field] === undefined || comment[field] === null || comment[field] === ''
    );
    
    if (missingFields.length > 0) {
      console.error(`FAIL: Comment ${i} missing fields: ${missingFields.join(', ')}`);
      return false;
    }
    
    // Validate who_type values
    if (!['user', 'ai'].includes(comment.who_type)) {
      console.error(`FAIL: Comment ${i} has invalid who_type: ${comment.who_type}`);
      return false;
    }
  }
  
  console.log("PASS: Comments are valid");
  return true;
}

// Function to validate categories
function validateCategories(reportData) {
  console.log("Validating categories...");
  
  // Check if categories array exists
  if (!Array.isArray(reportData.categories)) {
    console.error("FAIL: Categories is not an array");
    return false;
  }
  
  // Valid category values
  const validCategories = [
    'traffic', 'infrastructure', 'environment', 'safety', 
    'utilities', 'public_transport', 'waste_management', 'street_lighting'
  ];
  
  // Check each category is valid
  for (let i = 0; i < reportData.categories.length; i++) {
    const category = reportData.categories[i];
    
    if (!validCategories.includes(category)) {
      console.error(`FAIL: Invalid category: ${category}`);
      return false;
    }
  }
  
  console.log("PASS: Categories are valid");
  return true;
}

// Function to validate the entire report data structure
function validateReportData(reportData) {
  console.log("=== VALIDATING REPORT DATA STRUCTURE ===");
  
  // Check if reportData exists
  if (!reportData) {
    console.error("FAIL: Report data is missing");
    return false;
  }
  
  // Check required top-level fields
  const requiredFields = ['user_id', 'geo', 'weather', 'categories', 'comments'];
  const missingFields = requiredFields.filter(field => 
    reportData[field] === undefined || reportData[field] === null
  );
  
  if (missingFields.length > 0) {
    console.error(`FAIL: Missing top-level fields: ${missingFields.join(', ')}`);
    return false;
  }
  
  // Validate each section
  const geoValid = validateGeolocation(reportData);
  const weatherValid = validateWeather(reportData);
  const commentsValid = validateComments(reportData);
  const categoriesValid = validateCategories(reportData);
  
  // Overall validation result
  const isValid = geoValid && weatherValid && commentsValid && categoriesValid;
  
  console.log(`=== VALIDATION ${isValid ? 'PASSED' : 'FAILED'} ===`);
  return isValid;
}

// Example usage with mock data
const mockReportData = {
  user_id: "123e4567-e89b-12d3-a456-426614174000",
  geo: {
    lat: 48.8566,
    lng: 2.3522,
    city: "Paris",
    street: "Champs-Élysées"
  },
  weather: {
    temperature: -18.5,
    humidity_percentage: 60,
    wind_speed: 5.2
  },
  categories: ["traffic"],
  comments: [
    {
      who: "user123",
      who_type: "user",
      text: "It is very slow"
    },
    {
      who: "ai-assistant",
      who_type: "ai",
      text: "The issue is related to slow traffic on Champs-Élysées, Paris due to cold weather conditions."
    }
  ]
};

// Run validation
validateReportData(mockReportData);
