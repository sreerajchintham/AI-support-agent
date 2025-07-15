import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CssBaseline, 
  ThemeProvider, 
  createTheme,
  useMediaQuery
} from '@mui/material';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import { ChatProvider } from './context/ChatContext';
import './App.css';

// Aven-inspired light theme with white and black colors
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
      dark: '#1a1a1a',
      light: '#333333',
    },
    secondary: {
      main: '#666666',
    },
    background: {
      default: '#ffffff',
      paper: '#f8f9fa',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
    divider: '#e0e0e0',
    action: {
      hover: '#f5f5f5',
      selected: '#f0f0f0',
    },
  },
  typography: {
    fontFamily: '"Söhne", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", sans-serif',
    fontSize: 14,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"Söhne", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", sans-serif',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 6,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#ffffff',
            borderRadius: 12,
            '& fieldset': {
              borderColor: '#e0e0e0',
            },
            '&:hover fieldset': {
              borderColor: '#bdbdbd',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#000000',
            },
          },
        },
      },
    },
  },
});

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ChatProvider>
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
          {/* Sidebar */}
          <Sidebar 
            open={sidebarOpen} 
            onToggle={toggleSidebar}
            isMobile={isMobile}
          />
          
          {/* Main Chat Area */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              height: '100vh',
              overflow: 'hidden',
              backgroundColor: 'background.default',
              transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              marginLeft: 0, // Keep main content in place
              width: '100%', // Ensure full width
            }}
          >
            <ChatInterface onToggleSidebar={toggleSidebar} />
          </Box>

          {/* Overlay is handled by the temporary drawer */}
        </Box>
      </ChatProvider>
    </ThemeProvider>
  );
}

export default App;
