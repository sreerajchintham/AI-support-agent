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

// ChatGPT-inspired dark theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#10a37f',
      dark: '#0d8c6c',
    },
    secondary: {
      main: '#f7f7f8',
    },
    background: {
      default: '#343541',
      paper: '#444654',
    },
    text: {
      primary: '#ececf1',
      secondary: '#c5c5d2',
    },
    divider: '#565869',
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
            backgroundColor: '#40414f',
            borderRadius: 12,
            '& fieldset': {
              borderColor: '#565869',
            },
            '&:hover fieldset': {
              borderColor: '#565869',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#10a37f',
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
              marginLeft: isMobile ? 0 : (sidebarOpen ? 0 : '-260px'),
            }}
          >
            <ChatInterface onToggleSidebar={toggleSidebar} />
          </Box>

          {/* Mobile overlay */}
          {isMobile && sidebarOpen && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: theme.zIndex.drawer - 1,
              }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </Box>
      </ChatProvider>
    </ThemeProvider>
  );
}

export default App;
