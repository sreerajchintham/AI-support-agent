import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as api from '../services/api';

// Initial state
const initialState = {
  currentSession: null,
  sessions: [],
  messages: [],
  isLoading: false,
  error: null,
  suggestions: [],
};

// Action types
const ACTIONS = {
  SET_SESSION: 'SET_SESSION',
  ADD_MESSAGE: 'ADD_MESSAGE',
  UPDATE_MESSAGE: 'UPDATE_MESSAGE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SUGGESTIONS: 'SET_SUGGESTIONS',
  CLEAR_MESSAGES: 'CLEAR_MESSAGES',
  ADD_SESSION: 'ADD_SESSION',
  UPDATE_SESSION: 'UPDATE_SESSION',
  DELETE_SESSION: 'DELETE_SESSION',
};

// Reducer
function chatReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_SESSION:
      return {
        ...state,
        currentSession: action.payload,
        messages: [],
      };

    case ACTIONS.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case ACTIONS.UPDATE_MESSAGE:
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.id ? { ...msg, ...action.payload.updates } : msg
        ),
      };

    case ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case ACTIONS.SET_SUGGESTIONS:
      return {
        ...state,
        suggestions: action.payload,
      };

    case ACTIONS.CLEAR_MESSAGES:
      return {
        ...state,
        messages: [],
      };

    case ACTIONS.ADD_SESSION:
      return {
        ...state,
        sessions: [action.payload, ...state.sessions],
      };

    case ACTIONS.UPDATE_SESSION:
      return {
        ...state,
        sessions: state.sessions.map(session =>
          session.id === action.payload.id ? { ...session, ...action.payload.updates } : session
        ),
      };

    case ACTIONS.DELETE_SESSION:
      return {
        ...state,
        sessions: state.sessions.filter(session => session.id !== action.payload),
        currentSession: state.currentSession?.id === action.payload ? null : state.currentSession,
        messages: state.currentSession?.id === action.payload ? [] : state.messages,
      };

    default:
      return state;
  }
}

// Context
const ChatContext = createContext();

// Provider component
export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Create new session
  const createSession = useCallback(() => {
    const session = {
      id: uuidv4(),
      title: 'New Chat',
      createdAt: new Date(),
      lastActivity: new Date(),
    };
    
    dispatch({ type: ACTIONS.ADD_SESSION, payload: session });
    dispatch({ type: ACTIONS.SET_SESSION, payload: session });
    
    return session;
  }, []);

  // Set current session
  const setSession = useCallback((session) => {
    dispatch({ type: ACTIONS.SET_SESSION, payload: session });
  }, []);

  // Send message
  const sendMessage = useCallback(async (content) => {
    if (!content.trim()) return;

    // Ensure we have a session
    let session = state.currentSession;
    if (!session) {
      session = createSession();
    }

    // Create user message
    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    // Add user message and immediately show loading
    dispatch({ type: ACTIONS.ADD_MESSAGE, payload: userMessage });
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: ACTIONS.SET_ERROR, payload: null });
    console.log('🚀 Loading state set to true');

    try {
      // Start the API call immediately
      const apiCallPromise = api.sendMessage(content.trim(), session.id);
      
      // Wait for API response
      const response = await apiCallPromise;

      // Create assistant message
      const assistantMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        sources: response.sources || [],
      };

      // Add assistant message
      dispatch({ type: ACTIONS.ADD_MESSAGE, payload: assistantMessage });

      // Update session title if it's the first message
      if (state.messages.length === 0) {
        const title = content.length > 30 ? content.substring(0, 30) + '...' : content;
        dispatch({ 
          type: ACTIONS.UPDATE_SESSION, 
          payload: { 
            id: session.id, 
            updates: { title, lastActivity: new Date() }
          }
        });
      } else {
        // Just update last activity
        dispatch({ 
          type: ACTIONS.UPDATE_SESSION, 
          payload: { 
            id: session.id, 
            updates: { lastActivity: new Date() }
          }
        });
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      
      // Add error message
      const errorMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again.",
        timestamp: new Date(),
        isError: true,
      };
      dispatch({ type: ACTIONS.ADD_MESSAGE, payload: errorMessage });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      console.log('✅ Loading state set to false');
    }
  }, [state.currentSession, state.messages.length, createSession]);

  // Load suggestions
  const loadSuggestions = useCallback(async () => {
    try {
      const suggestions = await api.getSuggestions();
      dispatch({ type: ACTIONS.SET_SUGGESTIONS, payload: suggestions });
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  }, []);

  // Clear current chat
  const clearChat = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_MESSAGES });
    if (state.currentSession) {
      // Create new session for fresh start
      createSession();
    }
  }, [state.currentSession, createSession]);

  // Delete session
  const deleteSession = useCallback((sessionId) => {
    dispatch({ type: ACTIONS.DELETE_SESSION, payload: sessionId });
  }, []);

  // Context value
  const value = {
    // State
    ...state,
    
    // Actions
    createSession,
    setSession,
    sendMessage,
    loadSuggestions,
    clearChat,
    deleteSession,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

// Hook to use context
export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
} 