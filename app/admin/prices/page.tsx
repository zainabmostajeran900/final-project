"use client";

import React, { Suspense, useMemo, useState } from "react";
import PageTitle from "@/components/admin/PageTitle";
import { PriceList } from "@/components/admin/prices/PriceList";
import { useSearchParams } from "next/navigation";
import { useEditProduct } from "@/apis/mutation/useEditProduct";
import { useAdminGuard } from "@/hooks/useAdminGuard";

const PricesContent: React.FC = () => {
  useAdminGuard();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");

  const currentPage = useMemo(() => {
    const parsed = parseInt(pageParam || "1", 10);
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  }, [pageParam]);

  const [editedProducts, setEditedProducts] = useState<{
    [key: string]: { price?: number; quantity?: number };
  }>({});

  const editProductMutation = useEditProduct();

  const handleInputChange = (
    productId: string,
    field: "price" | "quantity",
    value: number
  ) => {
    setEditedProducts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const handleBulkUpdate = async () => {
    const updatePromises = Object.entries(editedProducts).map(
      async ([id, changes]) => {
        const formData = new FormData();
        if (changes.price !== undefined)
          formData.append("price", String(changes.price));
        if (changes.quantity !== undefined)
          formData.append("quantity", String(changes.quantity));
        return editProductMutation.mutateAsync({ id, data: formData });
      }
    );

    try {
      await Promise.all(updatePromises);
      setEditedProducts({});
    } catch (error) {
      console.error("Bulk update failed:", error);
    }
  };

  return (
    <section className="px-6">
      <div className="flex justify-between items-center px-4">
        <PageTitle title="موجودی وقیمت ها" />
        <button
          className="bg-slate-200 px-3 py-1 sm:px-8 sm:py-2 rounded-md font-bold hover:bg-slate-300"
          onClick={handleBulkUpdate}
          disabled={
            Object.keys(editedProducts).length === 0 ||
            editProductMutation.isPending
          }
        >
          {editProductMutation.isPending ? "در حال بروزرسانی..." : "ذخیره"}
        </button>
      </div>
      <PriceList
        page={currentPage}
        editedProducts={editedProducts}
        onInputChange={handleInputChange}
      />
    </section>
  );
};

const PricesPage: React.FC = () => {
  return (
    <Suspense fallback={<div>در حال بارگذاری...</div>}>
      <PricesContent />
    </Suspense>
  );
};

export default PricesPage;