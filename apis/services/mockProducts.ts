import mockProducts from "../../data/mockProducts.json";

export interface IProductsResponse {
  status: number;
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: {
    products: {
      _id: string;
      category: string;
      subcategory: string;
      name: string;
      price: number;
      quantity: number;
      brand: string;
      thumbnail: string;
      images: string[];
      slugname: string;
    }[];
  };
}

export const getMockProducts = async (): Promise<IProductsResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockProducts as unknown as IProductsResponse;
};