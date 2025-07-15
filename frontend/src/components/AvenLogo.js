import React from 'react';
import { Box } from '@mui/material';

function AvenLogo({ 
  size = 'medium', 
  variant = 'black', // 'black' for black text on white bg, 'white' for white text on black bg
  sx = {},
  ...props 
}) {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { height: '24px', width: 'auto' };
      case 'large':
        return { height: '48px', width: 'auto' };
      case 'medium':
      default:
        return { height: '32px', width: 'auto' };
    }
  };

  const logoSrc = variant === 'white' 
    ? '/aven-logo-white.png' 
    : '/aven-logo-black.png';

  const sizeStyles = getSizeStyles();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx
      }}
      {...props}
    >
      <img
        src={logoSrc}
        alt="Aven"
        style={{
          ...sizeStyles,
          display: 'block',
          objectFit: 'contain'
        }}
      />
    </Box>
  );
}

export default AvenLogo; 