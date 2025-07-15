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
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Menu as MenuIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useChat } from '../context/ChatContext';

const DRAWER_WIDTH = 260;

function Sidebar({ open, onToggle, isMobile }) {
  const theme = useTheme();
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
    onToggle(); // Close sidebar after selecting a session
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
        backgroundColor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton 
            onClick={onToggle}
            sx={{ mr: 1, color: 'text.primary' }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ color: 'text.primary', flexGrow: 1 }}>
            Aven Support
          </Typography>
        </Box>
        
        <Button
          variant="outlined"
          fullWidth
          startIcon={<AddIcon />}
          onClick={handleNewChat}
          sx={{
            color: 'text.primary',
            borderColor: 'divider',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover',
            },
          }}
        >
          New Chat
        </Button>
      </Box>

      <Divider sx={{ borderColor: 'divider' }} />

      {/* Chat History */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {sessions.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
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
                      backgroundColor: 'action.selected',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemText
                    primary={session.title}
                    secondary={formatDate(session.lastActivity)}
                    primaryTypographyProps={{
                      variant: 'body2',
                      color: 'text.primary',
                      noWrap: true,
                    }}
                    secondaryTypographyProps={{
                      variant: 'caption',
                      color: 'text.secondary',
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, session.id)}
                    sx={{ 
                      color: 'text.secondary',
                      opacity: 0.7,
                      '&:hover': { opacity: 1 },
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
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          AI Support Agent for Aven
        </Typography>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
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
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <MenuItem onClick={handleMenuClose} disabled>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Rename (Coming Soon)
        </MenuItem>
        <MenuItem onClick={handleDeleteSession} sx={{ color: 'error.main' }}>
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
      onClose={onToggle}
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