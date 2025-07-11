import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  InputAdornment,
  useTheme,
} from '@mui/material';
import {
  Send as SendIcon,
  Stop as StopIcon,
} from '@mui/icons-material';
import { useChat } from '../context/ChatContext';

function ChatInput({ disabled }) {
  const theme = useTheme();
  const { sendMessage, isLoading } = useChat();
  const [message, setMessage] = useState('');
  const [rows, setRows] = useState(1);
  const textFieldRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textFieldRef.current) {
      const textarea = textFieldRef.current.querySelector('textarea');
      if (textarea) {
        textarea.style.height = 'auto';
        const newHeight = Math.min(textarea.scrollHeight, 120); // Max 120px
        textarea.style.height = `${newHeight}px`;
        
        // Calculate rows for proper TextField height
        const lineHeight = 24;
        const newRows = Math.max(1, Math.min(5, Math.ceil(newHeight / lineHeight)));
        setRows(newRows);
      }
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || disabled || isLoading) return;

    const messageToSend = message.trim();
    setMessage('');
    setRows(1);
    
    await sendMessage(messageToSend);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const canSend = message.trim() && !disabled && !isLoading;

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        backgroundColor: 'background.paper',
        '&:focus-within': {
          borderColor: 'primary.main',
          boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <TextField
          ref={textFieldRef}
          fullWidth
          multiline
          minRows={1}
          maxRows={5}
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder={
            disabled 
              ? "Please wait..." 
              : "Message Aven Support... (Shift + Enter for new line)"
          }
          disabled={disabled}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              border: 'none',
              '& fieldset': {
                border: 'none',
              },
              '&:hover fieldset': {
                border: 'none',
              },
              '&.Mui-focused fieldset': {
                border: 'none',
              },
              backgroundColor: 'transparent',
              fontSize: '16px',
              lineHeight: 1.5,
              py: 1.5,
              pr: 6, // Space for send button
            },
            '& .MuiInputBase-input': {
              resize: 'none',
              '&::placeholder': {
                color: 'text.secondary',
                opacity: 0.8,
              },
            },
          }}
        />
        
        {/* Send Button */}
        <IconButton
          onClick={handleSubmit}
          disabled={!canSend}
          sx={{
            position: 'absolute',
            right: 8,
            bottom: 8,
            width: 40,
            height: 40,
            backgroundColor: canSend ? 'primary.main' : 'action.disabled',
            color: canSend ? 'primary.contrastText' : 'action.disabled',
            '&:hover': {
              backgroundColor: canSend ? 'primary.dark' : 'action.disabled',
            },
            '&:disabled': {
              backgroundColor: 'action.disabled',
              color: 'action.disabled',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {isLoading ? (
            <StopIcon fontSize="small" />
          ) : (
            <SendIcon fontSize="small" />
          )}
        </IconButton>
      </Box>
    </Paper>
  );
}

export default ChatInput; 