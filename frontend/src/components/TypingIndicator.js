import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { SmartToy as BotIcon } from '@mui/icons-material';

const TypingIndicator = () => {
  const [dots, setDots] = useState('');



  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '') return '.';
        if (prev === '.') return '..';
        if (prev === '..') return '...';
        return '';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        mb: 2,
        animation: 'slideInUp 0.4s ease-out',
        '@keyframes slideInUp': {
          from: {
            opacity: 0,
            transform: 'translateY(15px)',
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
    >
      {/* Sarah's Avatar */}
      <Avatar
        sx={{
          bgcolor: '#fff',
          color: '#000',
          border: '2px solid #000',
          width: 32,
          height: 32,
          fontSize: '14px',
        }}
      >
        <BotIcon fontSize="small" />
      </Avatar>

      {/* Typing Bubble */}
      <Box
        sx={{
          maxWidth: '70%',
          minWidth: '200px',
        }}
      >
        <Box
          sx={{
            p: 2,
            backgroundColor: '#fff',
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {/* Typing Dots Animation */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {[0, 1, 2].map((index) => (
              <Box
                key={index}
                sx={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: '#666',
                  borderRadius: '50%',
                  animation: `typingDot 1.4s infinite ease-in-out`,
                  animationDelay: `${index * 0.2}s`,
                  '@keyframes typingDot': {
                    '0%, 60%, 100%': {
                      transform: 'translateY(0)',
                      opacity: 0.4,
                    },
                    '30%': {
                      transform: 'translateY(-8px)',
                      opacity: 1,
                    },
                  },
                }}
              />
            ))}
          </Box>
          
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              fontStyle: 'italic',
              fontSize: '14px',
              ml: 1,
            }}
          >
            Sarah is typing{dots}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TypingIndicator; 