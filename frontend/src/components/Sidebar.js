import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography,
  Button,
  Divider,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useChat } from '../context/ChatContext';
import AvenLogo from './AvenLogo';

const DRAWER_WIDTH = 260;

function Sidebar({ open, onClose }) {
  const { 
    sessions, 
    currentSession, 
    createSession, 
    setSession, 
    deleteSession 
  } = useChat();

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const handleNewChat = () => {
    createSession();
  };

  const handleSessionClick = (session) => {
    setSession(session);
    if (onClose) onClose(); // Close sidebar after selecting a session
  };

  const handleMenuOpen = (event, sessionId) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedSessionId(sessionId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedSessionId(null);
  };

  const handleDeleteSession = () => {
    if (selectedSessionId) {
      deleteSession(selectedSessionId);
      handleMenuClose();
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        borderRight: '1px solid',
        borderColor: '#e0e0e0',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton 
            onClick={onClose}
            sx={{ mr: 1, color: '#000' }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <AvenLogo size="small" />
            <Typography variant="h6" sx={{ color: '#000', fontWeight: 600 }}>
              Support
            </Typography>
          </Box>
        </Box>
        
        <Button
          variant="outlined"
          fullWidth
          startIcon={<AddIcon />}
          onClick={handleNewChat}
          sx={{
            color: '#000',
            borderColor: '#e0e0e0',
            backgroundColor: '#fff',
            '&:hover': {
              borderColor: '#000',
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          New Chat
        </Button>
      </Box>

      <Divider sx={{ borderColor: '#e0e0e0' }} />

      {/* Chat History */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {sessions.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              No chat history yet.
              <br />
              Start a new conversation!
            </Typography>
          </Box>
        ) : (
          <List dense>
            {sessions.map((session) => (
              <ListItem key={session.id} disablePadding>
                <ListItemButton
                  selected={currentSession?.id === session.id}
                  onClick={() => handleSessionClick(session)}
                  sx={{
                    mx: 1,
                    my: 0.5,
                    borderRadius: 1,
                    '&.Mui-selected': {
                      backgroundColor: '#f0f0f0',
                      '&:hover': {
                        backgroundColor: '#e8e8e8',
                      },
                    },
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  <ListItemText
                    primary={session.title}
                    secondary={formatDate(session.lastActivity)}
                    primaryTypographyProps={{
                      variant: 'body2',
                      color: '#000',
                      noWrap: true,
                    }}
                    secondaryTypographyProps={{
                      variant: 'caption',
                      color: '#666',
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, session.id)}
                    sx={{ 
                      color: '#666',
                      opacity: 0.7,
                      '&:hover': { opacity: 1, color: '#000' },
                    }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: '#e0e0e0' }}>
        <Typography variant="caption" sx={{ color: '#666' }} align="center" display="block">
          AI Support Agent for Aven
        </Typography>
        <Typography variant="caption" sx={{ color: '#666' }} align="center" display="block">
          Powered by OpenAI & Pinecone
        </Typography>
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: '#fff',
            border: '1px solid',
            borderColor: '#e0e0e0',
          },
        }}
      >
        <MenuItem onClick={handleMenuClose} disabled sx={{ color: '#999' }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Rename (Coming Soon)
        </MenuItem>
        <MenuItem onClick={handleDeleteSession} sx={{ color: '#d32f2f' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Chat
        </MenuItem>
      </Menu>
    </Box>
  );

  // Use temporary drawer for both mobile and desktop to keep menu toggle visible
  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better performance
      }}
      sx={{
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

export default Sidebar; 