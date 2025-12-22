import { useChatKit } from '@openai/chatkit-react';
import { useCallback } from 'react';

/**
 * Custom hook for managing ChatKit session
 * @returns {Object} ChatKit control and configuration
 */
export const useChatKitSession = () => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL || '';

  // Get or create persistent device ID
  const getDeviceId = useCallback(() => {
    const storageKey = 'chatkit_device_id';
    let deviceId = localStorage.getItem(storageKey);
    
    if (!deviceId) {
      deviceId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(storageKey, deviceId);
    }
    
    return deviceId;
  }, []);

  // Fetch client secret from backend
  const fetchClientSecret = useCallback(async (existing) => {
    if (existing) {
      return existing;
    }
    
    try {
      const response = await fetch(`${backendUrl}/api/chatkit/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceId: getDeviceId()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { client_secret } = await response.json();
      return client_secret;
    } catch (error) {
      console.error('Error fetching client secret:', error);
      throw error;
    }
  }, [backendUrl, getDeviceId]);

  const { control } = useChatKit({
    api: {
      getClientSecret: fetchClientSecret
    },
    composer: {
      attachments: {
        enabled: true
      }
    }
  });

  return { control };
};
