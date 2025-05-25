import { Capacitor } from '@capacitor/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { ref, onMounted } from 'vue';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
  timestamp: number;
  city?: string;
  street?: string;
  country?: string;
}

export interface GeolocationError {
  code: number;
  message: string;
}

export function useGeolocation() {
  const currentPosition = ref<LocationData | null>(null);
  const locationError = ref<GeolocationError | null>(null);
  const isLoading = ref(false);
  const hasPermission = ref(false);

  // Check if running on a native platform
  const isNative = Capacitor.isNativePlatform();

  // Request permissions
  const requestPermissions = async (): Promise<boolean> => {
    try {
      if (isNative) {
        const permissionStatus = await Geolocation.requestPermissions();
        hasPermission.value = permissionStatus.location === 'granted';
        return hasPermission.value;
      } else {
        // For web, we'll check when we try to get the position
        return true;
      }
    } catch (error) {
      console.error('Error requesting geolocation permissions:', error);
      return false;
    }
  };

  // Get current position with high accuracy
  const getCurrentPosition = async (): Promise<LocationData> => {
    isLoading.value = true;
    locationError.value = null;

    try {
      // Request permissions first if on native platform
      if (isNative && !hasPermission.value) {
        const granted = await requestPermissions();
        if (!granted) {
          throw {
            code: 1,
            message: 'Location permission not granted'
          };
        }
      }

      const position: Position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000
      });

      const locationData: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp || Date.now()
      };
      
      currentPosition.value = locationData;
      return locationData;
    } catch (error: any) {
      const geoError: GeolocationError = {
        code: error.code || 0,
        message: getErrorMessage(error.code) || error.message || 'Unknown geolocation error'
      };
      locationError.value = geoError;
      throw geoError;
    } finally {
      isLoading.value = false;
    }
  };

  // Get human-readable error message
  const getErrorMessage = (code: number): string => {
    switch (code) {
      case 1:
        return 'Location access denied. Please enable location permissions.';
      case 2:
        return 'Location unavailable. Please check your GPS/network connection.';
      case 3:
        return 'Location request timed out. Please try again.';
      default:
        return 'Unable to get your location. Please try again.';
    }
  };

  // Get address from coordinates using Nominatim (OpenStreetMap)
  const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Civisto-App/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.display_name) {
        return data.display_name;
      } else {
        return `Location at ${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;
      }
    } catch (error) {
      console.error('Error getting address:', error);
      return `Location at ${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;
    }
  };

  // Get detailed address information
  const getDetailedAddress = async (latitude: number, longitude: number): Promise<{
    address: string;
    city: string;
    street: string;
    country: string;
  }> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Civisto-App/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.address) {
        const addr = data.address;
        return {
          address: data.display_name || `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`,
          city: addr.city || addr.town || addr.village || addr.municipality || 'Unknown City',
          street: addr.road || addr.street || addr.path || 'Unknown Street',
          country: addr.country || 'Unknown Country'
        };
      } else {
        return {
          address: `Location at ${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`,
          city: 'Unknown City',
          street: 'Unknown Street',
          country: 'Unknown Country'
        };
      }
    } catch (error) {
      console.error('Error getting detailed address:', error);
      return {
        address: `Location at ${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`,
        city: 'Unknown City',
        street: 'Unknown Street',
        country: 'Unknown Country'
      };
    }
  };

  // Watch position changes
  let watchId: string | null = null;
  
  const watchPosition = async () => {
    try {
      // Request permissions first if on native platform
      if (isNative && !hasPermission.value) {
        const granted = await requestPermissions();
        if (!granted) {
          throw {
            code: 1,
            message: 'Location permission not granted'
          };
        }
      }

      // Clear any existing watch
      if (watchId !== null) {
        await clearWatch();
      }

      watchId = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000
        },
        (position, err) => {
          if (err) {
            locationError.value = {
              code: err.code || 0,
              message: getErrorMessage(err.code) || err.message || 'Unknown geolocation error'
            };
            return;
          }

          if (position) {
            currentPosition.value = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp || Date.now()
            };
            locationError.value = null;
          }
        }
      );

      return watchId;
    } catch (error: any) {
      const geoError: GeolocationError = {
        code: error.code || 0,
        message: getErrorMessage(error.code) || error.message || 'Unknown geolocation error'
      };
      locationError.value = geoError;
      throw geoError;
    }
  };

  // Clear watch
  const clearWatch = async () => {
    if (watchId !== null) {
      await Geolocation.clearWatch({ id: watchId });
      watchId = null;
    }
  };

  // Get full location data with detailed address
  const getFullLocationData = async (): Promise<LocationData> => {
    try {
      const position = await getCurrentPosition();
      const addressDetails = await getDetailedAddress(position.latitude, position.longitude);
      
      return {
        ...position,
        address: addressDetails.address,
        city: addressDetails.city,
        street: addressDetails.street,
        country: addressDetails.country
      };
    } catch (error) {
      throw error;
    }
  };

  // Format coordinates for display
  const formatCoordinates = (lat: number, lng: number): string => {
    return `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
  };

  // Clean up on component unmount
  onMounted(() => {
    // Request permissions on mount if on native platform
    if (isNative) {
      requestPermissions();
    }
  });

  return {
    currentPosition,
    locationError,
    isLoading,
    hasPermission,
    requestPermissions,
    getCurrentPosition,
    getAddressFromCoordinates,
    getDetailedAddress,
    watchPosition,
    clearWatch,
    getFullLocationData,
    formatCoordinates
  };
}
