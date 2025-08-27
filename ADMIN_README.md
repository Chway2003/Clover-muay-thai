# Clover Muay Thai - Admin System

## Overview
The admin system provides administrative users with the ability to manage classes, view bookings, and control the gym's schedule.

## Admin Access
- **Default Admin User:** `clovermuaythai@gmail.com` (name: admin, password: same as before)
- **Admin Field:** Users have an `isAdmin` boolean field (default: `false`)
- **Access Control:** Only users with `isAdmin: true` can access `/admin`

## Admin Features

### 1. Dashboard Overview
- View all upcoming classes for the next 30 days
- See booking counts and availability for each class
- Monitor class capacity (spots filled vs. total spots)

### 2. Class Management
- **Add New Classes:** Create new time slots with custom parameters
- **Remove Classes:** Delete existing classes (cancels all bookings)
- **Class Parameters:**
  - Day of week (Monday-Friday)
  - Start/End times
  - Class type and instructor
  - Maximum spots available
  - Description

### 3. Booking Management
- **View Bookings:** See all users booked for each class
- **Cancel Bookings:** Admin can cancel individual user bookings
- **Booking Details:** User name, email, and booking timestamp

### 4. Security Features
- **Route Protection:** Non-admin users redirected to home page
- **API Authorization:** Admin endpoints require authentication
- **User Isolation:** Admins can only manage their gym's data

## Technical Implementation

### API Endpoints
- `GET /api/admin/classes` - Fetch all classes with booking data
- `POST /api/admin/classes` - Add new class to timetable
- `DELETE /api/admin/classes?classId=X` - Remove class
- `DELETE /api/admin/bookings/[id]` - Cancel user booking

### Data Structure
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  isAdmin: boolean; // New field
}

interface AdminClass {
  id: string;
  classId: string;
  className: string;
  day: string;
  date: string;
  time: string;
  endTime: string;
  instructor: string;
  maxSpots: number;
  currentBookings: number;
  availableSpots: number;
  isFull: boolean;
  bookings: Booking[];
}
```

### Navigation
- **Header:** Admin link appears only for admin users
- **Mobile Menu:** Admin link included in responsive navigation
- **Access:** Direct navigation to `/admin` protected

## Usage Instructions

### For Gym Owners/Admins:
1. **Login** with admin account
2. **Navigate** to Admin Dashboard (`/admin`)
3. **View** current class schedule and bookings
4. **Add** new classes as needed
5. **Manage** user bookings (cancel if necessary)
6. **Remove** classes that are no longer offered

### For Regular Users:
- Cannot access admin area
- Redirected to home page if attempting to access `/admin`
- Normal booking functionality remains unchanged

## Security Notes
- **JWT Tokens:** Used for API authentication
- **Admin Check:** Server-side validation of admin status
- **Data Isolation:** Users can only see their own bookings
- **Confirmation:** Class removal requires user confirmation

## Future Enhancements
- **Advanced Analytics:** Booking trends and class popularity
- **Bulk Operations:** Mass booking management
- **User Management:** Admin user creation and role management
- **Notification System:** Automated alerts for full classes
- **Reporting:** Export booking data and class schedules
