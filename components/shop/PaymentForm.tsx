"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/admin/Input";
import { useForm, Controller } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "@/redux/Hook";
import { useRouter } from "next/navigation";
import { clearCart } from "@/redux/slices/cartSlice";
import { toast } from "react-toastify";
import { PaymentSchema, PaymentSchemaType } from "@/validation/payment";

export const PaymentForm: React.FC = () => {
  const { cart } = useAppSelector((state) => state.cart);
  const total = cart.reduce((acc, item) => {
    return acc + item.price * item.cartQuantity;
  }, 0);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentSchemaType>({
    mode: "all",
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      cardNumber: "",
      internetPassword: "",
      Mounth: "",
      year: "",
      cvv2: "",
    },
  });

  const dispatch = useAppDispatch();
  const { push } = useRouter();

  const cancelPayment = () => {
    push("/shop/PaymentFaild");
    toast.error("پرداخت ناموفق");
  };

  const onSubmit = (data: PaymentSchemaType) => {
    const error = false;
    if (error) {
      push("/shop/PaymentFaild");
      toast.error("پرداخت ناموفق بود");
    } else {
      dispatch(clearCart());
      toast.success("پرداخت موفق بود");
      push("/shop/paymentSuccess");
    }
    console.log("Form Data:", data);
  };

  return (
    <div className="block space-y-5 sm:flex sm:gap-x-6 sm:space-y-0">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 py-6 px-4 bg-base text-right rounded-md shadow-lg sm:w-2/3"
      >
        <p className="text-2xl font-semibold text-textColor text-center">
          پرداخت
        </p>
        <div className="grid grid-cols-1 gap-x-4 gap-y-4">
          <div className="space-y-4">
            <Controller
              name="cardNumber"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  error={errors.cardNumber?.message}
                  label="شماره کارت"
                  placeholder="شماره کارت"
                />
              )}
            />
            <Controller
              name="internetPassword"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  error={errors.internetPassword?.message}
                  label="رمز اینترنتی"
                  placeholder="رمز اینترنتی"
                />
              )}
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 items-center gap-4">
              <Controller
                name="Mounth"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    error={errors.Mounth?.message}
                    label="ماه"
                    placeholder="ماه"
                  />
                )}
              />
              <Controller
                name="year"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    error={errors.year?.message}
                    label="سال"
                    placeholder="سال"
                  />
                )}
              />
              <Controller
                name="cvv2"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    error={errors.cvv2?.message}
                    label="cvv2"
                    placeholder="cvv2"
                  />
                )}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-x-2">
          <button
            type="submit"
            className="py-2 px-4 w-full bg-textColor text-white text-sm rounded-md font-semibold hover:bg-slate-300 sm:text-gray-800"
          >
            پرداخت
          </button>
          <button
            type="button"
            onClick={cancelPayment}
            className="py-2 px-4 w-full bg-slate-300 text-sm rounded-md font-semibold hover:bg-slate-400 sm:text-gray-800"
          >
            انصراف
          </button>
        </div>
      </form>
      <div className="bg-base rounded-lg p-6 sm:p-8 sm:w-1/3">
        <div className="flex flex-col gap-y-4 text-textColor">
          <p className="text-sm sm:text-textColor">
            مبلغ قابل پرداخت:{" "}
            <span className="font-bold">
              {total.toLocaleString("ar-EG")} تومان
            </span>
          </p>
          <p className="text-sm sm:text-textColor">
            نام پذیرنده: کیف پول الکترونیک پارسیان
          </p>
          <p className="text-sm sm:text-textColor">کد پذیرنده: 1253</p>
          <p className="text-sm sm:text-textColor">آدرس پذیرنده: Paypal.ir</p>
        </div>
      </div>
    </div>
  );
};