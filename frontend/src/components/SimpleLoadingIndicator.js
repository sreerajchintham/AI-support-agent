import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const SimpleLoadingIndicator = ({ message = "Sarah is thinking" }) => {
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
        alignItems: 'center',
        gap: 1,
        padding: '12px 16px',
        backgroundColor: '#f5f5f5',
        borderRadius: '18px',
        border: '1px solid #e0e0e0',
        maxWidth: 'fit-content',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <Box
        sx={{
          width: '8px',
          height: '8px',
          backgroundColor: '#4CAF50',
          borderRadius: '50%',
          animation: 'pulse 1.5s infinite',
          '@keyframes pulse': {
            '0%': { opacity: 1 },
            '50%': { opacity: 0.5 },
            '100%': { opacity: 1 }
          }
        }}
      />
      <Typography
        variant="body2"
        sx={{
          color: '#666',
          fontStyle: 'italic',
          fontSize: '14px',
        }}
      >
        {message}{dots}
      </Typography>
              <Typography
          variant="caption"
          sx={{
            color: '#999',
            fontSize: '11px',
            marginLeft: '8px',
            paddingLeft: '8px',
            borderLeft: '1px solid #e0e0e0'
          }}
        >
          Sarah
        </Typography>
    </Box>
  );
};

export default SimpleLoadingIndicator; 