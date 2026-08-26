import type { Product } from "@/types/product";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/products`);

  if (!response.ok) {
    throw new Error("상품 목록 조회에 실패했습니다.");
  }

  return response.json() as Promise<Product[]>;
}
