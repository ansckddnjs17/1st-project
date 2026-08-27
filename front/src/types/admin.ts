export type ProductItem = {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
};

export type GroupOrder = {
  email: string;
  address: string;
  postCode: string;
  productItems: ProductItem[];
  deliveryDate: string;
};