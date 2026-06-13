"use client";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { OrderDataSchema, OrderDataSchemaType } from "@/validation/Order";
import { Input } from "@/components/admin/Input";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export const OrderDataForm: React.FC = () => {
  const { isAuthenticated, initialized, user } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrderDataSchemaType>({
    mode: "all",
    resolver: zodResolver(OrderDataSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      province: "",
      phoneNumber: "",
      deliveryDate: null,
    },
  });

  useEffect(() => {
    if (!initialized) return;

    if (!isAuthenticated) {
      router.replace("/auth/login");
    } else if (user) {
      reset({
        firstName: user.firstname,
        lastName: user.lastname,
        address: user.address,
        city: "",
        province: "",
        phoneNumber: user.phoneNumber,
        deliveryDate: null,
      });
    }
  }, [initialized, isAuthenticated, user, reset, router]);

  const onSubmit = (data: OrderDataSchemaType) => {
    toast.success("اطلاعات با موفقیت ثبت شد!");
    console.log("Form Data:", data);
    router.push("/shop/Payment");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3 py-6 px-5 bg-base text-right rounded-md shadow-lg"
    >
      <p className="sm:text-2xl font-semibold text-textColor text-center">
        اطلاعات تماس
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                error={errors.firstName?.message}
                label="نام"
                placeholder="نام"
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                error={errors.lastName?.message}
                label="نام خانوادگی"
                placeholder="نام خانوادگی"
              />
            )}
          />
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="phone"
                error={errors.phoneNumber?.message}
                label="شماره تماس"
                placeholder="شماره تماس"
              />
            )}
          />
        </div>
        <div className="space-y-4">
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                error={errors.address?.message}
                label="آدرس"
                placeholder="آدرس"
              />
            )}
          />
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                error={errors.city?.message}
                label="شهر"
                placeholder="شهر"
              />
            )}
          />
          <Controller
            name="province"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                error={errors.province?.message}
                label="استان"
                placeholder="استان"
              />
            )}
          />
          <Controller
            name="deliveryDate"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-y-2">
                <label className="block text-textColor text-xs capitalize font-semibold">
                  زمان تحویل
                </label>
                <DatePicker
                  value={field.value}
                  onChange={(date) =>
                    field.onChange(date?.format("YYYY-MM-DD"))
                  }
                  calendar={persian}
                  locale={persian_fa}
                  placeholder="زمان تحویل"
                  className="rounded-md w-full text-sm text-gray-800"
                  inputClass={`placeholder:text-gray-500 outline-none placeholder:text-xs placeholder:font-semibold border rounded-md py-1 px-2 ${
                    errors.deliveryDate ? "border-red-500" : "border-gray-300"
                  } ${
                    errors.deliveryDate
                      ? "placeholder:text-red-900"
                      : "placeholder:text-gray-300"
                  }`}
                />
                {errors.deliveryDate && (
                  <p className="text-red-900 text-xs font-semibold mt-1">
                    {errors.deliveryDate.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>
      </div>
      <button
        type="submit"
        className="py-2 mt-3 px-1 w-full bg-textColor text-slate-600 text-sm rounded-md font-semibold hover:bg-slate-300"
      >
        ثبت
      </button>
    </form>
  );
};
