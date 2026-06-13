import mockCategories from "../../data/mockCategories.json";
import { ICategories } from "@/types/category"; // مسیر رو چک کن

export const getMockCategories = async (): Promise<ICategories> => {
  // شبیه‌سازی delay شبکه
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return mockCategories as unknown as ICategories;
};

