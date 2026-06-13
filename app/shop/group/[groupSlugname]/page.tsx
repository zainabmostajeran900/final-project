"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getCategoryBySlug } from "@/apis/services/categories";
import { MdOutlineArrowLeft } from "react-icons/md";
import ProductList from "@/components/shop/ProductList";

const GroupPage: React.FC = () => {
  const params = useParams();
  const { groupSlugname } = params;

  const {
    data: groupData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["category", groupSlugname],
    queryFn: () => getCategoryBySlug(String(groupSlugname)),
    enabled: !!groupSlugname,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <h3>در حال بارگذاری...</h3>
      </div>
    );
  }

  if (isError || !groupData) {
    return <div className="text-red-500">دسته‌بندی یافت نشد</div>;
  }

  return (
    <section className="container mx-auto max-w-[1400px] bg-second p-4">
      <div className="flex flex-col gap-y-5">
        <div className="flex gap-x-2 items-center">
          <h1 className="text-3xl font-bold">{`گروه انواع ${groupData.name}`}</h1>
          <MdOutlineArrowLeft className="text-xl border border-textColor rounded" />
        </div>
        <div className="mt-4">
          <ProductList category={groupData} paginate />
        </div>
      </div>
    </section>
  );
};

export default GroupPage;
