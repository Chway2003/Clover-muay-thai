export const formatTime = (time: string): string => {
  return time.replace(':', '.');
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export const getNextWeekDates = (): string[] => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

// Updated function to implement the new booking restriction
// Users can only book for the current day until the next day becomes the current day
export const isDateInPast = (date: string): boolean => {
  const selectedDate = new Date(date);
  const today = new Date();
  
  // Set both dates to start of day for accurate comparison
  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  // Date is in the past if it's before today
  return selectedDate < today;
};

// New function to check if a date is bookable according to the new rules
export const isDateBookable = (date: string): boolean => {
  const selectedDate = new Date(date);
  const today = new Date();
  
  // Set both dates to start of day for accurate comparison
  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  // Date is bookable if it's today or in the future
  return selectedDate >= today;
};

// New function to get the cutoff time for same-day bookings
export const getSameDayBookingCutoff = (): Date => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
};

export const getDayName = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
};

export const getDayNumber = (date: string): number => {
  return new Date(date).getDate();
};
