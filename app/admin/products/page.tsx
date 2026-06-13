"use client";

import PageTitle from "@/components/admin/PageTitle";
import { Suspense, useMemo, useState } from "react";
import { ProductList } from "@/components/admin/product/ProductList";
import { useSearchParams } from "next/navigation";
import React from "react";
import ProductForm from "@/components/admin/product/ProductForm";
import Modal from "@/components/ui/Modal";
import { useAdminGuard } from "@/hooks/useAdminGuard";

const ProductContent: React.FC = () => {
  useAdminGuard();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");

  const currentPage = useMemo(() => {
    const parsed = parseInt(pageParam || "1", 10);
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  }, [pageParam]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="mx-auto">
      <div className="flex justify-between items-center px-4">
        <PageTitle title="کالاها" />
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-200 px-3 py-1 sm:px-8 sm:py-2 rounded-md font-bold hover:bg-slate-300"
        >
          افزودن کالا
        </button>
      </div>
      <ProductList page={currentPage} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ProductForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </section>
  );
};

const ProductPage: React.FC = () => {
  return (
    <Suspense fallback={<div>در حال بارگذاری...</div>}>
      <ProductContent />
    </Suspense>
  );
};

export default ProductPage;