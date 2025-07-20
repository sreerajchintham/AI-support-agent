# Vapi Voice Chat Setup Guide

This guide walks you through setting up Vapi voice chat capabilities for your AI Support Agent.

## 🎯 What You'll Get

- **Voice conversations** with your AI assistant
- **Real-time transcription** of voice interactions  
- **Audio visualization** and call controls
- **Function calling** to search your knowledge base
- **Seamless integration** with existing chat functionality

## 📋 Prerequisites

1. Vapi account at https://dashboard.vapi.ai
2. OpenAI API key (for voice model)
3. 11Labs account (for voice synthesis)

## 🔧 Step 1: Get Vapi Credentials

1. **Sign up for Vapi** at https://dashboard.vapi.ai
2. **Get your API keys**:
   - Go to API Keys section
   - Copy your **Private API Key** (starts with `sk_live_` or `sk_test_`)
   - Copy your **Public API Key** (starts with `pk_live_` or `pk_test_`)

## 🔑 Step 2: Configure Environment Variables

Add these variables to your backend configuration:

### Option 1: Update `backend/config.js`

Replace the placeholder values in `backend/config.js`:

```javascript
// Vapi Configuration
VAPI_API_KEY: process.env.VAPI_API_KEY || 'your_vapi_private_key_here',
VAPI_PUBLIC_KEY: process.env.VAPI_PUBLIC_KEY || 'your_vapi_public_key_here',
```

### Option 2: Create `.env` file (Recommended)

Create `backend/.env` with:

```env
# Vapi Configuration
VAPI_API_KEY=sk_live_your_private_key_here
VAPI_PUBLIC_KEY=pk_live_your_public_key_here
VAPI_WEBHOOK_SECRET=your_webhook_secret_here

# Optional: Customize voice and model
VAPI_VOICE_ID=21m00Tcm4TlvDq8ikWAM
VAPI_MODEL=gpt-4o
```

## 🗣️ Step 3: Voice Configuration (Optional)

### 11Labs Voice IDs

Popular voice options:
- `21m00Tcm4TlvDq8ikWAM` - Rachel (default, professional female)
- `EXAVITQu4vr4xnSDxMaL` - Bella (friendly female)
- `ErXwobaYiN019PkySvjV` - Antoni (professional male)
- `TxGEqnHWrfWFTfGW9XjX` - Josh (friendly male)

### Model Options

- `gpt-4o` (recommended) - Latest OpenAI model
- `gpt-4` - Standard GPT-4
- `gpt-3.5-turbo` - Faster, less expensive

## 🚀 Step 4: Start the Application

1. **Install dependencies** (if not already done):
   ```bash
   npm run install:all
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Check the console** for initialization messages:
   
   **✅ Expected Successful Startup Logs**:
   ```
   🚀 Server running on port 5001
   🔧 Starting service initialization...
   🔧 About to initialize Vapi service...
   🎙️ Initializing Vapi service...
   🔧 Creating new assistant...
   🔧 Building assistant configuration...
   🔧 Calling Vapi API to create assistant...
   🔧 Assistant created successfully, returning ID...
   ✅ Created new assistant: asst_abc123...
   🔧 Vapi service initialization complete, returning...
   ✅ Vapi service initialization completed
   ✅ All services initialized successfully
   ```

4. **Verify server is responsive**:
   ```bash
   curl -s http://localhost:5001/health
   ```
   Should return: `{"status":"OK","timestamp":"...","service":"AI Support Agent API"}`

## 🎮 Step 5: Test Voice Features

1. **Open the application** at http://localhost:3000
2. **Look for the voice button** in the top-right header
3. **Click "Start Voice Chat"** to begin a voice conversation
4. **Speak your question** about HELOC or Aven products
5. **View real-time transcription** in the sidebar (during calls)

## 🔍 Troubleshooting

### ⚠️ Backend Hanging Issues (RESOLVED)

**Previous Issue**: Backend would hang after creating Vapi assistant
```
🚀 Server running on port 5001
🎙️ Initializing Vapi service...
✅ Created new assistant: asst_abc123...
[Process appears stuck here]
```

**✅ Recent Fix Applied**: 
- **Non-blocking initialization**: Server no longer waits for Vapi to complete
- **30-second timeout**: Prevents infinite hanging
- **Immediate responsiveness**: Server responds within 1-2 seconds

**If you still experience hanging**:
1. **Check server responsiveness**:
   ```bash
   curl -s http://localhost:5001/health
   ```
   If this works, the server is fine and services are initializing in background.

2. **Kill and restart if needed**:
   ```bash
   lsof -ti:5001 -ti:3000 | xargs kill -9
   npm run dev
   ```

3. **Disable Vapi temporarily**:
   - Comment out `VAPI_API_KEY` in your configuration
   - Server will start without voice features

### "Voice chat not initialized"
- Check that VAPI_API_KEY and VAPI_PUBLIC_KEY are set correctly
- Verify your Vapi account has sufficient credits
- Check browser console for detailed error messages
- Ensure Vapi service initialization completed successfully

### "Assistant creation failed"
- Ensure OpenAI API key is valid and has credits
- Check that your Vapi account has assistant creation permissions
- Verify webhook URL is accessible (for local development, use ngrok)
- Check backend logs for specific error messages

### No audio or microphone access
- Allow microphone permissions in your browser
- Check browser compatibility (Chrome/Safari recommended)
- Ensure you're using HTTPS in production

### Function calls not working
- Verify webhook endpoint is accessible
- Check backend logs for function call processing
- Ensure knowledge base is properly initialized

### Service Initialization Timeout
If you see timeout errors:
```
⚠️ Failed to initialize Vapi service: Vapi initialization timeout
💡 Voice features will be unavailable until Vapi is properly configured
```

**Causes & Solutions**:
- **Network issues**: Check internet connection
- **API rate limits**: Wait a few minutes and restart
- **Invalid credentials**: Verify Vapi API keys
- **Service outage**: Check Vapi status page

## 🔗 Webhook Setup (Production)

For production deployments, configure your webhook URL in Vapi dashboard:

1. Go to your assistant settings in Vapi dashboard
2. Set Server URL to: `https://your-domain.com/api/vapi/webhook`
3. Add webhook secret for security

