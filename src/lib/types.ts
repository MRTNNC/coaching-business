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
  category: string | null;
}
