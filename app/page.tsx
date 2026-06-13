"use client";

import React from "react";
import Navbar from "../components/shop/Navbar";
import Footer from "../components/shop/Footer";
import { CarouselPlugin } from "../components/shop/Mycarousel";
import ToggleCategory from "../components/shop/ToggleCategory";
import { MdOutlineArrowLeft } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/apis/services/categories";
import ProductList from "@/components/shop/ProductList";

const Home: React.FC = () => {
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  if (categoriesLoading) {
    return (
      <div className="flex justify-end items-center">
        <h3>در حال بارگذاری...</h3>
      </div>
    );
  }

  if (categoriesError) {
    return <div className="text-red-500">خطا در بارگذاری دسته‌بندی‌ها</div>;
  }

  return (
    <section>
      <Navbar />
      <div className="container mx-auto max-w-[1400px] bg-second ">
        <div className="flex flex-col items-center justify-center bg-slate-900 text-textColor text-md font-semibold w-full h-14">
          به فروشگاه پیتزا نوشا خوش آمدید
        </div>
        <div className="flex justify-between items-center px-4 py-4 text-slate-900">
          {/* Toggle Category */}
          <ToggleCategory />
          <div className="relative text-white">
            <input
              type="text"
              name="search"
              id="search-input"
              className="block cursor-pointer text-gray-900 text-right px-8 w-full rounded border py-1.5 shadow-sm ring-slate-300 sm:text-sm sm:leading-6"
              placeholder="جستجو"
            />
            <div className="absolute inset-y-0 px-3 right-0 text-white flex items-center pointer-events-none">
              {/* <img src="/input-prefix.svg" alt="Search Icon" /> */}
                <Image
                      src={`/input-prefix.svg`}
                      width={15}
                      height={15}
                      alt={`Search Icon`}
                    />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <CarouselPlugin />
        </div>
        <div className="flex flex-col gap-y-8 px-4 py-8">
          {categoriesData?.data?.categories.map((category) => (
            <div key={category._id} className="text-right">
              <div className="flex items-center justify-start gap-x-2 mb-4">
                <Link href={`/shop/group/${category.slugname}`}>
                  <p className="font-bold text-2xl py-2">{`گروه انواع ${category.name}`}</p>
                </Link>
                <MdOutlineArrowLeft className="size-5 border border-textColor" />
              </div>
              <ProductList key={category._id} category={category} limit={8} />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default Home;
