import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteProducts } from "../services/products";
import { toast } from "react-toastify";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: DeleteProducts,
    onSuccess: () => {
      toast.success("حذف موفقیت‌آمیز بود");
      queryClient.invalidateQueries({queryKey:["get-product"]});
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "خطا در حذف کالا";
      toast.error(errorMessage);
    },
  });
};
