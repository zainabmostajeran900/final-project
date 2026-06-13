"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/apis/services/products";
import { ProductCard } from "@/components/shop/productcard";
import {IProducts} from "@/types/products";

interface Category {
  _id: string;
  name: string;
}

interface ProductListProps {
  category: Category;
  limit?: number;
  paginate?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
  category,
  limit,
  paginate = false,
}) => {
  const {
    data: productsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getAllProducts({}),
  });

  const sortedProducts = useMemo(() => {
    if (!productsData?.data.products) return [];

    const filtered = productsData.data.products.filter(
      (product: IProducts) => product.category === category._id
    );

    const sorted = filtered.sort(
      (a: IProducts, b: IProducts) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return sorted;
  }, [productsData, category._id]);

  const isPaginationActive = paginate;

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = isPaginationActive ? limit ?? 8 : sortedProducts.length;

  const limitedItems = useMemo(() => {
    if (!isPaginationActive && typeof limit === "number") {
      return sortedProducts.slice(0, limit);
    }
    return sortedProducts;
  }, [isPaginationActive, limit, sortedProducts]);

  const totalItems = isPaginationActive
    ? sortedProducts.length
    : limitedItems.length;
  const totalPages = isPaginationActive
    ? Math.ceil(totalItems / (limit ?? 8))
    : 1;

  const currentItems = useMemo(() => {
    if (isPaginationActive) {
      const startIdx = (currentPage - 1) * (limit ?? 8);
      const endIdx = startIdx + (limit ?? 8);
      return sortedProducts.slice(startIdx, endIdx);
    } else {
      return limitedItems;
    }
  }, [isPaginationActive, currentPage, limit, sortedProducts, limitedItems]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [sortedProducts, itemsPerPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center my-4">
        <h3>در حال بارگذاری...</h3>
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500">خطا در بارگذاری محصولات</div>;
  }

  if (sortedProducts.length === 0) {
    return <div className="text-gray-500">محصولی یافت نشد</div>;
  }

  return (
    <div className="px-2 sm:px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 border py-6 px-4 mb-4 rounded-md bg-[rgb(188,184,138)]">
        {currentItems.map((product: any) => (
          <ProductCard key={product._id} {...product} />
        ))}
      </div>
      {isPaginationActive && totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-sm rounded-md ${
              currentPage === 1
                ? "bg-gray-500 text-white cursor-not-allowed"
                : "bg-base text-white hover:bg-[#BCB88A] hover:text-gray-700"
            }`}
          >
            صفحه قبلی
          </button>

          <div className="flex overflow-x-auto gap-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 text-sm rounded-md ${
                    currentPage === page
                      ? "bg-gray-300 font-bold"
                      : "hover:bg-white"
                  }`}
                >
                  {page.toLocaleString("ar-EG")}
                </button>
              )
            )}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm rounded-md ${
              currentPage === totalPages
                ? "bg-gray-500 text-white cursor-not-allowed"
                : "bg-base text-white hover:bg-[#BCB88A] hover:text-gray-700"
            }`}
          >
            صفحه بعدی
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
