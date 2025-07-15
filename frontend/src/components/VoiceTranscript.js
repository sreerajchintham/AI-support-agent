import React, { useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Chip,
  Avatar
} from '@mui/material';
import {
  Person as PersonIcon,
  SmartToy as BotIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { useVapi } from '../context/VapiContext';

function VoiceTranscript() {
  const { transcript, isCallActive } = useVapi();
  const transcriptEndRef = useRef(null);

  // Auto-scroll to bottom when new transcript entries arrive
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Format timestamp for display
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Get role display info
  const getRoleInfo = (role) => {
    switch (role) {
      case 'user':
        return {
          name: 'You',
          color: 'inherit',
          icon: <PersonIcon sx={{ color: '#000' }} />,
          bgColor: 'rgba(0, 0, 0, 0.05)'
        };
      case 'assistant':
        return {
          name: 'AI Assistant',
          color: 'inherit',
          icon: <BotIcon sx={{ color: '#000' }} />,
          bgColor: 'rgba(0, 0, 0, 0.08)'
        };
      default:
        return {
          name: role,
          color: 'inherit',
          icon: <BotIcon sx={{ color: '#000' }} />,
          bgColor: 'rgba(0, 0, 0, 0.04)'
        };
    }
  };

  if (!isCallActive && transcript.length === 0) {
    return null;
  }

  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 2, maxHeight: 400, overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <BotIcon sx={{ color: '#000' }} />
        <Typography variant="h6" component="h3" sx={{ color: '#000' }}>
          Voice Transcript
        </Typography>
        {isCallActive && (
          <Chip
            label="Live"
            size="small"
            sx={{ 
              ml: 'auto',
              backgroundColor: '#000',
              color: '#fff',
              fontWeight: 'bold'
            }}
          />
        )}
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          maxHeight: 300,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {transcript.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ 
              textAlign: 'center', 
              py: 4,
              color: '#666' 
            }}
          >
            {isCallActive 
              ? 'Start speaking to see the conversation transcript...'
              : 'No voice conversation yet. Click "Start Voice Chat" to begin.'
            }
          </Typography>
        ) : (
          transcript.map((entry, index) => {
            const roleInfo = getRoleInfo(entry.role);
            
            return (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  gap: 2,
                  p: 2,
                  backgroundColor: roleInfo.bgColor,
                  borderRadius: 2,
                  alignItems: 'flex-start'
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: '#fff',
                    border: '2px solid #000',
                    width: 32,
                    height: 32,
                    fontSize: '0.875rem'
                  }}
                >
                  {roleInfo.icon}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ 
                        fontWeight: 600,
                        color: '#000'
                      }}
                    >
                      {roleInfo.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TimeIcon sx={{ fontSize: 14, color: '#666' }} />
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        {formatTime(entry.timestamp)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography
                    variant="body2"
                    sx={{
                      wordWrap: 'break-word',
                      lineHeight: 1.5,
                      color: '#000'
                    }}
                  >
                    {entry.text}
                  </Typography>
                </Box>
              </Box>
            );
          })
        )}
        <div ref={transcriptEndRef} />
      </Box>

      {transcript.length > 0 && (
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: '#e0e0e0' }}>
          <Typography variant="caption" sx={{ color: '#666' }}>
            {transcript.length} message{transcript.length !== 1 ? 's' : ''} in conversation
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default VoiceTranscript; 