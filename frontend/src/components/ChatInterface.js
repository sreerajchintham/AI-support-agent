import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Fade,
  Alert,
} from '@mui/material';
import {
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useChat } from '../context/ChatContext';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import WelcomeScreen from './WelcomeScreen';
import SimpleLoadingIndicator from './SimpleLoadingIndicator';

function ChatInterface({ onToggleSidebar }) {
  const { 
    messages, 
    isLoading, 
    error, 
    currentSession,
    suggestions,
    loadSuggestions,
    sendMessage,
  } = useChat();

  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load suggestions on mount
  useEffect(() => {
    loadSuggestions();
  }, [loadSuggestions]);

  // Handle scroll button visibility
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      setShowScrollButton(!isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle suggestion clicks
  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  // Handle message submission
  const handleSubmit = async (message) => {
    if (message.trim()) {
      await sendMessage(message);
    }
  };



  // Show welcome screen when no messages
  const showWelcome = messages.length === 0 && !isLoading;

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          backgroundColor: 'background.paper',
        }}
      >
        <IconButton
          size="small"
          onClick={onToggleSidebar}
          sx={{ mr: 1 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {currentSession?.title || 'Aven AI Support'}
        </Typography>
      </Box>

      {/* Messages Area */}
      <Box
        ref={containerRef}
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          position: 'relative',
        }}
      >
        {showWelcome ? (
          <WelcomeScreen 
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
          />
        ) : (
          <Container maxWidth="md" sx={{ py: 3 }}>
            {/* Error Alert */}
            {error && (
              <Fade in={Boolean(error)}>
                <Alert 
                  severity="error" 
                  sx={{ mb: 2 }}
                  onClose={() => {/* Clear error if needed */}}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            {/* Messages */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                />
              ))}
              
              {/* Simple Loading Indicator */}
              {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                  <SimpleLoadingIndicator message="AI is thinking" />
                </Box>
              )}
            </Box>

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </Container>
        )}
        
        {/* Global Loading Indicator - Always visible when loading */}
        {isLoading && (
          <Container maxWidth="md" sx={{ py: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
              <SimpleLoadingIndicator message="AI is thinking" />
            </Box>
          </Container>
        )}
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          p: 2,
        }}
      >
        <ChatInput
          onSubmit={handleSubmit}
          disabled={isLoading}
          placeholder={
            isLoading 
              ? "AI is processing your request..." 
              : "Ask me anything about Aven..."
          }
        />
      </Box>

      {/* Scroll to Bottom Button */}
      <Fade in={showScrollButton}>
        <Box
          sx={{
            position: 'absolute',
            bottom: 90,
            right: 20,
            zIndex: 1,
          }}
        >
          <IconButton
            size="medium"
            onClick={scrollToBottom}
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              boxShadow: 2,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 16l-6-6h12l-6 6z"/>
            </svg>
          </IconButton>
        </Box>
      </Fade>
    </Box>
  );
}

export default ChatInterface; 