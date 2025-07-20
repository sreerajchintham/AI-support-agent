const express = require('express');
const router = express.Router();
const meetingService = require('../services/meetingService');
const { body, validationResult } = require('express-validator');

// Get available meeting slots
router.get('/slots', async (req, res) => {
  try {
    const { date } = req.query;
    const slots = meetingService.getAvailableSlots(date);
    
    res.json({
      success: true,
      slots: slots,
      count: slots.length
    });
  } catch (error) {
    console.error('❌ Failed to get meeting slots:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve meeting slots'
    });
  }
});

// Schedule a meeting
router.post('/schedule', [
  body('slotId').notEmpty().withMessage('Slot ID is required'),
  body('name').optional().isString().withMessage('Name must be a string'),
  body('email').optional().isEmail().withMessage('Email must be valid'),
  body('phone').optional().isString().withMessage('Phone must be a string'),
  body('meetingType').optional().isIn(['consultation', 'application', 'support']).withMessage('Invalid meeting type'),
  body('notes').optional().isString().withMessage('Notes must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { slotId, name, email, phone, meetingType, notes } = req.body;
    
    const userInfo = {
      userId: req.session?.userId || 'anonymous',
      name,
      email,
      phone,
      notes
    };

    const result = await meetingService.scheduleMeeting(userInfo, slotId, meetingType);
    
    if (result.success) {
      res.json({
        success: true,
        meeting: result.meeting,
        message: result.confirmationMessage
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ Failed to schedule meeting:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to schedule meeting'
    });
  }
});

// Cancel a meeting
router.post('/cancel/:meetingId', async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { reason } = req.body;
    
    const result = await meetingService.cancelMeeting(meetingId, reason);
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ Failed to cancel meeting:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel meeting'
    });
  }
});

// Reschedule a meeting
router.post('/reschedule/:meetingId', [
  body('newSlotId').notEmpty().withMessage('New slot ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { meetingId } = req.params;
    const { newSlotId } = req.body;
    
    const result = await meetingService.rescheduleMeeting(meetingId, newSlotId);
    
    if (result.success) {
      res.json({
        success: true,
        meeting: result.meeting,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ Failed to reschedule meeting:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reschedule meeting'
    });
  }
});

// Get meeting details
router.get('/:meetingId', async (req, res) => {
  try {
    const { meetingId } = req.params;
    const meeting = meetingService.getMeeting(meetingId);
    
    if (!meeting) {
      return res.status(404).json({
        success: false,
        error: 'Meeting not found'
      });
    }
    
    res.json({
      success: true,
      meeting: meeting
    });
  } catch (error) {
    console.error('❌ Failed to get meeting:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve meeting'
    });
  }
});

// Get user's meetings
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const meetings = meetingService.getUserMeetings(userId);
    
    res.json({
      success: true,
      meetings: meetings,
      count: meetings.length
    });
  } catch (error) {
    console.error('❌ Failed to get user meetings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user meetings'
    });
  }
});

// Get meeting statistics (admin endpoint)
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = meetingService.getMeetingStats();
    
    res.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('❌ Failed to get meeting stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve meeting statistics'
    });
  }
});

// Check slot availability
router.get('/slots/:slotId/availability', async (req, res) => {
  try {
    const { slotId } = req.params;
    const available = meetingService.canScheduleMeeting(slotId);
    
    res.json({
      success: true,
      slotId: slotId,
      available: available
    });
  } catch (error) {
    console.error('❌ Failed to check slot availability:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check slot availability'
    });
  }
});

// Get next available slot
router.get('/slots/next-available', async (req, res) => {
  try {
    const nextSlot = meetingService.getNextAvailableSlot();
    
    res.json({
      success: true,
      nextSlot: nextSlot
    });
  } catch (error) {
    console.error('❌ Failed to get next available slot:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get next available slot'
    });
  }
});

module.exports = router; 