## 📊 Monitoring

### Backend Logs
Monitor these logs for voice functionality:
```
📞 Received Vapi webhook: function-call
🔧 Processing function: search_knowledge
🚀 Call started: call_abc123
🏁 Call ended: call_abc123
```

### Frontend Console
Check browser console for:
```
Voice call started
Vapi message: {type: "transcript", role: "user", transcript: "..."}
Voice call ended
```

### Health Check Monitoring
```bash
# Continuous health monitoring
watch -n 5 'curl -s http://localhost:5001/health'

# Check service initialization status
curl -s http://localhost:5001/api/vapi/config
```

## 🎛️ Advanced Configuration

### Custom Assistant Prompts

Modify the assistant system message in `backend/src/services/vapiService.js`:

```javascript
messages: [{
  role: 'system',
  content: `Your custom system prompt here...`
}]
```

### Function Extensions

Add new functions to the assistant configuration:

```javascript
functions: [
  {
    name: 'your_custom_function',
    description: 'Description of what this function does',
    parameters: {
      // Function parameters schema
    }
  }
]
```

Handle the function in `vapiService.js`:

```javascript
case 'your_custom_function':
  return await this.yourCustomFunction(functionCall.parameters);
```

### Timeout Configuration

Adjust initialization timeout in `backend/src/app.js`:

```javascript
// Change 30000 (30 seconds) to your preferred timeout
new Promise((_, reject) => 
  setTimeout(() => reject(new Error('Vapi initialization timeout')), 30000)
)
```

## 📈 Usage Analytics

The system logs call analytics including:
- Call duration
- End reasons
- Function call frequency
- Transcript data
- Initialization success/failure rates

Access logs through your backend console or implement custom analytics endpoints.

## 🔒 Security Considerations

1. **Use environment variables** for API keys
2. **Enable webhook secrets** in production
3. **Implement rate limiting** for webhook endpoints
4. **Monitor usage** to prevent abuse
5. **Use HTTPS** for all voice communications
6. **Validate webhook signatures** to prevent spoofing

## 💰 Cost Optimization

### Reduce Costs:
- Use `gpt-3.5-turbo` instead of `gpt-4o`
- Set shorter `maxDurationSeconds` (default: 600s)
- Implement usage limits per user
- Monitor and alert on high usage

### Usage Monitoring:
```javascript
// Check usage in Vapi dashboard
// Monitor OpenAI API usage
// Track 11Labs character usage
```

## 🛠️ Development Tips

### Testing Without Voice
```bash
# Start backend without Vapi
# Comment out VAPI_API_KEY in config
npm run backend:dev

# Or test API directly
curl -X POST http://localhost:5001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "test question"}'
```

### Debugging Startup Issues
```bash
# Monitor startup process
npm run backend:dev | tee startup.log

# Check for hanging
timeout 60 npm run backend:dev || echo "Server startup timeout"

# Test responsiveness
sleep 5 && curl -s http://localhost:5001/health
```

### Performance Monitoring
```bash
# Monitor response times
time curl -s http://localhost:5001/health

# Check process resource usage
ps aux | grep node

# Monitor network connections
netstat -an | grep 5001
```

## 🆘 Support

If you need help:
1. Check the [Vapi Documentation](https://docs.vapi.ai)
2. Join the [Vapi Discord Community](https://discord.gg/vapi)
3. Review backend logs for error details
4. Test with simple queries first
5. Use health check endpoint to verify server status
6. Check our troubleshooting section above for common issues

## 🎉 Success!

Once configured, you'll have:
- ✅ Voice conversations with your AI assistant
- ✅ Real-time transcription and audio visualization
- ✅ Integration with your existing knowledge base
- ✅ Professional voice experience for users
- ✅ **Fast, reliable server startup**
- ✅ **Non-blocking service initialization**
- ✅ **Comprehensive error handling and recovery**

Your AI Support Agent now supports both text and voice interactions with optimized performance! 🎤 