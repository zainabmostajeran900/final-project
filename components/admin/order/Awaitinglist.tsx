"use client";

import React, { useState } from "react";
import Link from "next/link";
import { productsLimit } from "@/utils/config";
import { getOrders } from "@/apis/services/orders";
import { getUser } from "@/apis/services/users";
import { useQuery, useQueries } from "@tanstack/react-query";
import Image from "next/image";
import { classNames } from "@/utils/classname";
import Modal from "@/components/ui/Modal";
import { DeliverModal } from "@/components/admin/order/DeliverModal";
import { IOrder, IOrders } from "@/types/orders";
import { IUser } from "@/types/user";


interface OrderListProps {
  page: number;
}
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
}> = ({ currentPage, totalPages }) => {
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];

    pages.push(1);

    const start = Math.max(currentPage - 2, 2);
    const end = Math.min(currentPage + 2, totalPages - 1);

    if (start > 2) {
      pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="w-full flex justify-center items-center py-10 gap-2">
      {/* Previous Button */}
      <Link
        href={`/admin/awaiting?${new URLSearchParams({
          page: String(currentPage - 1 < 1 ? 1 : currentPage - 1),
        })}`}
      >
        <button
          className={classNames(
            "px-2 py-1 text-white disabled:bg-slate-500 text-nowrap text-sm",
            "bg-base hover:bg-[#BCB88A] hover:text-gray-700 rounded-lg"
          )}
          disabled={currentPage - 1 < 1}
        >
          صفحه قبل
        </button>
      </Link>

      {/* Page Numbers */}
      {pageNumbers.map((el, index) => {
        if (el === "...") {
          return (
            <span key={`ellipsis-${index}`} className="px-2 py-1">
              ...
            </span>
          );
        }

        return (
          <Link
            key={el}
            href={`/admin/awaiting?${new URLSearchParams({
              page: String(el),
            })}`}
          >
            <span
              className={classNames(
                "cursor-pointer px-2 py-1 hover:bg-white",
                el === currentPage ? "bg-gray-300 font-bold" : ""
              )}
            >
              {el.toLocaleString("ar-EG")}
            </span>
          </Link>
        );
      })}

      {/* Next Button */}
      <Link
        href={`/admin/awaiting?${new URLSearchParams({
          page: String(
            currentPage + 1 > totalPages ? currentPage : currentPage + 1
          ),
        })}`}
      >
        <button
          className={classNames(
            "px-2 py-1 text-white disabled:bg-slate-500 text-nowrap text-sm",
            "bg-base hover:bg-[#BCB88A] hover:text-gray-700 rounded-lg"
          )}
          disabled={currentPage + 1 > totalPages}
        >
          صفحه بعد
        </button>
      </Link>
    </div>
  );
};

export const AwaitingList: React.FC<OrderListProps> = ({ page }) => {
  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useQuery<IOrders, Error>({
    queryKey: ["get-order", page],
    queryFn: () =>
      getOrders({
        page: String(page),
        limit: String(productsLimit),
      }),
  placeholderData: (previousData) => previousData,
  });

  const userIds = React.useMemo(() => {
    if (!ordersData?.data?.orders) return [];
    const ids = ordersData.data.orders.map((order) => order.user);
    return Array.from(new Set(ids));
  }, [ordersData]);

  const usersQueries = useQueries({
    queries: userIds.map((id) => ({
      queryKey: ["user", id],
      queryFn: () => getUser({ id }),
      staleTime: 1000 * 60 * 60,
    })),
  });

  const usersMap: Record<string, IUser> = React.useMemo(() => {
    const map: Record<string, IUser> = {};
    usersQueries.forEach((query, index) => {
      if (query?.data?.data?.user) {
        map[userIds[index]] = query.data.data.user;
      }
    });
    return map;
  }, [usersQueries, userIds]);

  const filter = ordersData?.data?.orders.filter(
    (order: IOrder) => !order.deliveryStatus
  )?? [];

  const totalPages = React.useMemo(() => {
    if (!ordersData?.total || !productsLimit) return 1;
    return Math.ceil(Number(filter.length) / Number(productsLimit));
  }, [ordersData, productsLimit]);

  const isLoading =
    ordersLoading ||
    usersQueries.some((query) => query.isLoading) ||
    usersQueries.some((query) => query.isError);

  const isErrorState =
    ordersError || usersQueries.some((query) => query.isError);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  const handleReviewOrder = (order: IOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center">
        <div className="w-10 flex items-center justify-center text-nowrap">
          <Image
            className="animate-spin"
            src="/loading.svg"
            width={100}
            height={20}
            alt="Loading"
          />
          <p> در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (isErrorState) {
    return <div className="text-red-500">خطا در بارگذاری داده‌ها</div>;
  }

  return (
    <section className="flex flex-col items-center justify-center">
      <div className="w-full px-4 md:px-0">
        <table className="w-full text-white shadow-lg rounded-lg">
          <thead className="h-6">
            <tr className="bg-textColor text-center text-gray-800">
              <th>نام کاربر</th>
              <th>زمان سفارش</th>
              <th>مجموع مبلغ</th>
              <th className="h-12">عملیات</th>
            </tr>
          </thead>
          <tbody className="text-center bg-base text-gray-900 font-semibold">
            {ordersData?.data?.orders
              .filter((order: IOrder) => !order.deliveryStatus)
              .map((order: IOrder) => (
                <tr
                  className="even:bg-[#BCB88A] hover:even:bg-white cursor-pointer text-center"
                  key={order._id}
                >
                  <td className="h-12">
                    {usersMap[order.user]
                      ? `${usersMap[order.user].firstname} ${
                          usersMap[order.user].lastname
                        }`
                      : "نامشخص"}
                  </td>
                  <td className="h-12">
                    {new Date(order.createdAt).toLocaleString("fa-IR")}
                  </td>
                  <td className="h-12">
                    {order.totalPrice.toLocaleString("ar-EG")}
                  </td>

                  <td className="h-12 p-3">
                    <button
                      onClick={() => handleReviewOrder(order)}
                      className="sm:px-2 py-1 bg-white hover:bg-textColor text-sm sm:text-base rounded-lg"
                    >
                      بررسی سفارش
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <Pagination currentPage={page} totalPages={totalPages} />


        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {selectedOrder && (
            <DeliverModal
              order={selectedOrder}
              user={usersMap[selectedOrder.user]}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </Modal>
      </div>
    </section>
  );
};
