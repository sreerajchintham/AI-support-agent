import React from 'react';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  keyframes,
} from '@mui/material';
import {
  Psychology as AIIcon,
} from '@mui/icons-material';

// Keyframes for the typing animation
const bounce = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

function TypingIndicator() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        mb: 2,
        animation: `${pulse} 2s ease-in-out infinite`,
      }}
    >
      {/* Avatar */}
      <Avatar
        sx={{
          bgcolor: '#10a37f',
          width: 32,
          height: 32,
          fontSize: '14px',
        }}
      >
        <AIIcon fontSize="small" />
      </Avatar>

      {/* Typing Bubble */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          minWidth: 120,
        }}
      >
        {/* Header */}
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Aven AI
        </Typography>

        {/* Typing Animation */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Thinking
          </Typography>
          
          {/* Animated Dots */}
          <Box
            sx={{
              display: 'flex',
              gap: 0.3,
            }}
          >
            {[0, 1, 2].map((index) => (
              <Box
                key={index}
                sx={{
                  width: 4,
                  height: 4,
                  backgroundColor: 'text.secondary',
                  borderRadius: '50%',
                  animation: `${bounce} 1.4s infinite ease-in-out`,
                  animationDelay: `${index * 0.16}s`,
                }}
              />
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default TypingIndicator; 