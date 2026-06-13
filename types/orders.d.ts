export interface IOrder {
  _id: string;
  user: string;
  products: {
    product: string;
    count: number;
    _id: string;
  }[];
  totalPrice: number;
  deliveryDate: string;
  deliveryStatus: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IOrders {
  status: string;
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: {
    orders: IOrder[];
  };
}