"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./navigation.module.scss";
import {
  Search,
  ShoppingCart,
  CircleUserRound,
  ChevronDown,
  X,
  Menu,
  LogOut,
  UserCircle,
  Package,
} from "lucide-react";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/utils/axios";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleShop = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsShopOpen(!isShopOpen);
  };

  useEffect(() => {
    const syncAuthState = () => {
      const hasAccessToken = Boolean(localStorage.getItem(ACCESS_TOKEN_KEY));
      setIsAuthenticated(hasAccessToken);
      if (!hasAccessToken) {
        setIsAccountMenuOpen(false);
      }
    };

    syncAuthState();
    window.addEventListener("storage", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isAccountMenuOpen &&
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isAccountMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setIsAuthenticated(false);
    setIsAccountMenuOpen(false);
    router.push("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.promoBar}>
        <p>
          Sign up and get 20% off to your first order.{" "}
          <Link href={`${pathname}?auth=signup`}>Sign Up Now</Link>
        </p>
        <X className={styles.closeIcon} size={16} />
      </div>

      <nav className={`${styles.mainNav} layout`}>
        <div className={styles.leftSection}>
          <Menu className={styles.burgerIcon} size={24} onClick={toggleMenu} />
          <div className={styles.logo}>
            <Link href="/">SHOP.CO</Link>
          </div>
        </div>

        <ul className={styles.navLinks}>
          <li className={styles.hasDropdown}>
            <Link href="#">
              Shop <ChevronDown size={16} />
            </Link>
            <ul className={styles.dropdown}>
              <li>
                <Link href="#">Male</Link>
              </li>
              <li>
                <Link href="#">Female</Link>
              </li>
            </ul>
          </li>
          <li>
            <Link href="#" className={styles.underlineAnimation}>
              On Sale
            </Link>
          </li>
          <li>
            <Link href="#" className={styles.underlineAnimation}>
              New Arrivals
            </Link>
          </li>
          <li>
            <Link href="#" className={styles.underlineAnimation}>
              Brands
            </Link>
          </li>
        </ul>

        <div
          className={`${styles.overlay} ${isMenuOpen ? styles.active : ""}`}
          onClick={toggleMenu}
        ></div>
        <div className={`${styles.sidebar} ${isMenuOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <X size={24} onClick={toggleMenu} />
            <div className={styles.logo}>SHOP.CO</div>
          </div>

          <ul className={styles.mobileNavLinks}>
            <li>
              <div className={styles.mobileShopToggle} onClick={toggleShop}>
                Shop{" "}
                <ChevronDown
                  size={18}
                  className={isShopOpen ? styles.rotated : ""}
                />
              </div>
              <ul className={`${styles.mobileDropdown} ${isShopOpen ? styles.show : ""}`}>
                <li>
                  <Link href="#" onClick={toggleMenu}>
                    Male
                  </Link>
                </li>
                <li>
                  <Link href="#" onClick={toggleMenu}>
                    Female
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link href="#" className={styles.navItem} onClick={toggleMenu}>
                On Sale
              </Link>
            </li>
            <li>
              <Link href="#" className={styles.navItem} onClick={toggleMenu}>
                New Arrivals
              </Link>
            </li>
            <li>
              <Link href="#" className={styles.navItem} onClick={toggleMenu}>
                Brands
              </Link>
            </li>
          </ul>
        </div>

        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} size={20} />
          <input
            type="text"
            placeholder="Search for products..."
            className={styles.searchInput}
          />
        </div>

        <div className={styles.actions}>
          <Search className={styles.searchIconMobile} size={24} />
          <Link href="/cart" aria-label="Cart">
            <ShoppingCart size={24} />
          </Link>

          {!isAuthenticated ? (
            <Link href={`${pathname}?auth=login`} aria-label="Login">
              <CircleUserRound size={24} />
            </Link>
          ) : (
            <div className={styles.accountWrapper} ref={accountMenuRef}>
              <button
                type="button"
                className={styles.accountButton}
                aria-label="Account"
                aria-expanded={isAccountMenuOpen}
                aria-haspopup="menu"
                onClick={() => setIsAccountMenuOpen((prev) => !prev)}
              >
                <CircleUserRound size={24} />
              </button>
              {isAccountMenuOpen ? (
                <div className={styles.accountMenu} role="menu">
                  <Link href="/profile" role="menuitem" onClick={() => setIsAccountMenuOpen(false)}>
                    <UserCircle size={16} />
                    My Account
                  </Link>
                  <Link href="/orders" role="menuitem" onClick={() => setIsAccountMenuOpen(false)}>
                    <Package size={16} />
                    Orders
                  </Link>
                  <button type="button" role="menuitem" onClick={handleLogout}>
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}