"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllSubCategories } from "@/apis/services/subcategories";
import SubcategoryCard from "@/components/shop/SubcategoryCard";

interface SubcategoryListProps {
  category: any;
}

const SubcategoryList: React.FC<SubcategoryListProps> = ({ category }) => {
  const {
    data: subcategoriesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["subcategories"],
    queryFn: ()=>getAllSubCategories({}),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center my-4">
        <h3>در حال بارگذاری...</h3>
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500">خطا در بارگذاری زیر دسته‌ها</div>;
  }

  return (
    <div className="grid gap-4 sm:grid sm:grid-cols-2 sm:gap-4">
      {(subcategoriesData?.data?.categories??[])
        .filter((sub) => sub.category == category._id)
        .map((subcategory) => (
          <SubcategoryCard
            key={subcategory._id}
            subcategoryId={subcategory._id}
            subcategoryName={subcategory.name}
            subcategorySlugname={subcategory.slugname}
            categorySlugname={category.slugname}
            categoryIcon={category.icon}
          />
        ))}
    </div>
  );
};

export default SubcategoryList;