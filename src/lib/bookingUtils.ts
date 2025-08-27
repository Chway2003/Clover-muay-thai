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

export const isDateInPast = (date: string): boolean => {
  return new Date(date) < new Date();
};

export const getDayName = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
};

export const getDayNumber = (date: string): number => {
  return new Date(date).getDate();
};
