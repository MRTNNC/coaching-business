export type Role = "admin" | "client";

export interface Profile {
  id: string;
  role: Role;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
}

export const CHECKIN_DAYS = [
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
  "Monday",
] as const;

export type CheckinDay = (typeof CHECKIN_DAYS)[number];

export interface DailyLogEntry {
  day: CheckinDay;
  weight: string;
  steps: string;
  hydration: string;
}

export interface CheckinResponses {
  energy: string;
  mood: string;
  hunger: string;
  cravings: string;
  stress: string;
  sleep_hours: string;
  sleep_quality: string;
  sleep_consistency: string;
  strength: string;
  focus: string;
  recovery: string;
  training_difficulty: string;
  completed_weight_training: string;
  completed_cardio: string;
  meals_as_planned: string;
  supplements_taken: string;
  peds_as_prescribed: string;
  bloating: string;
  toilet_visits: string;
  gas: string;
  biggest_win: string;
  areas_to_improve: string;
  additional_comments: string;
}

export interface Checkin {
  id: string;
  client_id: string;
  submitted_at: string;
  week_start: string | null;
  waist_cm: number | null;
  blood_pressure: string | null;
  blood_glucose: string | null;
  daily_log: DailyLogEntry[];
  responses: CheckinResponses;
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
  voice_note_path: string | null;
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
  monthly_equivalent: number | null;
  stripe_price_id: string | null;
  sort_order: number;
  is_addon: boolean;
}
