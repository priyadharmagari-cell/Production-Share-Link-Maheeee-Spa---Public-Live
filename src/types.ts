/**
 * Types modeling the luxury spa and appointment system
 */

export interface Therapy {
  id: string;
  name: string;
  category: 'massages' | 'ayurvedic' | 'express' | 'scrubs-wraps' | 'partners';
  shortDescription: string;
  longDescription: string;
  benefits: string[];
  signatureIngredients: string[];
  basePrice60: number; // in INR
  basePrice90?: number; // in INR if applicable
  popular?: boolean;
  imageUrl: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number; // in INR
  description: string;
  duration: number; // in minutes
}

export interface Booking {
  id: string;
  bookingReference: string; // elegant string like MAHEEEE-XXXX
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  therapyId: string;
  therapyName: string;
  duration: 60 | 90 | 45; // minutes
  date: string; // YYYY-MM-DD
  timeSlot: string; // "10:00 AM" etc
  therapistGenderPref: 'any' | 'male' | 'female';
  addOns: AddOn[];
  totalPrice: number;
  status: 'confirmed' | 'rescheduled' | 'cancelled';
  branch?: string; // e.g., "Hyderabad" or "Zaheerabad"
  notes?: string;
  createdAt: string;
}

export interface TimeSlotStatus {
  time: string;
  capacityStatus: 'available' | 'medium' | 'limited' | 'full';
  availableTherapists: number;
}
