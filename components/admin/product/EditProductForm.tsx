"use client";

import React, { useEffect, useState, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, SubmitHandler, useWatch } from "react-hook-form";
import { ProductSchema, ProductSchemaType } from "@/validation/product";
import { Input } from "@/components/admin/Input";
import TinyMce from "@/components/admin/product/TinyMce";
import { Thumbnail } from "@/components/admin/product/Thumbnail";
import { Images } from "@/components/admin/product/Images";
import { EditProducts } from "@/apis/services/products";
import { getCategories } from "@/apis/services/categories";
import { getSubCategories } from "@/apis/services/subcategories";
import { useQuery } from "@tanstack/react-query";
import { errorHandler } from "@/utils/error-handler";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { IProducts } from "@/types/products";
import { ISubcategory } from "@/types/subcategory";
import { ICategory } from "@/types/category";


interface EditProductFormProps {
  onClose: () => void;
  product: IProducts;
}

const EditProductForm: React.FC<EditProductFormProps> = ({
  onClose,
  product,
}) => {
  const [isPending, setIsPending] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductSchemaType>({
    mode: "all",
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: product.name,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      category: product.category,
      subcategory: product.subcategory,
      brand: product.brand,
      description: product.description,
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
    queryFn: () => getSubCategories({}),
  });

  const selectedCategory = useWatch({
    control,
    name: "category",
  });

const filteredSubCategories = useMemo(() => {
  if (!subCategoriesData?.data?.categories || !selectedCategory) return [];
  return subCategoriesData.data.categories.filter(
    (subcat: ISubcategory) => subcat.category === selectedCategory
  );
}, [subCategoriesData, selectedCategory]);

  useEffect(() => {
    if (product) {
      setValue("name", product.name || "");
      setValue("price", product.price.toString() || "");
      setValue("quantity", product.quantity.toString() || "");
      setValue("category", product.category || "");
      setValue("subcategory", product.subcategory || "");
      setValue("brand", product.brand || "");
      setValue("description", product.description || "");
    }
  }, [product, setValue]);

  const onSubmit: SubmitHandler<ProductSchemaType> = async (data) => {
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
      await EditProducts(product._id, formData);
      toast.success("کالا با موفقیت ویرایش شد");
      onClose();
    } catch (e) {
      errorHandler(e as AxiosError);
      toast.error("خطا در ویرایش کالا");
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
                className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              >
                <option value="">انتخاب دسته‌بندی</option>
                {categoriesData?.data?.categories.map((cat: ICategory) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.category && (
            <p className="text-red-500 text-xs font-semibold capitalize">
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
                className="border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
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
            <p className="text-red-500 text-xs font-semibold capitalize">
              {errors.subcategory.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex text-right gap-x-2 justify-center px-2">
        <div className="flex flex-col justify-center items-center">
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
        <div className="flex flex-col justify-center items-center">
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

      <div className="flex text-right gap-x-2 justify-center px-2">
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
            <TinyMce
              initialValue={field.value}
              onChange={(content) => field.onChange(content)}
            />
          )}
        />
        {errors.description && (
          <p className="text-red-500 text-xs capitalize font-semibold">
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
              existingUrl={
                product.thumbnail
                  ? `https://backend-final-rho.vercel.app/images/products/thumbnails/${product.thumbnail}`
                  : null
              }
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
              existingUrls={
                product.images?.length
                  ? product.images.map(
                      (img) =>
                        `https://backend-final-rho.vercel.app/images/products/images/${img}`,
                    )
                  : []
              }
            />
          )}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-textColor text-gray-900 font-bold p-2 rounded hover:bg-white hover:text-gray-900 transition"
      >
        {isPending ? "در حال ویرایش..." : "ویرایش"}
      </button>
    </form>
  );
};

export default EditProductForm;
