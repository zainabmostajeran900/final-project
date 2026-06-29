"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getSubCategoryBySlug } from "@/apis/services/subcategories";
import { getAllProducts } from "@/apis/services/products";
import { ProductCard } from "@/components/shop/productcard";
import { SidebarCategory } from "@/components/shop/SidebarCategory";
import { MdOutlineArrowLeft } from "react-icons/md";
import { IProducts } from "@/types/products";

const SubcategoryPage: React.FC = () => {
  const params = useParams();
  const { subcategorySlugname } = params;

  const [sortOrder, setSortOrder] = useState<"lowToHigh" | "highToLow">(
    "lowToHigh"
  );

  const {
    data: subcategoryData,
    isLoading: isSubcategoryLoading,
    isError: isSubcategoryError,
    error: subcategoryError,
  } = useQuery<any>({
    queryKey: ["subcategory", subcategorySlugname],
    queryFn: () => getSubCategoryBySlug(String(subcategorySlugname)),
    enabled: !!subcategorySlugname,
  });

  const subcategoryId = subcategoryData?._id;

  const {
    data: productsData,
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: productsError,
  } = useQuery<any>({
    queryKey: ["products"],
    queryFn: () => getAllProducts({}),
    enabled: !!subcategoryId,
  });

  if (isSubcategoryLoading || isProductsLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h3 className="text-lg">در حال بارگذاری...</h3>
      </div>
    );
  }

  if (isSubcategoryError) {
    return (
      <div className="text-red-500 text-center mt-10">
        خطا در بارگذاری دسته‌بندی: {subcategoryError.message}
      </div>
    );
  }

  if (isProductsError) {
    return (
      <div className="text-red-500 text-center mt-10">
        خطا در بارگذاری محصولات: {productsError.message}
      </div>
    );
  }

  if (productsData?.data?.products.length === 0) {
    return (
      <div className="text-center mt-10">
        هیچ محصولی برای این دسته‌بندی یافت نشد.
      </div>
    );
  }

  const sortedProducts = (productsData?.data?.products??[])
    .filter((product: IProducts) => product.subcategory == subcategoryId)
    .sort((a: IProducts, b: IProducts) => {
      if (sortOrder === "lowToHigh") return a.price - b.price;
      if (sortOrder === "highToLow") return b.price - a.price;
      return 0;
    });

  return (
    <section className="container mx-auto max-w-[1400px] bg-second">
      <div className="flex flex-col gap-y-4 items-start justify-center">
        <div className="flex gap-x-2 items-center">
          <h1 className="text-2xl font-semibold">{subcategoryData?.name}</h1>
          <MdOutlineArrowLeft className="size-5 border border-textColor" />
        </div>
        <div className="flex gap-x-4 items-center">
          <button
            onClick={() => setSortOrder("lowToHigh")}
            className={`px-4 py-1 rounded-lg ${
              sortOrder === "lowToHigh"
                ? "bg-textColor text-white"
                : "bg-gray-200"
            }`}
          >
            ارزان‌ترین
          </button>
          <button
            onClick={() => setSortOrder("highToLow")}
            className={`px-4 py-1 rounded-lg ${
              sortOrder === "highToLow"
                ? "bg-textColor text-white"
                : "bg-gray-200"
            }`}
          >
            گران‌ترین
          </button>
        </div>

        <div className="block space-y-4 sm:flex sm:items-start sm:justify-end sm:gap-x-8">
          <div className="grid sm:grid-cols-[1fr-2fr] w-full">
            <SidebarCategory />
          </div>
          <div className="grid sm:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 border py-6 px-4 rounded-md bg-[rgb(188,184,138)]">
              {sortedProducts.map((product: IProducts) => (
                <ProductCard key={product._id} {...product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubcategoryPage;