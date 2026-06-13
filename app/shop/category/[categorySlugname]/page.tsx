"use client";

import { useParams } from "next/navigation";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategoryBySlug } from "@/apis/services/categories";
import SubcategoryList from "@/components/shop/SubcategoryList";
import { MdOutlineArrowLeft } from "react-icons/md";
import { SidebarCategory } from "@/components/shop/SidebarCategory";

const CategoryPage: React.FC = () => {
  const params = useParams();
  const { categorySlugname } = params;

  const {
    data: categoryData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["category", categorySlugname],
    queryFn: () => getCategoryBySlug(String(categorySlugname)),
    enabled: !!categorySlugname,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <h3>در حال بارگذاری...</h3>
      </div>
    );
  }

  if (isError || !categoryData) {
    return <div className="text-red-500">دسته‌بندی یافت نشد</div>;
  }

  return (
    <section className="container mx-auto max-w-[1400px] bg-second">
      <div className="flex flex-col gap-y-5 items-start justify-center">
        <div className="flex gap-x-2 items-center px-4">
          <h1 className="text-3xl font-bold">{`گروه انواع ${categoryData.name}`}</h1>
          <MdOutlineArrowLeft className="size-5 border border-textColor" />
        </div>
        <div className="flex items-start justify-center gap-x-10">
          <div>
            <SidebarCategory />
          </div>
          <div>
            <SubcategoryList category={categoryData} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryPage;
