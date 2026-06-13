//subcategories.ts
import { urls } from "../urls";
import axiosInstance from "../client";
import { ISubCategories } from "@/types/subcategory";

type getSubCategoriesType = (_: IReqGetData) => Promise<ISubCategories>;

export const getSubCategories: getSubCategoriesType = async () => {
  const response = await axiosInstance.get(urls.subCategories.list);
  return response.data;
};

export const getAllSubCategories: getSubCategoriesType = async () => {
  const response = await axiosInstance.get(
   `${urls.subCategories.list}?limit=10000`
  );
  return response.data;
};

type getSubcategoryBySlugType = (slug: string) => Promise<ISubCategories>;

export const getSubCategoryBySlug: getSubcategoryBySlugType = async (slug) => {
  const response = await axiosInstance.get(
    `${urls.subCategories.list}?slugname=${slug}`
  );
  console.log(response.data);
  return response.data.data.subcategories[0];
};