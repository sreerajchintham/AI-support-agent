import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Chip,
  Collapse,
  Divider,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Person as PersonIcon,
  Psychology as AIIcon,
  ContentCopy as CopyIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Source as SourceIcon,
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function MessageBubble({ message }) {
  const theme = useTheme();
  const [showSources, setShowSources] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const isUser = message.role === 'user';
  const isError = message.isError;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
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
      }}
    >
      {/* Avatar */}
      <Avatar
        sx={{
          bgcolor: isUser ? 'primary.main' : '#10a37f',
          width: 32,
          height: 32,
          fontSize: '14px',
        }}
      >
        {isUser ? <PersonIcon fontSize="small" /> : <AIIcon fontSize="small" />}
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
              ? 'primary.main' 
              : isError 
                ? 'error.dark' 
                : 'background.paper',
            color: isUser ? 'primary.contrastText' : 'text.primary',
            borderRadius: 2,
            border: '1px solid',
            borderColor: isUser 
              ? 'primary.main' 
              : isError 
                ? 'error.main' 
                : 'divider',
          }}
        >
          {/* Message Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {isUser ? 'You' : 'Aven AI'}
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
                        style={oneDark}
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
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
              <Tooltip title={copySuccess ? 'Copied!' : 'Copy message'}>
                <IconButton
                  size="small"
                  onClick={handleCopy}
                  sx={{ 
                    color: 'text.secondary',
                    '&:hover': { color: 'text.primary' },
                  }}
                >
                  <CopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              {/* Sources button */}
              {message.sources && message.sources.length > 0 && (
                <Tooltip title="View sources">
                  <IconButton
                    size="small"
                    onClick={() => setShowSources(!showSources)}
                    sx={{ 
                      color: 'text.secondary',
                      '&:hover': { color: 'text.primary' },
                    }}
                  >
                    <SourceIcon fontSize="small" />
                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                      {message.sources.length}
                    </Typography>
                    {showSources ? (
                      <ExpandLessIcon fontSize="small" />
                    ) : (
                      <ExpandMoreIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}
        </Paper>

        {/* Sources Section */}
        {message.sources && message.sources.length > 0 && (
          <Collapse in={showSources}>
            <Paper
              elevation={0}
              sx={{
                mt: 1,
                p: 2,
                backgroundColor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                Sources ({message.sources.length})
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {message.sources.map((source, index) => (
                  <Box key={index}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {source.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                      <Chip
                        label={source.source}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '11px' }}
                      />
                      <Chip
                        label={`${(source.relevanceScore * 100).toFixed(0)}% match`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontSize: '11px' }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Collapse>
        )}
      </Box>
    </Box>
  );
}

export default MessageBubble; 