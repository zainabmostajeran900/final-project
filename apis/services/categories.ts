// import { urls } from "../urls";
// import axiosInstance from "../client";

// type getCategoriesType = (_: IReqGetData) => Promise<ICategories>;

// export const getCategories: getCategoriesType = async () => {
//   const response = await axiosInstance.get(urls.categories.list);
//   return response.data;
// };

// type getCategoryBySlugType = (slug: string) => Promise<ICategory>;

// export const getCategoryBySlug: getCategoryBySlugType = async (slug) => {
//   const response = await axiosInstance.get(
//     `${urls.categories.list}?slugname=${slug}`
//   );
//   return response.data.data.categories[0];
// };
// فایل: services/categories.ts

import { urls } from "../urls";
import axiosInstance from "../client";

// تعریف نوع برای پارامترهای اختیاری
export interface IReqGetData {
  page?: number;
  limit?: number;
  search?: string;
  slugname?: string;
  // هر پارامتر دیگه‌ای که نیاز داری
}

// تعریف نوع پاسخ
export interface ICategories {
  data: {
    categories: ICategory[];
  };
}

export interface ICategory {
  _id: string;
  name: string;
  slugname: string;
  description?: string;
  image?: string;
  // سایر فیلدهای مورد نیاز
}

// ✅ اصلاح 1: درست کردن نوع getCategories (پارامتر اختیاری)
type getCategoriesType = (params?: IReqGetData) => Promise<ICategories>;

// ✅ اصلاح 2: اضافه کردن پارامتر اختیاری به تابع
export const getCategories: getCategoriesType = async (params?: IReqGetData) => {
  // ساخت آبجکت پارامترها برای ارسال به API
  const queryParams = params ? { ...params } : {};
  
  const response = await axiosInstance.get(urls.categories.list, {
    params: queryParams
  });
  
  return response.data;
};

// نوع برای getCategoryBySlug (این یکی درسته و نیازی به تغییر نداره)
type getCategoryBySlugType = (slug: string) => Promise<ICategory>;

export const getCategoryBySlug: getCategoryBySlugType = async (slug) => {
  const response = await axiosInstance.get(
    `${urls.categories.list}?slugname=${slug}`
  );
  return response.data.data.categories[0];
};