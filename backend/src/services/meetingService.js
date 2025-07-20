const { v4: uuidv4 } = require('uuid');

class MeetingService {
  constructor() {
    this.meetings = new Map(); // In-memory storage for demo (use database in production)
    this.availableSlots = this.generateAvailableSlots();
  }

  // Generate available meeting slots for the next 30 days
  generateAvailableSlots() {
    const slots = [];
    const now = new Date();
    
    // Generate slots for next 30 days, Monday-Friday, 9 AM - 5 PM
    for (let day = 1; day <= 30; day++) {
      const date = new Date(now);
      date.setDate(date.getDate() + day);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      // Generate hourly slots from 9 AM to 5 PM
      for (let hour = 9; hour <= 17; hour++) {
        const slotTime = new Date(date);
        slotTime.setHours(hour, 0, 0, 0);
        
        slots.push({
          id: uuidv4(),
          date: slotTime.toISOString().split('T')[0],
          time: `${hour.toString().padStart(2, '0')}:00`,
          datetime: slotTime.toISOString(),
          available: true,
          type: 'consultation'
        });
      }
    }
    
    return slots;
  }

  // Get available meeting slots
  getAvailableSlots(date = null) {
    let slots = this.availableSlots.filter(slot => slot.available);
    
    if (date) {
      slots = slots.filter(slot => slot.date === date);
    }
    
    return slots.slice(0, 10); // Return max 10 slots
  }

  // Schedule a meeting
  async scheduleMeeting(userInfo, slotId, meetingType = 'consultation') {
    try {
      const slot = this.availableSlots.find(s => s.id === slotId);
      
      if (!slot) {
        throw new Error('Meeting slot not found');
      }
      
      if (!slot.available) {
        throw new Error('Meeting slot is no longer available');
      }

      const meeting = {
        id: uuidv4(),
        slotId: slotId,
        userId: userInfo.userId || 'anonymous',
        userName: userInfo.name || 'Anonymous User',
        userEmail: userInfo.email || 'no-email@example.com',
        userPhone: userInfo.phone || 'No phone provided',
        meetingType: meetingType,
        scheduledDate: slot.date,
        scheduledTime: slot.time,
        scheduledDateTime: slot.datetime,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        notes: userInfo.notes || '',
        confirmationCode: this.generateConfirmationCode()
      };

      // Mark slot as unavailable
      slot.available = false;
      
      // Store meeting
      this.meetings.set(meeting.id, meeting);

      console.log(`📅 Meeting scheduled: ${meeting.id} for ${meeting.scheduledDate} at ${meeting.scheduledTime}`);

      return {
        success: true,
        meeting: meeting,
        confirmationMessage: this.generateConfirmationMessage(meeting)
      };
    } catch (error) {
      console.error('❌ Failed to schedule meeting:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate confirmation code
  generateConfirmationCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Generate confirmation message
  generateConfirmationMessage(meeting) {
    return `Great! I've scheduled your ${meeting.meetingType} meeting with Aven for ${meeting.scheduledDate} at ${meeting.scheduledTime}. Your confirmation code is ${meeting.confirmationCode}. You'll receive a calendar invitation and reminder email shortly. If you need to reschedule, please call us at (888) 966-4655.`;
  }

  // Get meeting details
  getMeeting(meetingId) {
    return this.meetings.get(meetingId);
  }

  // Cancel a meeting
  async cancelMeeting(meetingId, reason = 'User requested cancellation') {
    try {
      const meeting = this.meetings.get(meetingId);
      
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      // Mark slot as available again
      const slot = this.availableSlots.find(s => s.id === meeting.slotId);
      if (slot) {
        slot.available = true;
      }

      // Update meeting status
      meeting.status = 'cancelled';
      meeting.cancelledAt = new Date().toISOString();
      meeting.cancellationReason = reason;

      console.log(`❌ Meeting cancelled: ${meetingId}`);

      return {
        success: true,
        message: 'Meeting cancelled successfully'
      };
    } catch (error) {
      console.error('❌ Failed to cancel meeting:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Reschedule a meeting
  async rescheduleMeeting(meetingId, newSlotId) {
    try {
      const meeting = this.meetings.get(meetingId);
      
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      const newSlot = this.availableSlots.find(s => s.id === newSlotId);
      
      if (!newSlot) {
        throw new Error('New meeting slot not found');
      }
      
      if (!newSlot.available) {
        throw new Error('New meeting slot is not available');
      }

      // Mark old slot as available
      const oldSlot = this.availableSlots.find(s => s.id === meeting.slotId);
      if (oldSlot) {
        oldSlot.available = true;
      }

      // Mark new slot as unavailable
      newSlot.available = false;

      // Update meeting details
      meeting.slotId = newSlotId;
      meeting.scheduledDate = newSlot.date;
      meeting.scheduledTime = newSlot.time;
      meeting.scheduledDateTime = newSlot.datetime;
      meeting.updatedAt = new Date().toISOString();

      console.log(`🔄 Meeting rescheduled: ${meetingId} to ${newSlot.date} at ${newSlot.time}`);

      return {
        success: true,
        meeting: meeting,
        message: `Meeting rescheduled to ${newSlot.date} at ${newSlot.time}`
      };
    } catch (error) {
      console.error('❌ Failed to reschedule meeting:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get user's meetings
  getUserMeetings(userId) {
    return Array.from(this.meetings.values())
      .filter(meeting => meeting.userId === userId)
      .sort((a, b) => new Date(a.scheduledDateTime) - new Date(b.scheduledDateTime));
  }

  // Get meeting statistics
  getMeetingStats() {
    const meetings = Array.from(this.meetings.values());
    
    return {
      total: meetings.length,
      scheduled: meetings.filter(m => m.status === 'scheduled').length,
      cancelled: meetings.filter(m => m.status === 'cancelled').length,
      completed: meetings.filter(m => m.status === 'completed').length,
      availableSlots: this.availableSlots.filter(s => s.available).length
    };
  }

  // Check if a meeting can be scheduled
  canScheduleMeeting(slotId) {
    const slot = this.availableSlots.find(s => s.id === slotId);
    return slot && slot.available;
  }

  // Get next available slot
  getNextAvailableSlot() {
    const available = this.availableSlots.filter(s => s.available);
    return available.length > 0 ? available[0] : null;
  }
}

module.exports = new MeetingService(); 