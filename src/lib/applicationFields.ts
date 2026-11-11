// Coaching application questions, mirroring the Arzuno Client Intake Form.
// Used by both the /apply form and the /api/apply email, so the two can't
// drift apart.

export type ApplicationFieldType =
  | "text"
  | "email"
  | "tel"
  | "textarea"
  | "choice"
  | "select"
  | "yesno";

export interface ApplicationFieldConfig {
  key: string;
  label: string;
  type: ApplicationFieldType;
  required?: boolean;
  options?: string[];
}

export interface ApplicationSection {
  title: string;
  intro?: string[];
  fields: ApplicationFieldConfig[];
}

export const APPLICATION_SECTIONS: ApplicationSection[] = [
  {
    title: "1. About you",
    fields: [
      { key: "name", label: "Full name", type: "text", required: true },
      { key: "email", label: "Email", type: "email", required: true },
      { key: "phone", label: "Phone (optional)", type: "tel" },
      { key: "age", label: "Age", type: "text" },
      { key: "location", label: "Location and time zone", type: "text" },
      {
        key: "occupation",
        label: "Occupation and typical working hours",
        type: "text",
      },
      { key: "height", label: "Height", type: "text" },
      { key: "bodyweight", label: "Current bodyweight (kg)", type: "text" },
      { key: "referral", label: "How did you hear about me?", type: "text" },
    ],
  },
  {
    title: "2. Your goals",
    fields: [
      {
        key: "main_goal",
        label: "What's your main goal right now?",
        type: "choice",
        required: true,
        options: [
          "Lose body fat",
          "Build muscle",
          "Recomposition (lose fat and build muscle)",
          "Prepare for a bodybuilding or physique show",
          "Get stronger",
          "General health and consistency",
          "Other (describe below)",
        ],
      },
      {
        key: "goal_description",
        label: "Describe your goal in your own words",
        type: "textarea",
      },
      {
        key: "goal_why_now",
        label: "Why is this important to you now?",
        type: "textarea",
      },
      {
        key: "goal_12_weeks",
        label: "What would success look like in 12 weeks?",
        type: "textarea",
      },
      {
        key: "target_date",
        label: "Is there a date you're working towards (holiday, wedding, show)?",
        type: "text",
      },
      {
        key: "competition",
        label: "If competing: federation, division and show date",
        type: "text",
      },
      {
        key: "past_barriers",
        label: "What has stopped you reaching this goal before?",
        type: "textarea",
      },
    ],
  },
  {
    title: "3. Training",
    fields: [
      {
        key: "training_history",
        label: "How long have you been training consistently?",
        type: "text",
      },
      {
        key: "current_routine",
        label:
          "Describe your current routine (split, days per week, session length)",
        type: "textarea",
      },
      {
        key: "main_lifts",
        label: "Main lifts and current working weights, if you know them",
        type: "textarea",
      },
      {
        key: "cardio",
        label: "Cardio: type, how often, how long",
        type: "textarea",
      },
      {
        key: "daily_steps",
        label: "Average daily steps, if you track them",
        type: "text",
      },
      {
        key: "training_location",
        label: "Where do you train (commercial gym, home gym, other)?",
        type: "text",
      },
      {
        key: "equipment_limits",
        label: "Any equipment you don't have access to?",
        type: "text",
      },
      {
        key: "training_days",
        label: "How many days per week can you realistically train?",
        type: "text",
      },
      {
        key: "session_length",
        label: "How long can each session be?",
        type: "text",
      },
      {
        key: "training_time",
        label: "What time of day do you usually train?",
        type: "text",
      },
      {
        key: "exercises_enjoy",
        label: "Exercises you enjoy",
        type: "textarea",
      },
      {
        key: "exercises_dislike",
        label: "Exercises you dislike or can't do",
        type: "textarea",
      },
    ],
  },
  {
    title: "4. Nutrition and lifestyle",
    fields: [
      {
        key: "typical_eating",
        label: "Describe a typical day of eating (meals, snacks, drinks)",
        type: "textarea",
      },
      {
        key: "tracking_history",
        label: "Have you tracked calories or macros before? Which app?",
        type: "text",
      },
      {
        key: "dietary_choices",
        label: "Dietary choices (vegetarian, vegan, halal, etc.)",
        type: "text",
      },
      { key: "foods_avoid", label: "Foods you won't eat", type: "textarea" },
      {
        key: "cooking",
        label: "Who does the cooking and food shopping at home?",
        type: "text",
      },
      {
        key: "eating_out",
        label: "How often do you eat out or order takeaway?",
        type: "text",
      },
      {
        key: "alcohol",
        label: "Alcohol: roughly how many units per week?",
        type: "text",
      },
      {
        key: "supplements",
        label: "Supplements you currently take",
        type: "textarea",
      },
      {
        key: "sleep",
        label: "Average sleep per night (hours)",
        type: "text",
      },
      {
        key: "stress",
        label: "Stress level day to day (1 to 10)",
        type: "select",
        options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      },
      {
        key: "work_pattern",
        label: "Work pattern (office, hybrid, shifts, travel)",
        type: "text",
      },
      {
        key: "weekly_constraints",
        label:
          "Anything else in your week that affects training or eating (kids, commute, caring duties)?",
        type: "textarea",
      },
    ],
  },
  {
    title: "5. Health and injuries",
    intro: [
      "If you answer yes to any question below, please speak to your GP before starting a new training or nutrition plan. I may ask for confirmation that you're cleared to train.",
      "I'm a coach, not a medical professional. Coaching doesn't replace advice from your GP or physio.",
    ],
    fields: [
      {
        key: "health_heart",
        label:
          "Has a doctor ever said you have a heart condition or high blood pressure?",
        type: "yesno",
        required: true,
      },
      {
        key: "health_chest_pain",
        label:
          "Do you get chest pain, dizziness or loss of balance during or after exercise?",
        type: "yesno",
        required: true,
      },
      {
        key: "health_joint",
        label:
          "Do you have a bone, joint or muscle problem that exercise could make worse?",
        type: "yesno",
        required: true,
      },
      {
        key: "health_injuries",
        label: "Any current or past injuries I should know about?",
        type: "yesno",
        required: true,
      },
      {
        key: "health_surgery",
        label: "Any surgery in the last 12 months?",
        type: "yesno",
        required: true,
      },
      {
        key: "health_condition",
        label:
          "Do you have a medical condition that affects exercise or diet (e.g. diabetes, asthma)?",
        type: "yesno",
        required: true,
      },
      {
        key: "health_medication",
        label: "Are you taking any prescribed medication?",
        type: "yesno",
        required: true,
      },
      {
        key: "health_allergies",
        label: "Do you have any food allergies or intolerances?",
        type: "yesno",
        required: true,
      },
      {
        key: "health_pregnancy",
        label:
          "Are you pregnant or have you given birth in the last 12 months?",
        type: "yesno",
        required: true,
      },
      {
        key: "health_other",
        label:
          "Is there any other reason you shouldn't exercise or change your diet?",
        type: "yesno",
        required: true,
      },
    ],
  },
  {
    title: "6. Coaching",
    fields: [
      {
        key: "past_coaching",
        label:
          "Have you worked with a coach before? What worked and what didn't?",
        type: "textarea",
      },
      {
        key: "checkin_frequency",
        label: "How often would you like to check in?",
        type: "select",
        options: ["Weekly (suggested)", "Fortnightly"],
      },
      {
        key: "communication",
        label: "How do you prefer to communicate?",
        type: "select",
        options: ["App", "Email", "WhatsApp"],
      },
      {
        key: "progress_photos",
        label: "Are you happy to share weekly progress photos and bodyweight?",
        type: "select",
        options: ["Yes", "No", "Not sure"],
      },
      {
        key: "package",
        label: "Which package are you interested in?",
        type: "select",
        // Filled in from the live coaching packages on the /apply page.
        options: [],
      },
      { key: "start_date", label: "When would you like to start?", type: "text" },
      {
        key: "worth_it",
        label: "What would make this coaching worth it for you?",
        type: "textarea",
      },
      {
        key: "anything_else",
        label: "Anything else I should know?",
        type: "textarea",
      },
    ],
  },
];

export interface ApplicationDeclaration {
  key: string;
  label: string;
  required: boolean;
}

export const APPLICATION_DECLARATIONS: ApplicationDeclaration[] = [
  {
    key: "accurate",
    label:
      "The information I've given is accurate and complete. I'll tell my coach if my health or circumstances change.",
    required: true,
  },
  {
    key: "own_risk",
    label:
      "I understand that I take part at my own risk and should stop and seek medical advice if I feel unwell.",
    required: true,
  },
  {
    key: "data_consent",
    label:
      "I consent to my coach storing and using the information on this form, including health information, to plan and deliver my coaching. It will be kept securely, not shared without my permission, and deleted on request in line with UK GDPR.",
    required: true,
  },
  {
    key: "marketing_photos",
    label:
      "I'm happy for progress photos to be used in marketing (optional, can also be anonymised).",
    required: false,
  },
];

export const APPLICATION_FIELDS = APPLICATION_SECTIONS.flatMap(
  (section) => section.fields,
);
