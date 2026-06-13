"use client";

import React from "react";
import Link from "next/link";
import { productsLimit } from "@/utils/config";
import { getProducts } from "@/apis/services/products";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { classNames } from "@/utils/classname";

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
        href={`/admin/prices?${new URLSearchParams({
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
            href={`/admin/prices?${new URLSearchParams({
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
        href={`/admin/prices?${new URLSearchParams({
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


export const PriceList: React.FC<{
  page: number;
  editedProducts: {
    [key: string]: { price?: number; quantity?: number };
  };
  onInputChange: (
    productId: string,
    field: "price" | "quantity",
    value: number
  ) => void;
}> = ({ page, editedProducts, onInputChange }) => {
  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: ["get-product", page],
    queryFn: () =>
      getProducts({
        page: String(page),
        limit: String(productsLimit),
      }),
  placeholderData: (previousData) => previousData,
  });

  const totalPages = React.useMemo(() => {
    if (!productsData?.total || !productsLimit) return 1;
    return Math.ceil(Number(productsData.total) / Number(productsLimit));
  }, [productsData, productsLimit]);

  if (productsLoading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="w-10 flex items-center justify-center text-nowrap">
          <Image
            className="animate-spin"
            src="/loading.svg"
            width={100}
            height={20}
            alt="Loading"
          />
          <p> در حال بارگذاری</p>
        </div>
      </div>
    );
  }
  if (productsError) {
    return <div className="text-red-500">خطا در بارگذاری داده‌ها</div>;
  }
  return (
    <section className="flex flex-col items-center justify-center py-6">
      <table className="w-full text-white shadow-lg rounded-lg">
        <thead className="h-6">
          <tr className="bg-textColor text-center text-gray-800">
            <th className="h-12 text-center">کالا</th>
            <th className="h-12 text-center">قیمت</th>
            <th className="h-12">موجودی</th>
          </tr>
        </thead>
        <tbody className="text-center bg-base text-gray-900 font-semibold">
          {productsData?.data?.products.map((item: any) => (
            <tr
              className="even:bg-[#BCB88A] hover:even:bg-white cursor-pointer text-center"
              key={item._id}
            >
              <td className="text-center">{item.name}</td>
              <td className="h-12">
                <input
                  className="w-20 bg-transparent placeholder-slate-900 text-center"
                  type="number"
                  placeholder={item.price}
                  min={0}
                  value={
                    editedProducts[item._id]?.price !== undefined
                      ? editedProducts[item._id].price
                      : item.price
                  }
                  onChange={(e) =>
                    onInputChange(item._id, "price", Number(e.target.value))
                  }
                />
              </td>
              <td className="h-12">
                <input
                  className="w-20 bg-transparent placeholder-slate-900 text-center"
                  type="number"
                  placeholder={item.quantity}
                  min={0}
                  value={
                    editedProducts[item._id]?.quantity !== undefined
                      ? editedProducts[item._id].quantity
                      : item.quantity
                  }
                  onChange={(e) =>
                    onInputChange(item._id, "quantity", Number(e.target.value))
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination currentPage={page} totalPages={totalPages} />
    </section>
  );
};