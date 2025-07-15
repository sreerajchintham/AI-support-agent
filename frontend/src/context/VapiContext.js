import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import Vapi from '@vapi-ai/web';

const VapiContext = createContext(null);

export const useVapi = () => {
  const context = useContext(VapiContext);
  if (!context) {
    throw new Error('useVapi must be used within a VapiProvider');
  }
  return context;
};

export const VapiProvider = ({ children }) => {
  // State management
  const [isVapiInitialized, setIsVapiInitialized] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [callDuration, setCallDuration] = useState(0);
  const [assistantId, setAssistantId] = useState(null);

  // Refs
  const vapiRef = useRef(null);
  const durationIntervalRef = useRef(null);
  const startTimeRef = useRef(null);

  // Set up Vapi event listeners
  const setupEventListeners = useCallback((vapiInstance) => {
    vapiInstance.on('call-start', () => {
      console.log('Voice call started');
      setIsCallActive(true);
      setIsLoading(false);
      setError(null);
      setTranscript([]);
      startTimeRef.current = Date.now();
      
      // Start duration tracking
      durationIntervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          setCallDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }
      }, 1000);
    });

    vapiInstance.on('call-end', () => {
      console.log('Voice call ended');
      setIsCallActive(false);
      setIsLoading(false);
      setCallDuration(0);
      setVolumeLevel(0);
      
      // Clear duration tracking
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
      startTimeRef.current = null;
    });

    vapiInstance.on('speech-start', () => {
      console.log('Speech started');
    });

    vapiInstance.on('speech-end', () => {
      console.log('Speech ended');
    });

    vapiInstance.on('volume-level', (volume) => {
      setVolumeLevel(volume);
    });

    vapiInstance.on('message', (message) => {
      console.log('Vapi message:', message);
      
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        setTranscript(prev => [...prev, {
          role: message.role,
          text: message.transcript,
          timestamp: new Date().toISOString()
        }]);
      }
      
      if (message.type === 'function-call') {
        console.log('Function call:', message.functionCall);
        // Function calls will be handled by the backend webhook
      }
    });

    vapiInstance.on('error', (error) => {
      console.error('Vapi error:', error);
      setError('Voice chat error: ' + error.message);
      setIsLoading(false);
      setIsCallActive(false);
    });
  }, []);

  // Initialize Vapi instance
  const initializeVapi = useCallback(async () => {
    try {
      // Get public key from environment or API
      const response = await fetch('http://localhost:5001/api/vapi/config');
      const { publicKey, defaultAssistantId } = await response.json();
      
      if (!publicKey) {
        throw new Error('Vapi public key not configured');
      }

      const vapiInstance = new Vapi(publicKey);
      vapiRef.current = vapiInstance;
      setAssistantId(defaultAssistantId);

      // Set up event listeners
      setupEventListeners(vapiInstance);
      setIsVapiInitialized(true);
      
    } catch (err) {
      console.error('Failed to initialize Vapi:', err);
      setError('Failed to initialize voice chat: ' + err.message);
    }
  }, [setupEventListeners]);

  // Start voice call
  const startCall = useCallback(async () => {
    if (!vapiRef.current || !assistantId) {
      setError('Voice chat not initialized');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await vapiRef.current.start(assistantId);
    } catch (err) {
      console.error('Failed to start call:', err);
      setError('Failed to start voice call: ' + err.message);
      setIsLoading(false);
    }
  }, [assistantId]);

  // Stop voice call
  const stopCall = useCallback(() => {
    if (vapiRef.current && isCallActive) {
      vapiRef.current.stop();
    }
  }, [isCallActive]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (vapiRef.current && isCallActive) {
      const newMutedState = !isMuted;
      vapiRef.current.setMuted(newMutedState);
      setIsMuted(newMutedState);
    }
  }, [isMuted, isCallActive]);

  // Send text message during call
  const sendMessage = useCallback((message) => {
    if (vapiRef.current && isCallActive) {
      vapiRef.current.send({
        type: 'add-message',
        message: {
          role: 'user',
          content: message
        }
      });
    }
  }, [isCallActive]);

  // Make assistant say something
  const say = useCallback((message, endCallAfter = false) => {
    if (vapiRef.current && isCallActive) {
      vapiRef.current.say(message, endCallAfter);
    }
  }, [isCallActive]);

  // Format call duration
  const formatDuration = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeVapi();
    
    // Cleanup on unmount
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [initializeVapi]);

  const value = {
    // State
    isVapiInitialized,
    isCallActive,
    isLoading,
    isMuted,
    volumeLevel,
    error,
    transcript,
    callDuration,
    assistantId,
    
    // Actions
    startCall,
    stopCall,
    toggleMute,
    sendMessage,
    say,
    
    // Utilities
    formatDuration
  };

  return (
    <VapiContext.Provider value={value}>
      {children}
    </VapiContext.Provider>
  );
}; 