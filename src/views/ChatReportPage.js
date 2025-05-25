import { defineComponent, ref, reactive, onMounted, nextTick, computed } from 'vue';
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
  const { getCurrentPosition, getAddressFromCoordinates } = useGeolocation();
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
    user_id: '',
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

  // Initialize location and weather data
  const initializeData = async () => {
    try {
      // Set user ID
      if (user.value) {
        reportData.user_id = user.value.id;
      }

      // Get current location
      const position = await getCurrentPosition();
      reportData.geo.lat = position.latitude;
      reportData.geo.lng = position.longitude;
      reportData.coordinates = `${position.latitude.toFixed(4)}°, ${position.longitude.toFixed(4)}°`;

      // Get address
      try {
        const address = await getAddressFromCoordinates(position.latitude, position.longitude);
        reportData.location = address;
        
        // Parse address for city and street (simplified)
        const parts = address.split(',');
        if (parts.length >= 2) {
          reportData.geo.street = parts[0].trim();
          reportData.geo.city = parts[1].trim();
        } else {
          reportData.geo.street = address;
          reportData.geo.city = 'Unknown';
        }
      } catch (error) {
        console.warn('Failed to get address:', error);
      }

      // Get weather data
      try {
        const weather = await getWeatherForLocation(position.latitude, position.longitude);
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
      // Do not use mock or fallback location. Keep default values and optionally show an error message.
      // Optionally, you can set a flag or message to inform the user that geolocation failed.
    }
  };

  // Send message to AI API
  const sendToAI = async (data) => {
    try {
      const response = await fetch('https://eajowgxcuedziatbkgba.supabase.co/functions/v1/comment-ai', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVham93Z3hjdWVkemlhdGJrZ2JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczODU2MjAsImV4cCI6MjA2Mjk2MTYyMH0.gApfUlSzt3BlI-l2XdnAsrILZbGIDK00qzVJh3TsbIo',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('AI API call failed:', error);
      // Return mock response for demo
      return {
        comment: `Thank you for reporting this issue. Based on the information provided, this appears to be a ${data.categories[0] || 'general'} issue that needs attention.`,
        probability: Math.floor(Math.random() * 30) + 70 // 70-100%
      };
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
          addMessage(aiResponse.comment, 'assistant');
          addComment(aiResponse.comment, 'ai');

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

  // Initialize on mount
  onMounted(async () => {
    await initializeData();
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
