// Type definitions for the College Event Management System

export interface Event {
  id: string;
  eventName: string;
  date: string;
  venue: string;
  description?: string;
  maxCapacity?: number;
}

export interface Student {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  collegeName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  universityRollNumber: string;
  batch: string;
  eventId: string;
  registeredAt: string;
}

export interface Admin {
  id: string;
  username: string;
  password: string; // In real app, this would be hashed
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}
