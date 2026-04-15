import api from "@/utils/axios";
import type { Cart } from "@/types/cart";

export async function fetchCart(): Promise<Cart> {
  const { data } = await api.get<Cart>("cart/");
  return data;
}

export async function addCartItem(
  productId: number,
  quantity: number,
): Promise<Cart> {
  const { data } = await api.post<Cart>("cart/items/", {
    product_id: productId,
    quantity,
  });
  return data;
}

export async function updateCartItemQuantity(
  itemId: number,
  quantity: number,
): Promise<Cart> {
  const { data } = await api.patch<Cart>(`cart/items/${itemId}/`, { quantity });
  return data;
}

export async function removeCartItem(itemId: number): Promise<void> {
  await api.delete(`cart/items/${itemId}/`);
}
