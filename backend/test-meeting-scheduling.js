const meetingService = require('./src/services/meetingService');

async function testMeetingScheduling() {
  console.log('🧪 Testing Meeting Scheduling Logic\n');

  // Test 1: Get available slots
  console.log('1️⃣ Getting available slots...');
  const slots = meetingService.getAvailableSlots();
  console.log(`   Found ${slots.length} available slots`);
  console.log(`   Next 3 slots:`, slots.slice(0, 3).map(s => `${s.date} at ${s.time}`));
  console.log();

  // Test 2: Schedule a meeting
  console.log('2️⃣ Scheduling a meeting...');
  const userInfo = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    notes: 'Interested in Aven Card application'
  };

  if (slots.length > 0) {
    const slotId = slots[0].id;
    const result = await meetingService.scheduleMeeting(userInfo, slotId, 'consultation');
    
    if (result.success) {
      console.log('   ✅ Meeting scheduled successfully!');
      console.log(`   Meeting ID: ${result.meeting.id}`);
      console.log(`   Date: ${result.meeting.scheduledDate} at ${result.meeting.scheduledTime}`);
      console.log(`   Confirmation Code: ${result.meeting.confirmationCode}`);
      console.log(`   Message: ${result.confirmationMessage}`);
    } else {
      console.log('   ❌ Failed to schedule meeting:', result.error);
    }
  } else {
    console.log('   ❌ No available slots to test with');
  }
  console.log();

  // Test 3: Check slot availability after booking
  console.log('3️⃣ Checking slot availability after booking...');
  if (slots.length > 0) {
    const slotId = slots[0].id;
    const available = meetingService.canScheduleMeeting(slotId);
    console.log(`   Slot ${slotId} available: ${available}`);
  }
  console.log();

  // Test 4: Get meeting statistics
  console.log('4️⃣ Getting meeting statistics...');
  const stats = meetingService.getMeetingStats();
  console.log('   Meeting Stats:', stats);
  console.log();

  // Test 5: Get next available slot
  console.log('5️⃣ Getting next available slot...');
  const nextSlot = meetingService.getNextAvailableSlot();
  if (nextSlot) {
    console.log(`   Next available: ${nextSlot.date} at ${nextSlot.time}`);
  } else {
    console.log('   No available slots');
  }
  console.log();

  console.log('✅ Meeting scheduling test completed!');
}

// Run the test
testMeetingScheduling().catch(console.error); 