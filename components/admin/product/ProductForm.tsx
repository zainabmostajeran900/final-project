"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, SubmitHandler, useWatch } from "react-hook-form";
import { Input } from "@/components/admin/Input";
import { ProductSchema, ProductSchemaType } from "@/validation/product";
import TinyMce from "@/components/admin/product/TinyMce";
import { Thumbnail } from "@/components/admin/product/Thumbnail";
import { Images } from "@/components/admin/product/Images";
import { AddProducts } from "@/apis/services/products";
import { getCategories } from "@/apis/services/categories";
import { getSubCategories } from "@/apis/services/subcategories";
import { useQuery } from "@tanstack/react-query";
import { errorHandler } from "@/utils/error-handler";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { ISubcategory } from "@/types/subcategory";
import { ICategory } from "@/types/category";


interface ProductFormProps {
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onClose }) => {
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductSchemaType>({
    mode: "all",
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: "",
      price: "",
      quantity: "",
      category: "",
      subcategory: "",
      brand: "",
      description: "",
      thumbnail: null,
      images: [],
    },
  });


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
    queryFn:() => getSubCategories({}),
  });

  const selectedCategory = useWatch({
    control,
    name: "category",
  });

  const filteredSubCategories = React.useMemo(() => {
    if (!subCategoriesData?.data?.categories || !selectedCategory) return [];

    return (subCategoriesData.data.categories??[]).filter(
      (subcat: ISubcategory) => subcat.category === selectedCategory
    );
  }, [subCategoriesData, selectedCategory]);

  const onSubmit: SubmitHandler<ProductSchemaType> = async (data) => {
    console.log(data);
    const formData = new FormData();
    formData.append("category", data.category);
    formData.append("subcategory", data.subcategory);
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("quantity", data.quantity);
    formData.append("brand", data.brand);
    formData.append("description", data.description);

    if (data.thumbnail) {
      formData.append("thumbnail", data.thumbnail);
    }

    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    setIsPending(true);
    try {
      await AddProducts(formData);
      toast.success("کالا با موفقیت ایجاد شد");
      onClose();
    } catch (e) {
      errorHandler(e as AxiosError);
      toast.error("خطا در ایجاد کالا");
    }
    setIsPending(false);
  };

  if (categoriesLoading || subCategoriesLoading) {
    return (
      <div className="flex justify-center items-center">
        <p>در حال بارگذاری دسته‌بندی‌ها...</p>
      </div>
    );
  }

  if (categoriesError || subCategoriesError) {
    return (
      <div className="text-red-500">
        خطا در بارگذاری دسته‌بندی‌ها. لطفاً دوباره تلاش کنید.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center space-y-4 text-white pt-10 pb-6 overflow-hidden px-2"
    >
      <div className="flex justify-center gap-x-2">
        <div className="flex flex-col w-full justify-center">
          <label
            htmlFor="categories"
            className="block mb-2 text-right text-sm font-semibold text-textColor dark:text-white"
          >
            دسته بندی
          </label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className={`border  text-gray-900 text-sm rounded-lg  outline-none w-full p-2.5  ${errors.category?'border-red-500':'border-gray-300'}`}
              >
                <option>انتخاب دسته‌بندی</option>
                {categoriesData?.data?.categories.map((category: ICategory) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.category && (
            <p className="text-red-900 text-xs font-semibold capitalize pt-1">
              {errors.category.message}
            </p>
          )}
        </div>
        <div className="flex flex-col w-full justify-center">
          <label
            htmlFor="subcategory"
            className="block mb-2 text-right text-sm text-textColor font-semibold dark:text-white"
          >
            زیردسته بندی
          </label>
          <Controller
            name="subcategory"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                disabled={!selectedCategory}
                className={`border  text-gray-900 text-sm rounded-lg  outline-none w-full p-2.5  ${errors.category?'border-red-500':'border-gray-300'}`}
              >
                <option value="">انتخاب زیردسته‌بندی</option>
                {filteredSubCategories.map((subcat: ISubcategory) => (
                  <option key={subcat._id} value={subcat._id}>
                    {subcat.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.subcategory && (
            <p className="text-red-900 text-xs font-semibold capitalize pt-1">
              {errors.subcategory.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex text-right gap-x-2 justify-center px-2">
        <div className="flex flex-col justify-center items-center text-gray-800">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                error={errors.name?.message}
                label="نام کالا"
                placeholder="نام کالا"
              />
            )}
          />
        </div>
        <div className="flex flex-col justify-center items-center text-gray-800">
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                error={errors.price?.message}
                label="قیمت کالا"
                placeholder="قیمت کالا"
              />
            )}
          />
        </div>
      </div>

      <div className="flex text-right gap-x-2 justify-center px-2 text-gray-800">
        <Controller
          name="quantity"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              error={errors.quantity?.message}
              label="موجودیت کالا"
              placeholder="تعداد"
            />
          )}
        />
        <Controller
          name="brand"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              error={errors.brand?.message}
              label="برند کالا"
              placeholder="برند"
            />
          )}
        />
      </div>
      <div className="text-right">
        <label className="text-textColor font-semibold text-sm">
          توضیحات کالا
        </label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TinyMce initialValue={field.value} onChange={field.onChange} />
          )}
        />
        {errors.description && (
          <p className="text-red-900 text-xs capitalize font-semibold pt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      
      <div className="text-right">
        <Controller
          name="thumbnail"
          control={control}
          render={({ field, fieldState }) => (
            <Thumbnail
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error}
            />
          )}
        />
        <Controller
          name="images"
          control={control}
          render={({ field, fieldState }) => (
            <Images
              value={field.value}
              onChange={field.onChange}
              multiple
              error={fieldState.error}
            />
          )}
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="bg-textColor text-gray-900 font-bold p-2 rounded hover:bg-white hover:text-gray-900 transition"
      >
        {isPending ? "در حال افزودن..." : "افزودن"}
      </button>
    </form>
  );
};

export default ProductForm;
