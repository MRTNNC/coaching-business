export type Role = "admin" | "client";

export interface Profile {
  id: string;
  role: Role;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
}

export interface Checkin {
  id: string;
  client_id: string;
  submitted_at: string;
  weight: number | null;
  energy_rating: number | null;
  sleep_rating: number | null;
  adherence_rating: number | null;
  notes: string | null;
  status: "pending" | "reviewed";
}

export type PhotoAngle = "front" | "side" | "back";

export interface CheckinPhoto {
  id: string;
  checkin_id: string;
  storage_path: string;
  angle: PhotoAngle;
}

export interface Comment {
  id: string;
  checkin_id: string;
  admin_id: string;
  body: string;
  created_at: string;
}

export interface PlanSection {
  heading: string;
  items: string[];
}

export interface PlanContent {
  sections: PlanSection[];
  notes?: string;
}

export type PlanType = "workout" | "nutrition";

export interface Plan {
  id: string;
  client_id: string;
  plan_type: PlanType;
  title: string;
  content: PlanContent;
  version: number;
  created_at: string;
  sent_at: string | null;
}

export interface Package {
  id: string;
  name: string;
  description: string | null;
  price: number;
  billing_period: string | null;
  stripe_price_id: string | null;
  sort_order: number;
}
