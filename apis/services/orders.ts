import { urls } from "../urls";
import axiosInstance from "../client";
import { IOrders } from "@/types/orders";

type getOrdersType = (_: IReqGetData) => Promise<IOrders>;

export const getOrders: getOrdersType = async ({
  page = "1",
  limit = "10",
  deliveryStatus,
}) => {
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (deliveryStatus !== undefined)
    params.append("deliveryStatus", String(deliveryStatus));
  const response = await axiosInstance.get(
    `${urls.orders.list}?${params.toString()}`
  );
  return response.data;
};

export const updateOrderDeliveryStatus = async (
  orderId: string,
  status: boolean
): Promise<IOrders> => {
  const response = await axiosInstance.patch(
    `${urls.orders.update(orderId)}`,
    { deliveryStatus: status }
  );
  return response.data;
};
