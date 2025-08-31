const fs = require('fs');
const path = require('path');

// Clear old bookings that use the old user ID system
const bookingsPath = path.join(__dirname, 'data', 'bookings.json');

try {
  if (fs.existsSync(bookingsPath)) {
    const data = fs.readFileSync(bookingsPath, 'utf-8');
    const bookings = JSON.parse(data);
    
    console.log('Current bookings:', bookings.length);
    console.log('Sample booking:', bookings[0]);
    
    // Clear all bookings to start fresh
    fs.writeFileSync(bookingsPath, JSON.stringify([], null, 2));
    console.log('✅ Cleared all old bookings');
  } else {
    console.log('No bookings file found');
  }
} catch (error) {
  console.error('Error clearing bookings:', error);
}
