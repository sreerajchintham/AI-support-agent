# 📅 Meeting Scheduling Logic Documentation

## Overview

The meeting scheduling system allows Sarah (the AI assistant) to automatically schedule meetings with Aven representatives when users request them. The system uses **function calling** to integrate AI conversation with actual meeting booking capabilities.

## 🏗️ Architecture

```
User Request → AI Analysis → Function Call → Meeting Service → Confirmation
     ↓              ↓            ↓              ↓              ↓
"I want to    Sarah detects   get_available_  Creates slot   "Great! I've
schedule a    scheduling      slots()         booking        scheduled..."
meeting"      intent          schedule_meeting()
```

## 🔧 Core Components

### 1. Meeting Service (`backend/src/services/meetingService.js`)

**Key Functions:**
- `generateAvailableSlots()` - Creates slots for next 30 days (Mon-Fri, 9 AM - 5 PM)
- `getAvailableSlots(date)` - Returns available slots, optionally filtered by date
- `scheduleMeeting(userInfo, slotId, meetingType)` - Books a meeting
- `cancelMeeting(meetingId)` - Cancels a meeting
- `rescheduleMeeting(meetingId, newSlotId)` - Reschedules a meeting

**Slot Generation Logic:**
```javascript
// Generates slots for next 30 days
for (let day = 1; day <= 30; day++) {
  const date = new Date(now);
  date.setDate(date.getDate() + day);
  
  // Skip weekends
  if (date.getDay() === 0 || date.getDay() === 6) continue;
  
  // Generate hourly slots from 9 AM to 5 PM
  for (let hour = 9; hour <= 17; hour++) {
    // Create slot object with unique ID
  }
}
```

### 2. Function Calling Integration (`backend/src/services/openaiService.js`)

**Available Functions:**
```javascript
const functions = [
  {
    name: "get_available_slots",
    description: "Get available meeting slots for scheduling",
    parameters: {
      type: "object",
      properties: {
        date: {
          type: "string",
          description: "Optional date filter (YYYY-MM-DD format)"
        }
      }
    }
  },
  {
    name: "schedule_meeting",
    description: "Schedule a meeting with Aven representative",
    parameters: {
      type: "object",
      properties: {
        slotId: { type: "string", description: "Selected slot ID" },
        name: { type: "string", description: "User's full name" },
        email: { type: "string", description: "User's email" },
        phone: { type: "string", description: "User's phone" },
        meetingType: { 
          type: "string", 
          enum: ["consultation", "application", "support"],
          description: "Type of meeting"
        },
        notes: { type: "string", description: "Optional notes" }
      },
      required: ["slotId", "name", "email", "phone"]
    }
  }
];
```

### 3. Knowledge Service Integration (`backend/src/services/knowledgeService.js`)

**Function Handling:**
```javascript
// Check if response includes function calls
if (response.choices[0].message.function_call) {
  const functionCall = response.choices[0].message.function_call;
  const functionName = functionCall.name;
  const functionArgs = JSON.parse(functionCall.arguments);
  
  // Handle function calls
  switch (functionName) {
    case 'get_available_slots':
      functionResult = await this.handleGetAvailableSlots(functionArgs);
      break;
    case 'schedule_meeting':
      functionResult = await this.handleScheduleMeeting(functionArgs);
      break;
  }
  
  // Generate final response with function result
  const finalResponse = await this.generateFunctionResponse(...);
}
```

## 🔄 Meeting Scheduling Flow

### Step 1: User Requests Meeting
```
User: "I'd like to schedule a meeting to discuss the Aven Card"
```

### Step 2: AI Detects Intent
Sarah analyzes the message and determines the user wants to schedule a meeting.

### Step 3: Function Call - Get Available Slots
```javascript
// AI calls get_available_slots function
{
  "name": "get_available_slots",
  "arguments": "{}"  // No date filter, get all available slots
}
```

### Step 4: Present Options to User
```
Sarah: "I found 180 available meeting slots. Here are the next few options:
- Tomorrow at 10:00 AM
- Tomorrow at 2:00 PM  
- Wednesday at 9:00 AM
- Wednesday at 3:00 PM

What type of meeting would you like to schedule? I can help with:
- Consultation (general questions about Aven products)
- Application (help with the application process)
- Support (technical or account issues)

Please let me know your preference and provide your contact information."
```

### Step 5: User Provides Information
```
User: "I'd like a consultation tomorrow at 10 AM. My name is John Doe, 
email is john.doe@example.com, and phone is (555) 123-4567."
```

