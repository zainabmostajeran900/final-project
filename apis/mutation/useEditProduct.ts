import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditProducts } from "../services/products";
import { toast } from "react-toastify";

interface EditProductPayload {
  id: string;
  data: FormData;
}

export const useEditProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: EditProductPayload) => EditProducts(id, data),
    onSuccess: () => {
      toast.success("Products updated successfully!");
      queryClient.invalidateQueries({ queryKey:["get-product"]});
    },
    
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "An error occurred during update";
      toast.error(`Update failed: ${errorMessage}`);
    },
  });
};
