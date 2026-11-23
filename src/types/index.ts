// Core types for LabLink

export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
  studentId?: string;
  facultyId?: string;
  joinedAt: string;
}

export type EquipmentStatus = 'available' | 'booked' | 'maintenance' | 'unavailable';
export type EquipmentCategory = 'microcontroller' | 'computing' | 'iot' | 'robotics' | 'measurement' | 'fabrication' | 'networking' | 'sensors';

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  department: string;
  lab: string;
  location: string;
  status: EquipmentStatus;
  image: string;
  description: string;
  specifications: Record<string, string>;
  quantity: number;
  availableCount: number;
  tags: string[];
  requiresFacultyApproval: boolean;
  maxBookingHours: number;
  rating: number;
  totalBookings: number;
}

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'cancelled';

export interface TimeSlot {
  date: string; // ISO date string
  startTime: string; // HH:mm
  endTime: string;
}

export interface Booking {
  id: string;
  equipmentId: string;
  equipmentName: string;
  studentId: string;
  studentName: string;
  department: string;
  projectTitle: string;
  projectDescription: string;
  purpose: string;
  timeSlot: TimeSlot;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  facultyApprovalRequired: boolean;
  facultyId?: string;
  facultyName?: string;
  rejectionReason?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  deadline?: string;
}

export interface Department {
  id: string;
  name: string;
  shortName: string;
  color: string;
  icon: string;
  labCount: number;
  equipmentCount: number;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  studentId: string;
  department: string;
  deadline: string;
  requiredEquipment: string[];
  status: 'planning' | 'active' | 'completed';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'booking_approved' | 'booking_rejected' | 'booking_reminder' | 'new_equipment' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AIRecommendation {
  equipment: Equipment;
  score: number;
  reasons: string[];
  availableSlots: TimeSlot[];
  alternatives?: Equipment[];
  warnings?: string[];
}

export interface SmartLabRequest {
  projectTitle: string;
  projectDescription: string;
  requiredEquipment: string[];
  preferredDepartment: string;
  deadline: string;
  requiredDuration: number; // hours
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface FilterOptions {
  search: string;
  category: string;
  department: string;
  status: string;
  sortBy: 'name' | 'availability' | 'rating' | 'bookings';
}