### Step 6: Function Call - Schedule Meeting
```javascript
// AI calls schedule_meeting function
{
  "name": "schedule_meeting",
  "arguments": {
    "slotId": "slot_12345",
    "name": "John Doe",
    "email": "john.doe@example.com", 
    "phone": "(555) 123-4567",
    "meetingType": "consultation",
    "notes": "General consultation about Aven Card"
  }
}
```

### Step 7: Confirmation
```
Sarah: "Great! I've scheduled your consultation meeting with Aven for 
tomorrow at 10:00 AM. Your confirmation code is ABC123. You'll receive 
a calendar invitation and reminder email shortly. If you need to 
reschedule, please call us at (888) 966-4655."
```

## 📊 Meeting Types

### 1. Consultation
- **Purpose**: General questions about Aven products
- **Duration**: 30 minutes
- **Best for**: New customers exploring options

### 2. Application  
- **Purpose**: Help with the application process
- **Duration**: 45 minutes
- **Best for**: Customers ready to apply

### 3. Support
- **Purpose**: Technical or account support
- **Duration**: 30 minutes
- **Best for**: Existing customers with issues

## 🕐 Availability Rules

### Business Hours
- **Days**: Monday - Friday
- **Hours**: 9:00 AM - 5:00 PM
- **Time Zone**: User's local timezone (handled by frontend)

### Booking Window
- **Advance Booking**: Up to 30 days in advance
- **Same Day**: Available if slots exist
- **Cancellation**: Up to 24 hours before meeting

### Slot Management
- **Duration**: 1-hour slots
- **Buffer**: 15-minute buffer between meetings
- **Max Per Day**: 8 slots per day (9 AM - 5 PM)

## 🔐 Data Management

### User Information Collected
- **Required**: Name, Email, Phone
- **Optional**: Notes, Meeting Type
- **Generated**: Confirmation Code, Meeting ID

### Storage
- **Current**: In-memory Map (for demo)
- **Production**: Database with encryption
- **Backup**: Regular backups of meeting data

### Privacy & Security
- **PII Protection**: Email and phone encrypted
- **Access Control**: Admin-only access to meeting data
- **Audit Trail**: All scheduling actions logged

## 🧪 Testing

### Manual Testing
```bash
# Test meeting scheduling logic
cd backend
node test-meeting-scheduling.js
```

### API Testing
```bash
# Get available slots
curl http://localhost:5001/api/meetings/slots

# Schedule a meeting
curl -X POST http://localhost:5001/api/meetings/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "slotId": "slot_12345",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "(555) 123-4567",
    "meetingType": "consultation"
  }'
```

### AI Integration Testing
```
User: "Can you schedule a meeting for me?"
Sarah: [Should call get_available_slots function]

User: "I want tomorrow at 10 AM, my name is John Doe..."
Sarah: [Should call schedule_meeting function]
```

## 🚀 Future Enhancements

### Planned Features
1. **Calendar Integration**: Google Calendar, Outlook sync
2. **Email Notifications**: Automated reminders and confirmations
3. **Video Conferencing**: Zoom/Teams integration
4. **Rescheduling**: AI-powered rescheduling logic
5. **Analytics**: Meeting success metrics and follow-up

### Technical Improvements
1. **Database Integration**: Replace in-memory storage
2. **Real-time Updates**: WebSocket for live availability
3. **Multi-timezone**: Proper timezone handling
4. **Conflict Resolution**: Handle double-bookings
5. **Recurring Meetings**: Support for regular appointments

## 🔧 Troubleshooting

### Common Issues

**1. No Available Slots**
- Check if business hours are correct
- Verify slot generation logic
- Check for timezone issues

**2. Function Call Failures**
- Verify OpenAI API key
- Check function definitions
- Review error logs

**3. Meeting Not Scheduled**
- Validate user input
- Check slot availability
- Verify meeting service status

### Debug Commands
```bash
# Check meeting service status
curl http://localhost:5001/api/meetings/stats/overview

# Verify slot availability
curl http://localhost:5001/api/meetings/slots/next-available

# Test function calling
curl -X POST http://localhost:5001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "I want to schedule a meeting"}'
```

## 📝 Summary

The meeting scheduling logic provides a seamless integration between AI conversation and actual meeting booking capabilities. Users can naturally request meetings through text or voice, and Sarah will automatically handle the entire scheduling process while maintaining a conversational experience.

The system is designed to be:
- **User-friendly**: Natural language interaction
- **Reliable**: Comprehensive error handling
- **Scalable**: Easy to extend with new features
- **Secure**: Proper data protection and validation 