import api from "@/utils/axios";
import type { CatalogPaginatedResponse, CatalogProduct } from "@/types/catalog";

export type FetchCatalogProductsResult = {
  count: number;
  next: string | null;
  previous: string | null;
  results: CatalogProduct[];
};

/**
 * GET /catalog/products/ — có phân trang và lọc category tùy chọn.
 * categorySlug = null hoặc bỏ qua → toàn bộ sản phẩm.
 */
export async function fetchCatalogProducts(options: {
  page?: number;
  pageSize?: number;
  categorySlug?: string | null;
}): Promise<FetchCatalogProductsResult> {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 24;

  const params: Record<string, string | number> = {
    page,
    page_size: pageSize,
  };

  if (options.categorySlug) {
    params.category = options.categorySlug;
  }

  const { data } = await api.get<CatalogPaginatedResponse>("catalog/products/", {
    params,
  });

  return {
    count: data.count,
    next: data.next,
    previous: data.previous,
    results: data.results,
  };
}
