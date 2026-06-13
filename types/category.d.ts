export interface ICategory {
  _id: string;
  name: string;
  slugname: string;
  description?: string;
}

export interface ICategories {
  status: number;
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: {
    categories: ICategory[];
  };
}