import { CHECKIN_DAYS, type CheckinResponses } from "@/lib/types";

export const DAYS = CHECKIN_DAYS;

export type CheckinFieldType = "rating" | "text" | "textarea";

export interface CheckinFieldConfig {
  key: keyof CheckinResponses;
  label: string;
  type: CheckinFieldType;
}

export const GENERAL_FIELDS: CheckinFieldConfig[] = [
  { key: "energy", label: "Daily energy levels (1-10)", type: "rating" },
  { key: "mood", label: "Mood (1-10)", type: "rating" },
  { key: "hunger", label: "Hunger levels (1-10)", type: "rating" },
  { key: "cravings", label: "Any cravings? If so, what for?", type: "text" },
  { key: "stress", label: "Stress levels (1-10)", type: "rating" },
  {
    key: "sleep_hours",
    label: "Sleep — average hours per night",
    type: "text",
  },
  { key: "sleep_quality", label: "Sleep quality (1-10)", type: "rating" },
  {
    key: "sleep_consistency",
    label:
      "Are you consistently going to bed and waking up at the same time every day?",
    type: "text",
  },
];

export const TRAINING_FIELDS: CheckinFieldConfig[] = [
  {
    key: "strength",
    label: "Strength levels in training (1-10)",
    type: "rating",
  },
  {
    key: "focus",
    label: "Focus and concentration in training (1-10)",
    type: "rating",
  },
  {
    key: "recovery",
    label: "Recovery (soreness, fatigue) (1-10)",
    type: "rating",
  },
  {
    key: "training_difficulty",
    label:
      "How hard are you finding the current training and cardio plan? (1-10)",
    type: "rating",
  },
  {
    key: "completed_weight_training",
    label: "Did you complete all weight training? (if not, why?)",
    type: "textarea",
  },
  {
    key: "completed_cardio",
    label:
      "Did you complete all cardio sessions and hit your step target? (if not, why?)",
    type: "textarea",
  },
];

export const NUTRITION_FIELDS: CheckinFieldConfig[] = [
  {
    key: "meals_as_planned",
    label: "Did you eat all your meals as per the plan? (if not, please elaborate)",
    type: "textarea",
  },
  {
    key: "supplements_taken",
    label: "Have you remembered to take all your supplements?",
    type: "text",
  },
  {
    key: "peds_as_prescribed",
    label: "If PEDs are in play, have you taken them as prescribed?",
    type: "text",
  },
  { key: "bloating", label: "Bloating / stomach cramps", type: "text" },
  { key: "toilet_visits", label: "Number of toilet visits", type: "text" },
  { key: "gas", label: "Gas / wind / belching", type: "text" },
];

export const CLOSING_FIELDS: CheckinFieldConfig[] = [
  {
    key: "biggest_win",
    label: "What was your biggest win last week?",
    type: "textarea",
  },
  {
    key: "areas_to_improve",
    label: "Are there any areas you could have improved on?",
    type: "textarea",
  },
  {
    key: "additional_comments",
    label: "Any additional comments from the week?",
    type: "textarea",
  },
];

export const ALL_CHECKIN_FIELDS: CheckinFieldConfig[] = [
  ...GENERAL_FIELDS,
  ...TRAINING_FIELDS,
  ...NUTRITION_FIELDS,
  ...CLOSING_FIELDS,
];
