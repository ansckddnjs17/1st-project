const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export async function getGroupOrders() {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/admin/groupOrders`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Group Orders API Error: ${response.status}`
    );
  }

  return response.json();
}