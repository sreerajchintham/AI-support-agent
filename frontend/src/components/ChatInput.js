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

function ChatInput({ disabled, onSubmit, placeholder = "Ask me anything about Aven..." }) {
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
    e?.preventDefault();
    
    if (!message.trim() || disabled || isLoading) return;

    const messageToSend = message.trim();
    setMessage('');
    setRows(1);

    try {
      // Use provided onSubmit prop if available, otherwise use sendMessage from context
      if (onSubmit) {
        await onSubmit(messageToSend);
      } else {
        await sendMessage(messageToSend);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Allow new line with Shift+Enter
        return;
      } else {
        // Send message with Enter
        e.preventDefault();
        handleSubmit();
      }
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const canSend = message.trim() && !disabled && !isLoading;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        gap: 1,
        alignItems: 'flex-end',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          border: '1px solid',
          borderColor: '#e0e0e0',
          borderRadius: 2,
          overflow: 'hidden',
          backgroundColor: '#fff',
          '&:hover': {
            borderColor: '#000',
          },
          '&:focus-within': {
            borderColor: '#000',
            boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <TextField
          ref={textFieldRef}
          fullWidth
          multiline
          rows={rows}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              border: 'none',
              borderRadius: 2,
              backgroundColor: 'transparent',
              '& fieldset': {
                border: 'none',
              },
              '&:hover fieldset': {
                border: 'none',
              },
              '&.Mui-focused fieldset': {
                border: 'none',
              },
            },
            '& .MuiInputBase-input': {
              padding: '12px 16px',
              fontSize: '14px',
              lineHeight: '24px',
              resize: 'none',
              color: '#000',
              '&::placeholder': {
                color: '#666',
                opacity: 0.7,
              },
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sx={{ alignSelf: 'flex-end', pb: 1 }}>
                <IconButton
                  type="submit"
                  disabled={!canSend}
                  size="small"
                  sx={{
                    backgroundColor: canSend ? '#000' : '#e0e0e0',
                    color: canSend ? 'white' : '#999',
                    width: 32,
                    height: 32,
                    '&:hover': {
                      backgroundColor: canSend ? '#333' : '#e0e0e0',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: '#e0e0e0',
                    },
                  }}
                >
                  {isLoading ? <StopIcon fontSize="small" /> : <SendIcon fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Paper>
    </Box>
  );
}

export default ChatInput; 