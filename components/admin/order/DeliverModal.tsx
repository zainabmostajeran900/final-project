"use client";

import React from "react";
import { updateOrderDeliveryStatus } from "@/apis/services/orders";
import { fetchProductById } from "@/apis/services/products";
import {
  useMutation,
  useQueries,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import Modal from "@/components/ui/Modal";
import { IUser } from "@/types/user";
import { IOrder } from "@/types/orders";

interface DeliverModalProps {
  order: IOrder;
  user: IUser;
  onClose: () => void;
}

const toPersianDigits = (num: string | number): string => {
  return num
    .toString()
    .replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(digit, 10)]);
};

export const DeliverModal: React.FC<DeliverModalProps> = ({
  order,
  user,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const productQueries = useQueries({
    queries: order.products.map((item) => ({
      queryKey: ["product", item.product],
      queryFn: () => fetchProductById(item.product),
      staleTime: 1000 * 60 * 60, 
    })),
  });

  const isProductsLoading = productQueries.some((query) => query.isLoading);
  const isProductsError = productQueries.some((query) => query.isError);

  const mutation = useMutation({
    mutationFn: () => updateOrderDeliveryStatus(order._id, true),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["get-delivered-orders"]});
      toast.success("سفارش با موفقیت تحویل شد");
      onClose();
    },
    onError: (error: any) => {
      console.error("Error updating delivery status:", error);
      toast.error("خطا در تحویل سفارش");
    },
  });

  const handleMarkAsDelivered = () => {
    mutation.mutate();
  };

  const formattedDeliveryDate = order.deliveryDate
    ? new Date(order.deliveryDate).toLocaleString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    : "نامشخص";

  const formattedCreatedAt = order.createdAt
    ? new Date(order.createdAt).toLocaleString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    : "نامشخص";

  if (isProductsLoading) {
    return (
      <Modal isOpen={true} onClose={onClose}>
        <div className="flex items-center justify-center p-4">
          <p>در حال بارگذاری محصولات...</p>
        </div>
      </Modal>
    );
  }

  if (isProductsError) {
    return (
      <Modal isOpen={true} onClose={onClose}>
        <div className="flex items-center justify-center p-4">
          <p>خطا در بارگذاری اطلاعات محصولات.</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={true} onClose={onClose}>
      <section className="flex flex-col items-center gap-y-8 py-12 px-4">
        <div className="flex flex-col gap-5 justify-start w-full">
          <div className="flex gap-1 items-start justify-center w-full text-textColor">
            <p className="font-bold text-gry-800">نام مشتری:</p>
            <p>{`${user?.firstname} ${user?.lastname}` || "نامشخص"}</p>
          </div>
          <div className="flex gap-1 items-start justify-center w-full text-textColor">
            <p className="font-bold"> آدرس: </p>
            <p >{user?.address || "نامشخص"}</p>
          </div>
          <div className="flex gap-1 items-start justify-center w-full text-textColor">
            <p className="font-bold">تلفن:</p>
            <p>
              {user?.phoneNumber ? toPersianDigits(user.phoneNumber) : "نامشخص"}
            </p>
          </div>
          <div className="flex gap-1 items-start justify-center w-full text-textColor">
            <p className="font-bold">زمان تحویل:</p>
            <p>{formattedDeliveryDate}</p>
          </div>
          <div className="flex gap-1 items-start justify-center w-full text-textColor">
            <p className="font-bold">زمان سفارش:</p>
            <p>{formattedCreatedAt}</p>
          </div>
        </div>

        <table className="w-full text-center mt-4 rounded-lg">
          <thead className="text-center bg-textColor">
            <tr>
              <th>کالا</th>
              <th>قیمت</th>
              <th>موجودی</th>
            </tr>
          </thead>
          <tbody className="bg-white text-gray-950">
            {order.products.map((item, index) => {
              const productData = productQueries[index]?.data?.data?.product;

              return (
                <tr  key={item._id}>
                  <td className="py-2">{productData?.name || "نامشخص"}</td>
                  <td>
                    {productData?.price !== undefined &&
                    productData?.price !== null
                      ? productData.price.toLocaleString("fa-IR")
                      : "نامشخص"}
                  </td>
                  <td>{item.count || "نامشخص"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!order.deliveryStatus && (
          <div className="flex justify-center w-full">
            <button
              onClick={handleMarkAsDelivered}
              className="px-4 py-2 rounded-md bg-textColor text-gray-900  hover:bg-white  disabled:opacity-50"
              disabled={mutation.isPending }
            >
              {mutation.isPending  ? "در حال انجام..." : "تحویل شد"}
            </button>
          </div>
        )}
      </section>
    </Modal>
  );
};
