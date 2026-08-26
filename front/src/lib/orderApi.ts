import type { ApiResponse, Order } from "@/types/order";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export async function getOrders(email: string, date?: string): Promise<Order[]> {
  const params = new URLSearchParams({ email });

  if (date) {
    params.set("date", date);
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/orders?${params.toString()}`,
  );

  const body = (await response.json()) as ApiResponse<Order[]>;

  if (!response.ok) {
    throw new Error(body.msg || "주문 조회에 실패했습니다.");
  }

  return body.data ?? [];
}
