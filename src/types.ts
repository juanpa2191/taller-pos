export interface Workshop {
  id: string;
  name: string;
  rating: number;
  reviewsCount: number;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  distance: string; // e.g. "1.2 km"
  latitude: number; // For coordinates mapping
  longitude: number;
  hours: string;
  avatar: string;
  banner: string;
  description: string;
}

export interface Part {
  id: string;
  name: string;
  sku: string;
  brand: string;
  modelCompatibility: string[]; // List of bike models
  compatibilityRange: {
    brand: string;
    model: string;
    yearStart: number;
    yearEnd: number;
    cc: number;
  };
  price: number;
  stock: number;
  minStock: number; // For low stock alerts
  category: string;
  shelfLocation: string; // workshop ERP location e.g. "Estante A-4"
  imageUrl: string;
  workshopId: string; // The owner workshop
}

export interface Motorcycle {
  id: string;
  plate: string; // e.g. "ABC-123"
  brand: string;
  model: string;
  year: number;
  cc: number;
  mileage: number; // km
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  diagnostics: string;
  entryDate: string;
  imageUrl?: string;
}

export interface RepairItem {
  partId?: string;
  name: string;
  quantity: number;
  unitPrice: number;
  type: 'part' | 'labor';
}

export interface RepairTimelineEvent {
  id: string;
  status: 'ingress' | 'diagnosing' | 'waiting_parts' | 'repairing' | 'completed' | 'delivered';
  title: string;
  description: string;
  date: string;
  updatedBy: string;
  isCompleted: boolean;
}

export interface RepairOrder {
  id: string;
  orderNumber: string; // e.g. "RO-2026-004"
  motorcycleId: string;
  workshopId: string;
  clientName: string;
  clientPhone: string;
  status: 'ingress' | 'diagnosing' | 'waiting_parts' | 'repairing' | 'completed' | 'delivered';
  items: RepairItem[];
  notes: string;
  evidencePhotos: string[];
  timeline: RepairTimelineEvent[];
  startedAt: string;
  estimatedDelivery: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  bikeModel: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  description: string;
  type: 'alert' | 'success' | 'info' | 'warning';
  time: string;
  read: boolean;
}
