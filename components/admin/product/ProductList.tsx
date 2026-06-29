"use client";

import React from "react";
import Link from "next/link";
import { productsLimit } from "@/utils/config";
import { getProducts } from "@/apis/services/products";
import { getCategories } from "@/apis/services/categories";
import { getSubCategories } from "@/apis/services/subcategories";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { classNames } from "@/utils/classname";
import Modal from "@/components/ui/Modal";
import { useState } from "react";
import EditProductForm from "@/components/admin/product/EditProductForm";
import { useDeleteProduct } from "@/apis/mutation/useDeleteProduct";
import {  IProducts} from "@/types/products";

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
        href={`/admin/products?${new URLSearchParams({
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
            href={`/admin/products?${new URLSearchParams({
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
        href={`/admin/products?${new URLSearchParams({
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
export const ProductList: React.FC<{ page: number }> = ({ page }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProducts | null>(
    null
  );
  const [productToDelete, setProductToDelete] = useState<IProducts | null>(
    null
  );

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
  });

  const deleteProductMutation = useDeleteProduct();

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProductMutation.mutate(productToDelete._id);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories({}),
  });

  const {
    data: subCategoriesData,
    isLoading: subCategoriesLoading,
    isError: subCategoriesError,
  } = useQuery({
    queryKey: ["subcategories"],
    queryFn: () => getSubCategories({}),
  });

  const categoryMap = React.useMemo(() => {
    if (!categoriesData?.data?.categories) return {};
    const map: Record<string, string> = {};
    categoriesData.data.categories.forEach((cat: any) => {
      map[cat._id] = cat.name;
    });
    return map;
  }, [categoriesData]);

  const subCategoryMap = React.useMemo(() => {
    if (!subCategoriesData?.data?.categories) return {};
    const map: Record<string, string> = {};
    subCategoriesData.data.categories.forEach((subcat: any) => {
      map[subcat._id] = subcat.name;
    });
    return map;
  }, [subCategoriesData]);

  const totalPages = React.useMemo(() => {
    if (!productsData?.total || !productsData) return 1;
    return Math.ceil(Number(productsData.total) / Number(productsLimit));
  }, [productsData, productsLimit]);

  const isLoading =
    productsLoading || categoriesLoading || subCategoriesLoading;
  const isErrorState = productsError || categoriesError || subCategoriesError;

  if (isLoading) {
    return (
      <div className=" flex flex-col justify-center items-center">
        <div className="w-10 flex  items-center justify-center text-center text-nowrap">
          <Image
            className="animate-spin"
            src="/loading.svg"
            width={100}
            height={20}
            alt="Loading"
          />
          <p> درحال بارگذاری</p>
        </div>
      </div>
    );
  }
  if (isErrorState) {
    return <div className="text-red-500">خطا در بارگذاری داده‌ها</div>;
  }

  return (
    <section className="flex flex-col items-center justify-center py-6">
      <div className="w-full px-4 md:px-0">
        <table className="w-full text-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-textColor text-gray-800">
              <th>تصویر</th>
              <th>نام کالا</th>
              <th>دسته بندی</th>
              <th>زیر دسته بندی</th>
              <th className="h-12">عملیات</th>
            </tr>
          </thead>
          <tbody className="text-center bg-base text-gray-800 font-semibold shadow-md">
            {productsData?.data?.products?.map((item: any) => (
              <tr
                className="even:bg-[rgb(188,184,138)] hover:even:bg-white cursor-pointer"
                key={item._id}
              >
                <td className="flex flex-col items-center p-3">
                  <div className="relative w-20 h-20 aspect-square">
                    <Image
                      className="rounded-full"
                      src={`https://backend-final-rho.vercel.app/images/products/images/${item.images[0]}`}
                      alt={item.name}
                      fill
                      sizes="80px"
                      // width={80}
                      // height={80}
                    />
                  </div>
                </td>
                <td>{item.name}</td>
                <td >
                  {categoryMap[item.category]}
                </td>
                <td>
                  {subCategoryMap[item.subcategory]}
                </td>
                <td>
                  <div className="block space-y-2 sm:space-y-0 sm:flex sm:gap-x-2 sm:items-center sm:justify-center text-gray-800">
                    <button
                      onClick={() => {
                        setSelectedProduct(item);
                        setIsEditModalOpen(true);
                      }}
                      className="px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded-lg"
                    >
                      ویرایش
                    </button>
                    <button
                      onClick={() => {
                        setProductToDelete(item);
                        setIsDeleteModalOpen(true);
                      }}
                      className="bg-red-500 px-2 py-1 hover:bg-red-400 rounded-lg"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination currentPage={page} totalPages={totalPages} />
        
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProduct(null);
          }}
        >
          {selectedProduct && (
            <EditProductForm
              onClose={() => {
                setIsEditModalOpen(false);
                setSelectedProduct(null);
              }}
              product={selectedProduct}
            />
          )}
        </Modal>
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
          }}
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold text-textColor px-3 py-6">
              آیا مطمئن هستید که می‌خواهید این کالا را حذف کنید؟
            </h2>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-gray-800 px-4 py-2 rounded-lg hover:bg-white"
              >
                حذف
              </button>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setProductToDelete(null);
                }}
                className="bg-textColor text-gray-800 px-4 py-2 rounded-lg hover:bg-white"
              >
                انصراف
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </section>
  );
};
