"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation/navigation";
import Footer from "@/components/Footer/footer";
import { extractApiErrorMessage } from "@/services/auth.service";
import {
  fetchCart,
  removeCartItem,
  updateCartItemQuantity,
} from "@/services/cart.service";
import type { Cart } from "@/types/cart";
import styles from "./page.module.scss";

const PLACEHOLDER_IMAGE = "/images/products/black-tshirt.png";

function toNumber(value: string | number | null | undefined): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyItemId, setBusyItemId] = useState<number | null>(null);
  const items = cart?.items ?? [];

  useEffect(() => {
    let cancelled = false;
    async function loadCart() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCart();
        if (!cancelled) setCart(data);
      } catch (err) {
        if (!cancelled) setError(extractApiErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadCart();
    return () => {
      cancelled = true;
    };
  }, []);

  const subtotal = useMemo(() => toNumber(cart?.subtotal_amount), [cart]);
  const discountAmount = useMemo(() => toNumber(cart?.discount_amount), [cart]);
  const deliveryFee = useMemo(() => toNumber(cart?.shipping_amount), [cart]);
  const total = useMemo(() => toNumber(cart?.total_amount), [cart]);
  const discountPercent = subtotal > 0 ? Math.round((discountAmount / subtotal) * 100) : 0;

  const updateQuantity = async (id: number, nextQuantity: number) => {
    if (busyItemId) return;
    setBusyItemId(id);
    try {
      const nextCart = await updateCartItemQuantity(id, Math.max(1, nextQuantity));
      setCart(nextCart);
      setError(null);
    } catch (err) {
      setError(extractApiErrorMessage(err));
    } finally {
      setBusyItemId(null);
    }
  };

  const removeItem = async (id: number) => {
    if (busyItemId) return;
    setBusyItemId(id);
    try {
      await removeCartItem(id);
      const nextCart = await fetchCart();
      setCart(nextCart);
      setError(null);
    } catch (err) {
      setError(extractApiErrorMessage(err));
    } finally {
      setBusyItemId(null);
    }
  };

  return (
    <main>
      <Navigation />
      <section className={styles.cartSection}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className={styles.breadcrumbSep} aria-hidden>&gt;</span>
            <span>Cart</span>
          </nav>
          <h1 className={styles.pageTitle}>YOUR CART</h1>
          {loading ? <p>Loading cart...</p> : null}
          {error ? <p>{error}</p> : null}

          <div className={styles.cartContent}>
            {/* Left: Cart Items */}
            <section className={styles.cartItems}>
              {items.length === 0 ? (
                <p className={styles.emptyCart}>Your cart is empty.</p>
              ) : (
                <ul className={styles.itemList}>
                  {items.map((item) => (
                    <li key={item.id} className={styles.cartItem}>
                      <div className={styles.itemImage}>
                        <Image src={item.product_image_url || PLACEHOLDER_IMAGE} alt={item.product_name} fill sizes="(max-width: 479px) 80px, (max-width: 767px) 100px, 120px" className={styles.itemImg} />
                      </div>
                      <div className={styles.itemInfo}>
                        <h3 className={styles.itemTitle}>{item.product_name}</h3>
                        <p className={styles.itemMeta}>Product ID: {item.product}</p>
                        <p className={styles.itemPrice}>${toNumber(item.line_total).toFixed(2)}</p>
                      </div>
                      <div className={styles.itemActions}>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove item"
                          disabled={busyItemId === item.id}
                        >
                          <TrashIcon />
                        </button>
                        <div className={styles.quantitySelector}>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            disabled={busyItemId === item.id}
                          >
                            <MinusIcon />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                            disabled={busyItemId === item.id}
                          >
                            <PlusIcon />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Right: Order Summary */}
            <aside className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>
              <div className={styles.summaryRows}>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Discount (-{discountPercent}%)</span>
                  <span className={styles.discountPrice}>-${discountAmount.toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
              </div>
              <div className={styles.summaryDivider} />
              <div className={styles.summaryTotalRow}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className={styles.promoRow}>
                <div className={styles.promoInputWrap}>
                  <TagIcon />
                  <input
                    type="text"
                    placeholder="Add promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className={styles.promoInput}
                    aria-label="Promo code"
                  />
                </div>
                <button type="button" className={styles.applyBtn}>Apply</button>
              </div>
              <Link href="#" className={styles.checkoutBtn}>
                Go to Checkout
                <ArrowRightIcon />
              </Link>
            </aside>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function TrashIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M12 5v14" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
      <path d="M7 7h.01" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
