import type {
  ApiResponse,
  CreateOrderRequest,
  Order,
} from "@/types/order";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

// 주문 조회
export async function getOrders(
  email: string,
  date?: string,
): Promise<Order[]> {
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

<<<<<<< HEAD
=======
// 주문 생성
export async function createOrder(
  request: CreateOrderRequest,
): Promise<ApiResponse<Order[]>> {
  const response = await fetch(`${API_BASE_URL}/api/v1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const body = (await response.json()) as ApiResponse<Order[]>;

  if (!response.ok) {
    throw new Error(body.msg || "주문 생성에 실패했습니다.");
  }

  return body;
}

>>>>>>> upstream/main
async function readApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const body = (await response.json()) as ApiResponse<T>;
  if (!response.ok) {
    throw new Error(body.msg || "요청에 실패했습니다.");
  }
  return body;
}

export async function updateOrder(
  id: number,
  quantity: number,
): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/api/v1/orders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantity }),
  });
  const body = await readApiResponse<Order>(response);
  return body.data;
}

export async function deleteOrder(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/orders/${id}`, {
    method: "DELETE",
  });
  await readApiResponse<null>(response);
<<<<<<< HEAD
}
// 주문 생성
export async function createOrder(
  request: CreateOrderRequest,
): Promise<ApiResponse<Order[]>> {
  const response = await fetch(`${API_BASE_URL}/api/v1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const body = (await response.json()) as ApiResponse<Order[]>;

  if (!response.ok) {
    throw new Error(body.msg || "주문 생성에 실패했습니다.");
  }

  return body;
=======
>>>>>>> upstream/main
}