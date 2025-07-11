import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Fade,
  Alert,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useChat } from '../context/ChatContext';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import WelcomeScreen from './WelcomeScreen';
import TypingIndicator from './TypingIndicator';

function ChatInterface({ onToggleSidebar }) {
  const theme = useTheme();
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

  // Handle scroll events to show/hide scroll button
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom && messages.length > 0);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [messages.length]);

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const showWelcome = !currentSession || messages.length === 0;

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <IconButton
          onClick={onToggleSidebar}
          sx={{ mr: 1, color: 'text.primary' }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ color: 'text.primary', flexGrow: 1 }}>
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
              
              {/* Typing Indicator */}
              {isLoading && <TypingIndicator />}
            </Box>

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </Container>
        )}

        {/* Scroll to bottom button */}
        {showScrollButton && (
          <Fade in={showScrollButton}>
            <Box
              sx={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                zIndex: 1,
              }}
            >
              <IconButton
                onClick={scrollToBottom}
                sx={{
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                ⬇️
              </IconButton>
            </Box>
          </Fade>
        )}
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.default',
        }}
      >
        <Container maxWidth="md" sx={{ py: 2 }}>
          <ChatInput disabled={isLoading} />
          
          {/* Quick suggestions for empty chat */}
          {showWelcome && suggestions.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <Chip
                  key={index}
                  label={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  variant="outlined"
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    borderColor: 'divider',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      borderColor: 'primary.main',
                    },
                  }}
                />
              ))}
            </Box>
          )}

          {/* Footer disclaimer */}
          <Typography
            variant="caption"
            color="text.secondary"
            align="center"
            display="block"
            sx={{ mt: 2 }}
          >
            AI can make mistakes. For account-specific questions, contact Aven support at (888) 966-4655.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default ChatInterface; 