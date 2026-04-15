export interface CartItem {
  id: number;
  product: number;
  product_name: string;
  product_image_url: string | null;
  product_price: string | number;
  quantity: number;
  line_total: string | number;
}

export interface Cart {
  id: number;
  subtotal_amount: string | number;
  discount_amount: string | number;
  shipping_amount: string | number;
  total_amount: string | number;
  updated_at: string;
  items: CartItem[];
}
