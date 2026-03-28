"use client";
import React, { useState, use, useEffect } from "react";
import Navigation from "@/components/Navigation/navigation";
import Footer from "@/components/Footer/footer";
import ProductCard from "@/components/ProductCard/productCard";
import FilterSidebar from "@/components/FilterSidebar/filterSidebar";
import Breadcrumb from "@/components/Breadcrumb/breadcrumb";
import type { CatalogProduct } from "@/types/catalog";
import styles from "./category.module.scss";
import SortDropdown from "@/components/SortDropdown/sortDropdown";
import { SlidersHorizontal } from "lucide-react";
import { fetchCatalogProducts } from "@/services/catalog.service";

const PAGE_SIZE = 24;

function formatCategoryTitle(categoryID: string): string {
  const id = categoryID.toLowerCase();
  if (id === "all") return "All products";
  return categoryID
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ categoryID: string }>;
}) {
  const { categoryID } = use(params);
  const categoryName = formatCategoryTitle(categoryID);
  const categorySlugForApi =
    categoryID.toLowerCase() === "all" ? null : categoryID;

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [categoryID]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const { count, results } = await fetchCatalogProducts({
          page,
          pageSize: PAGE_SIZE,
          categorySlug: categorySlugForApi,
        });
        if (!cancelled) {
          setProducts(results);
          setTotalCount(count);
        }
      } catch {
        if (!cancelled) {
          setError(
            "Unable to load products. Check that the API is running and NEXT_PUBLIC_API matches your Django server (e.g. http://127.0.0.1:8000/).",
          );
          setProducts([]);
          setTotalCount(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [categoryID, page, categorySlugForApi]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const rangeStart = totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, totalCount);

  return (
    <>
      <Navigation />
      <main className="layout">
        <Breadcrumb category={categoryName} />

        <div className={styles.categoryLayout}>
          <FilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />

          <div className={styles.mainContent}>
            <div className={styles.toolbar}>
              <h2>{categoryName}</h2>
              <div className={styles.meta}>
                <span>
                  {loading
                    ? "Loading…"
                    : `Showing ${rangeStart}-${rangeEnd} of ${totalCount} Products`}
                </span>
                <SortDropdown />

                <button
                  className={styles.mobileFilterBtn}
                  onClick={() => setIsFilterOpen(true)}
                >
                  <SlidersHorizontal size={20} />
                </button>
              </div>
            </div>

            {error && (
              <p className={styles.meta} style={{ color: "#b42318", marginBottom: 16 }}>
                {error}
              </p>
            )}

            <div className={styles.productGrid}>
              {loading && (
                <p className={styles.meta} style={{ gridColumn: "1 / -1" }}>
                  Loading products…
                </p>
              )}
              {!loading &&
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              {!loading && !error && products.length === 0 && (
                <p className={styles.meta} style={{ gridColumn: "1 / -1" }}>
                  No products found.
                </p>
              )}
            </div>

            <div className={styles.divider} />

            <div className={styles.pagination}>
              <button
                type="button"
                className={styles.navBtn}
                disabled={loading || page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <div className={styles.pages}>
                <span style={{ padding: "0 8px", fontSize: 14 }}>
                  Page {page} of {totalPages}
                </span>
              </div>
              <button
                type="button"
                className={styles.navBtn}
                disabled={loading || page >= totalPages || totalCount === 0}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
