export type Order = {
  id: number;
  customerId: number;
  productId: number;
  quantity: number;
  deliveryDate: string;
  price: number;
};

export type ApiResponse<T> = {
  resultCode: string;
  msg: string;
  data: T;
};

export type OrderItemRequest = {
  productId: number;
  quantity: number;
};

export type CreateOrderRequest = {
  email: string;
  address: string;
  postcode: string;
  items: OrderItemRequest[];
};