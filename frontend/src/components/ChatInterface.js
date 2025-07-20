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
import { useVapi } from '../context/VapiContext';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import WelcomeScreen from './WelcomeScreen';
import TypingIndicator from './TypingIndicator';
import VoiceButton from './VoiceButton';
import VoiceTranscript from './VoiceTranscript';
import AvenLogo from './AvenLogo';

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

  const {
    isCallActive,
    error: voiceError
  } = useVapi();

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
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom && messages.length > 0);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [messages.length]);

  const showWelcome = messages.length === 0 && !isLoading;
  


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid',
          borderColor: '#e0e0e0',
          backgroundColor: '#fff',
          boxShadow: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            edge="start"
            aria-label="menu"
            onClick={onToggleSidebar}
            sx={{ color: '#000' }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AvenLogo size="small" />
            <Typography variant="h6" component="h1" sx={{ fontWeight: 600, color: '#000' }}>
              Sarah - AI Support
            </Typography>
          </Box>
          {currentSession && (
            <Typography variant="body2" sx={{ color: '#666' }}>
              Session: {currentSession.name}
            </Typography>
          )}
        </Box>

        {/* Voice Button in Header */}
        <VoiceButton />
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        {/* Chat Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Messages Container */}
          <Box
            ref={containerRef}
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 2,
              backgroundColor: '#fafafa',
            }}
          >
            <Container maxWidth="md" sx={{ py: 2 }}>
              {showWelcome ? (
                <WelcomeScreen suggestions={suggestions} onSendMessage={sendMessage} />
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                  {isLoading && <TypingIndicator />}
                  {/* Debug: Show loading state */}
                  {isLoading && (
                    <Box sx={{ p: 1, backgroundColor: '#f0f0f0', borderRadius: 1, fontSize: '12px' }}>
                      Loading: {isLoading ? 'true' : 'false'}
                    </Box>
                  )}
                  <div ref={messagesEndRef} />
                </Box>
              )}
            </Container>
          </Box>



          {/* Error Display */}
          {(error || voiceError) && (
            <Box sx={{ p: 2 }}>
              <Container maxWidth="md">
                <Fade in={true}>
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error || voiceError}
                  </Alert>
                </Fade>
              </Container>
            </Box>
          )}

          {/* Chat Input */}
          <Box
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
            }}
          >
            <Container maxWidth="md" sx={{ py: 2 }}>
              <ChatInput onSendMessage={sendMessage} />
            </Container>
          </Box>
        </Box>

        {/* Voice Transcript Sidebar */}
        {isCallActive && (
          <Box
            sx={{
              width: 400,
              borderLeft: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              p: 2,
              overflow: 'hidden'
            }}
          >
            <VoiceTranscript />
          </Box>
        )}
      </Box>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 24,
            zIndex: 1000,
          }}
        >
          <IconButton
            onClick={scrollToBottom}
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              boxShadow: 2,
            }}
            size="large"
          >
            ↓
          </IconButton>
        </Box>
      )}
    </Box>
  );
}

export default ChatInterface; 