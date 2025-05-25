import { defineComponent, ref, reactive, onMounted, nextTick, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButtons,
  IonButton,
  IonIcon,
  IonTextarea,
  IonImg
} from '@ionic/vue';
import { 
  arrowBack,
  paperPlaneOutline,
  imageOutline,
  locationOutline,
  closeOutline,
  checkmarkOutline,
  chevronForward
} from 'ionicons/icons';
import { useGeolocation } from '@/composables/useGeolocation';
import { useWeather } from '@/composables/useWeather';
import { useAuth } from '@/composables/useAuth';

export default function useChatReportPage() {
  const router = useRouter();
  const { getCurrentPosition, getAddressFromCoordinates, getDetailedAddress, getFullLocationData } = useGeolocation();
  const { getWeatherForLocation } = useWeather();
  const { user } = useAuth();

  // Reactive state
  const currentStep = ref(0);
  const showConfirmation = ref(false);
  const showOptions = ref(true);
  const isTyping = ref(false);
  const mapExpanded = ref(false);
  const userInput = ref('');
  const contentRef = ref();
  const chatContainer = ref();
  const messageInput = ref();
  const mapIframe = ref();

  // Report data structure matching the API format
  const reportData = reactive({
    user_id: '123e4567-e89b-12d3-a456-426614174000', // Default ID, will be updated if user is available
    geo: {
      lat: 0,
      lng: 0,
      city: 'Unknown',
      street: 'Unknown'
    },
    weather: {
      temperature: 0,
      humidity_percentage: 0,
      wind_speed: 0
    },
    categories: [],
    comments: [],
    location: 'Current Location',
    coordinates: '0.000°, 0.000°',
    hasPhotos: false
  });

  // Chat messages
  const messages = ref([]);

  // Category suggestions
  const categories = ref([
    { id: 'traffic', name: 'Traffic Issues' },
    { id: 'infrastructure', name: 'Infrastructure' },
    { id: 'environment', name: 'Environment' },
    { id: 'safety', name: 'Safety' },
    { id: 'utilities', name: 'Utilities' },
    { id: 'public_transport', name: 'Public Transport' },
    { id: 'waste_management', name: 'Waste Management' },
    { id: 'street_lighting', name: 'Street Lighting' }
  ]);

  // Current options for chat flow
  const currentOptions = ref([]);

  // Map source for location selection
  const mapSrc = computed(() => {
    const { lat, lng } = reportData.geo;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;
  });

  // Load chat history from localStorage
  const loadChatHistory = () => {
    try {
      const savedData = localStorage.getItem('civisto-chat-history');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData.messages && Array.isArray(parsedData.messages)) {
          messages.value = parsedData.messages;
        }
        if (parsedData.reportData) {
          // Only restore comments and categories to maintain fresh geo and weather data
          if (parsedData.reportData.comments) {
            reportData.comments = parsedData.reportData.comments;
          }
          if (parsedData.reportData.categories) {
            reportData.categories = parsedData.reportData.categories;
          }
        }
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  // Save chat history to localStorage
  const saveChatHistory = () => {
    try {
      const dataToSave = {
        messages: messages.value,
        reportData: {
          comments: reportData.comments,
          categories: reportData.categories
        }
      };
      localStorage.setItem('civisto-chat-history', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  };

  // Initialize location and weather data
  const initializeData = async () => {
    try {
      // Set user ID
      if (user.value) {
        reportData.user_id = user.value.id;
      }

      // Get detailed location data including city and street
      const fullLocation = await getFullLocationData();
      
      // Update geo data
      reportData.geo.lat = fullLocation.latitude;
      reportData.geo.lng = fullLocation.longitude;
      reportData.geo.city = fullLocation.city || 'Unknown';
      reportData.geo.street = fullLocation.street || 'Unknown';
      
      // Update display values
      reportData.coordinates = `${fullLocation.latitude.toFixed(4)}°, ${fullLocation.longitude.toFixed(4)}°`;
      reportData.location = fullLocation.address || `${reportData.geo.street}, ${reportData.geo.city}`;

      // Get weather data
      try {
        const weather = await getWeatherForLocation(fullLocation.latitude, fullLocation.longitude);
        reportData.weather = {
          temperature: weather.temperature,
          humidity_percentage: weather.humidity_percentage,
          wind_speed: weather.wind_speed
        };
      } catch (error) {
        console.warn('Failed to get weather:', error);
      }
    } catch (error) {
      console.error('Failed to initialize data:', error);
      // Attempt to get basic position if detailed location fails
      try {
        const position = await getCurrentPosition();
        reportData.geo.lat = position.latitude;
        reportData.geo.lng = position.longitude;
        reportData.coordinates = `${position.latitude.toFixed(4)}°, ${position.longitude.toFixed(4)}°`;
      } catch (fallbackError) {
        console.error('Fallback geolocation also failed:', fallbackError);
      }
    }
  };

  // Helper function to ensure data format matches the required API format
  const formatDataForServer = (data) => {
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
  };

  // Send message to AI API
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

  // Add message to chat
  const addMessage = (text, sender = 'assistant') => {
    messages.value.push({
      text,
      sender,
      timestamp: Date.now()
    });
    
    nextTick(() => {
      scrollToBottom();
      saveChatHistory(); // Save after adding a message
    });
  };

  // Add comment to report data
  const addComment = (text, whoType = 'user') => {
    const comment = {
      who: user.value?.id || 'anonymous',
      who_type: whoType,
      text: text
    };
    
    reportData.comments.push(comment);
    saveChatHistory(); // Save after adding a comment
    return comment;
  };

  // Send message and handle response
  const sendMessage = async () => {
    if (!userInput.value.trim()) return;

    const messageText = userInput.value.trim();
    userInput.value = '';

    // Add user message to chat
    addMessage(messageText, 'human');
    
    // Add comment to report data
    addComment(messageText, 'user');

    // Show typing indicator
    isTyping.value = true;
    showOptions.value = false;

    try {
      // Send to AI if we have enough data
      if (reportData.categories.length > 0) {
        const aiResponse = await sendToAI(reportData);
        
        // Add AI response to chat and report
        setTimeout(() => {
          isTyping.value = false;
          
          // Use the comment from the server response
          const responseText = aiResponse.comment || "Thank you for your report. We'll look into this issue.";
          
          addMessage(responseText, 'assistant');
          addComment(responseText, 'ai');

          // Check if we should show completion
          if (reportData.comments.length >= 3) {
            setTimeout(() => {
              showConfirmation.value = true;
            }, 1000);
          }
        }, 1500);
      } else {
        // If no category selected, provide options
        setTimeout(() => {
          isTyping.value = false;
          addMessage("I understand you'd like to report an issue. To help you better, could you select a category or describe what type of problem you're experiencing?", 'assistant');
          showOptions.value = true;
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      isTyping.value = false;
      addMessage("I'm sorry, I'm having trouble processing your request right now. Please try again.", 'assistant');
    }
  };

  // Select category
  const selectCategory = (categoryId, categoryName) => {
    if (!reportData.categories.includes(categoryId)) {
      reportData.categories.push(categoryId);
    }
    
    addMessage(`I'd like to report a ${categoryName} issue.`, 'human');
    addComment(`I'd like to report a ${categoryName} issue.`, 'user');
    
    setTimeout(() => {
      addMessage(`Thank you for selecting ${categoryName}. Please describe the specific issue you're experiencing.`, 'assistant');
      showOptions.value = false;
      currentStep.value = 1;
      
      // Focus on input
      nextTick(() => {
        if (messageInput.value?.$el) {
          messageInput.value.$el.setFocus();
        }
      });
    }, 500);
  };

  // Select option from chat
  const selectOption = (option) => {
    addMessage(option, 'human');
    addComment(option, 'user');
    showOptions.value = false;
    
    setTimeout(() => {
      addMessage("Thank you for that information. Is there anything else you'd like to add about this issue?", 'assistant');
    }, 1000);
  };

  // Toggle map modal
  const toggleMap = () => {
    mapExpanded.value = !mapExpanded.value;
  };

  // Toggle image preview
  const toggleImagePreview = () => {
    reportData.hasPhotos = !reportData.hasPhotos;
  };

  // Remove image
  const removeImage = () => {
    reportData.hasPhotos = false;
  };

  // Reset chat
  const resetChat = () => {
    showConfirmation.value = false;
    currentStep.value = 0;
    showOptions.value = true;
    messages.value = [];
    reportData.categories = [];
    reportData.comments = [];
    reportData.hasPhotos = false;
    userInput.value = '';
    
    // Clear localStorage
    localStorage.removeItem('civisto-chat-history');
    
    // Re-initialize location and weather data
    initializeData();
  };

  // Go back
  const goBack = () => {
    router.go(-1);
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  };

  // Handle scroll
  const handleScroll = (event) => {
    // Handle scroll events if needed
  };

  // Attach map click handler
  const attachMapClickHandler = () => {
    // Handle map interactions if needed
  };

  // Watch for changes in location and update weather
  watch(
    () => [reportData.geo.lat, reportData.geo.lng],
    async ([newLat, newLng], [oldLat, oldLng]) => {
      if (
        newLat !== oldLat || 
        newLng !== oldLng
      ) {
        try {
          const weather = await getWeatherForLocation(newLat, newLng);
          reportData.weather = {
            temperature: weather.temperature,
            humidity_percentage: weather.humidity_percentage,
            wind_speed: weather.wind_speed
          };
        } catch (error) {
          console.warn('Failed to update weather after location change:', error);
        }
      }
    }
  );

  // Initialize on mount
  onMounted(async () => {
    loadChatHistory(); // Load chat history first
    await initializeData(); // Then get fresh location and weather data
  });

  // Return all reactive state and methods
  return {
    // Icons
    arrowBack,
    paperPlaneOutline,
    imageOutline,
    locationOutline,
    closeOutline,
    checkmarkOutline,
    chevronForward,
    
    // State
    currentStep,
    showConfirmation,
    showOptions,
    isTyping,
    mapExpanded,
    userInput,
    contentRef,
    chatContainer,
    messageInput,
    mapIframe,
    reportData,
    messages,
    categories,
    currentOptions,
    mapSrc,
    
    // Methods
    sendMessage,
    selectCategory,
    selectOption,
    toggleMap,
    toggleImagePreview,
    removeImage,
    resetChat,
    goBack,
    handleScroll,
    attachMapClickHandler
  };
}
