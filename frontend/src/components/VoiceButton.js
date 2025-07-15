import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Chip,
  Tooltip,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  CallEnd as CallEndIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { useVapi } from '../context/VapiContext';

function VoiceButton() {
  const {
    isVapiInitialized,
    isCallActive,
    isLoading,
    isMuted,
    volumeLevel,
    error,
    callDuration,
    startCall,
    stopCall,
    toggleMute,
    formatDuration
  } = useVapi();

  const [animationScale, setAnimationScale] = useState(1);

  // Audio visualization effect
  useEffect(() => {
    if (isCallActive && volumeLevel > 0) {
      const scale = 1 + (volumeLevel * 0.3);
      setAnimationScale(scale);
    } else {
      setAnimationScale(1);
    }
  }, [volumeLevel, isCallActive]);

  // Main voice button styles
  const getButtonColor = () => {
    if (error) return 'inherit';
    if (isCallActive) return 'inherit';
    if (isLoading) return 'inherit';
    return 'inherit';
  };

  const getButtonIcon = () => {
    if (isLoading) return <CircularProgress size={24} color="inherit" />;
    if (isCallActive) return <MicIcon />;
    return <PhoneIcon />;
  };

  const getButtonText = () => {
    if (error) return 'Voice Error';
    if (isLoading) return 'Connecting...';
    if (isCallActive) return 'Voice Active';
    return 'Start Voice Chat';
  };

  const handleMainButtonClick = () => {
    if (isCallActive) {
      stopCall();
    } else {
      startCall();
    }
  };

  if (!isVapiInitialized && !error) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          Initializing voice chat...
        </Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Main Voice Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            color={getButtonColor()}
            onClick={handleMainButtonClick}
            disabled={!isVapiInitialized || isLoading}
            startIcon={getButtonIcon()}
            sx={{
              minWidth: 160,
              transform: `scale(${animationScale})`,
              transition: 'transform 0.1s ease-out',
              backgroundColor: error ? '#000' : isCallActive ? '#000' : '#000',
              color: '#fff',
              border: isCallActive ? `2px solid rgba(255, 255, 255, ${0.3 + volumeLevel * 0.4})` : '2px solid transparent',
              '&:hover': {
                backgroundColor: error ? '#333' : isCallActive ? '#333' : '#333',
              },
              '&:disabled': {
                backgroundColor: '#666',
                color: '#ccc'
              }
            }}
          >
            {getButtonText()}
          </Button>

          {/* Control Buttons (only show during call) */}
          {isCallActive && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
                <IconButton
                  onClick={toggleMute}
                  sx={{
                    backgroundColor: isMuted ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.1)',
                    color: isMuted ? '#fff' : '#000',
                    '&:hover': {
                      backgroundColor: isMuted ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.2)',
                    }
                  }}
                >
                  {isMuted ? <MicOffIcon /> : <MicIcon />}
                </IconButton>
              </Tooltip>

              <Tooltip title="End Call">
                <IconButton
                  onClick={stopCall}
                  sx={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    }
                  }}
                >
                  <CallEndIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        {/* Call Status and Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          {/* Call Duration */}
          {isCallActive && (
            <Chip
              icon={<VolumeUpIcon />}
              label={`${formatDuration(callDuration)}`}
              variant="outlined"
              size="small"
              sx={{
                borderColor: '#000',
                color: '#000',
                backgroundColor: '#fff'
              }}
            />
          )}

          {/* Audio Level Indicator */}
          {isCallActive && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VolumeUpIcon fontSize="small" sx={{ color: '#000' }} />
              <Box
                sx={{
                  width: 60,
                  height: 4,
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    width: `${volumeLevel * 100}%`,
                    height: '100%',
                    backgroundColor: volumeLevel > 0.7 ? '#000' : volumeLevel > 0.3 ? '#555' : '#000',
                    transition: 'width 0.1s ease-out'
                  }}
                />
              </Box>
            </Box>
          )}

          {/* Mute Status */}
          {isCallActive && isMuted && (
            <Chip
              icon={<VolumeOffIcon />}
              label="Muted"
              color="warning"
              variant="outlined"
              size="small"
            />
          )}
        </Box>

        {/* Error Display */}
        {error && (
          <Typography variant="body2" color="error" sx={{ fontSize: '0.875rem' }}>
            {error}
          </Typography>
        )}

        {/* Helper Text */}
        {!isCallActive && !error && (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            Click to start voice conversation with the AI assistant
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

export default VoiceButton; 