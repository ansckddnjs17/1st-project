export type Order = {
  id: number;
  customerId: number;
  productId: number;
  quantity: number;
  deliveryDate: string;
};

export type ApiResponse<T> = {
  resultCode: string;
  msg: string;
  data: T;
};
