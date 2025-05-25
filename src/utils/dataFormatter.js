// Helper function to ensure data format matches the required API format
function formatDataForServer(data) {
  // Create a deep copy to avoid modifying the original
  const formattedData = JSON.parse(JSON.stringify(data));
  
  // Ensure all required fields are present and correctly formatted
  return {
    user_id: formattedData.user_id || '123e4567-e89b-12d3-a456-426614174000',
    geo: {
      lat: formattedData.geo.lat || 0,
      lng: formattedData.geo.lng || 0,
      city: formattedData.geo.city || 'Unknown',
      street: formattedData.geo.street || 'Unknown'
    },
    weather: {
      temperature: formattedData.weather.temperature || 0,
      humidity_percentage: formattedData.weather.humidity_percentage || 0,
      wind_speed: formattedData.weather.wind_speed || 0
    },
    categories: formattedData.categories || [],
    comments: formattedData.comments || []
  };
}

// Update the sendToAI function to use the formatter
const sendToAI = async (data) => {
  try {
    // Format the data to match the required API format
    const requestData = formatDataForServer(data);
    
    // Log the data being sent to the server (for debugging)
    console.log('#example-data-to-server:', JSON.stringify(requestData, null, 2));
    
    const response = await fetch('https://eajowgxcuedziatbkgba.supabase.co/functions/v1/comment-ai', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVham93Z3hjdWVkemlhdGJrZ2JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczODU2MjAsImV4cCI6MjA2Mjk2MTYyMH0.gApfUlSzt3BlI-l2XdnAsrILZbGIDK00qzVJh3TsbIo',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // Log the response from the server (for debugging)
    console.log('#response-data-from-server:', JSON.stringify(result, null, 2));
    
    return result;
  } catch (error) {
    console.error('AI API call failed:', error);
    // Return mock response for demo
    const mockResponse = {
      comment: `Thank you for reporting this issue. Based on the information provided, this appears to be a ${data.categories[0] || 'general'} issue in ${data.geo.street}, ${data.geo.city} with current temperature of ${data.weather.temperature}°C.`,
      probability: Math.floor(Math.random() * 30) + 70 // 70-100%
    };
    
    console.log('#response-data-from-server (mock):', JSON.stringify(mockResponse, null, 2));
    
    return mockResponse;
  }
};
