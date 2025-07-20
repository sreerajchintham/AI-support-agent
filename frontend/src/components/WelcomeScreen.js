import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Psychology as AIIcon,
  SupportAgent as SupportIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import AvenLogo from './AvenLogo';

function WelcomeScreen({ suggestions, onSendMessage }) {
  const handleSuggestionClick = (suggestion) => {
    onSendMessage(suggestion);
  };

  const features = [
    {
      icon: <SupportIcon sx={{ fontSize: 32, color: '#000' }} />,
      title: 'Expert Support',
      description: 'Get answers about Aven Card features, rates, and applications'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 32, color: '#000' }} />,
      title: 'Instant Responses',
      description: 'Powered by AI for quick and accurate information'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 32, color: '#000' }} />,
      title: 'Secure & Private',
      description: 'Your conversations are protected and confidential'
    }
  ];

  const exampleQuestions = suggestions.length > 0 ? suggestions.slice(0, 6) : [
    "What is the Aven Card?",
    "How do I apply for an Aven Card?",
    "What are the fees?",
    "How does the interest rate work?",
    "Can I get cashback rewards?",
    "What's the maximum credit line?"
  ];

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          mb: 6,
        }}
      >
        {/* Aven Logo */}
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 2,
            backgroundColor: '#fff',
            border: '2px solid #000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AvenLogo size="large" />
        </Box>

        {/* Welcome Text */}
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: '#000',
            fontSize: { xs: '2rem', md: '3rem' },
          }}
        >
          Welcome! I'm Sarah 👋
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            mb: 4,
            maxWidth: 600,
            lineHeight: 1.6,
          }}
        >
          I'm Sarah, your AI assistant for all things Aven Card. I can help you with applications, rates, features, and even schedule meetings with our team!
        </Typography>

        {/* Features */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: '#fff',
                  border: '1px solid',
                  borderColor: '#e0e0e0',
                  borderRadius: 2,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: '#000',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Example Questions */}
        <Typography
          variant="h6"
          sx={{
            color: '#000',
            mb: 3,
            fontWeight: 600,
          }}
        >
          Try asking about:
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            justifyContent: 'center',
            maxWidth: 800,
          }}
        >
          {exampleQuestions.map((question, index) => (
            <Chip
              key={index}
              label={question}
              onClick={() => handleSuggestionClick(question)}
              variant="outlined"
              sx={{
                mb: 1,
                py: 1,
                px: 2,
                height: 'auto',
                '& .MuiChip-label': {
                  whiteSpace: 'normal',
                  padding: '8px 12px',
                },
                color: '#000',
                borderColor: '#e0e0e0',
                backgroundColor: '#fff',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                  borderColor: '#000',
                  transform: 'translateY(-1px)',
                },
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
              }}
            />
          ))}
        </Box>

        {/* Disclaimer */}
        <Typography
          variant="caption"
          sx={{
            mt: 4,
            px: 2,
            textAlign: 'center',
            maxWidth: 600,
            color: '#666',
          }}
        >
          This AI assistant provides general information about Aven products. For account-specific 
          inquiries or personalized financial advice, please contact Aven support directly at{' '}
          <strong>(888) 966-4655</strong> or <strong>support@aven.com</strong>.
        </Typography>
      </Box>
    </Container>
  );
}

export default WelcomeScreen; 