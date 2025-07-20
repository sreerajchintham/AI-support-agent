import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  IconButton,
  keyframes,
} from '@mui/material';
import {
  Person as PersonIcon,
  SmartToy as BotIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Animation for message appearance
const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

function MessageBubble({ message }) {
  const [copied, setCopied] = useState(false);

  const isUser = message.role === 'user';
  const isError = message.isError;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        gap: 2,
        mb: 2,
        animation: `${slideInUp} 0.4s ease-out`,
      }}
    >
      {/* Avatar */}
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
        {isUser ? <PersonIcon fontSize="small" /> : <BotIcon fontSize="small" />}
      </Avatar>

      {/* Message Content */}
      <Box
        sx={{
          maxWidth: '70%',
          minWidth: '200px',
        }}
      >
        {/* Message Bubble */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            backgroundColor: isUser 
              ? '#000' 
              : isError 
                ? '#f5f5f5' 
                : '#fff',
            color: isUser ? '#fff' : '#000',
            borderRadius: 2,
            border: '1px solid',
            borderColor: isUser 
              ? '#000' 
              : isError 
                ? '#d32f2f' 
                : '#e0e0e0',
          }}
        >
          {/* Message Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {isUser ? 'You' : 'Sarah'}
            </Typography>
            <Typography variant="caption" sx={{ ml: 'auto', opacity: 0.7 }}>
              {formatTime(message.timestamp)}
            </Typography>
          </Box>

          {/* Message Content */}
          <Box sx={{ '& > *:last-child': { mb: 0 } }}>
            {isUser ? (
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {message.content}
              </Typography>
            ) : (
              <ReactMarkdown
                components={{
                  // Custom paragraph component
                  p: ({ children }) => (
                    <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                      {children}
                    </Typography>
                  ),
                  // Custom code block component
                  code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={tomorrow}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                          borderRadius: '8px',
                          fontSize: '13px',
                          margin: '8px 0',
                        }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <Typography
                        component="code"
                        sx={{
                          backgroundColor: 'rgba(0, 0, 0, 0.05)',
                          padding: '2px 4px',
                          borderRadius: '4px',
                          fontFamily: 'monospace',
                          fontSize: '0.9em',
                        }}
                        {...props}
                      >
                        {children}
                      </Typography>
                    );
                  },
                  // Custom list components
                  ul: ({ children }) => (
                    <Box component="ul" sx={{ pl: 2, my: 1 }}>
                      {children}
                    </Box>
                  ),
                  ol: ({ children }) => (
                    <Box component="ol" sx={{ pl: 2, my: 1 }}>
                      {children}
                    </Box>
                  ),
                  li: ({ children }) => (
                    <Typography component="li" variant="body1" sx={{ mb: 0.5 }}>
                      {children}
                    </Typography>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </Box>

          {/* Action Buttons */}
          {!isUser && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 1 }}>
              <IconButton
                size="small"
                onClick={handleCopy}
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { color: 'text.primary' },
                }}
              >
                <CopyIcon fontSize="small" />
                {copied && <CheckIcon fontSize="small" sx={{ ml: 0.5 }} />}
              </IconButton>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

export default MessageBubble; 