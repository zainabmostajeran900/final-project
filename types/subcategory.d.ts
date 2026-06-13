export interface ISubcategory {
  _id: string;
  name: string;
  category: string;
  icon: string;
  slugname: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISubCategories {
  status: string;
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: {
    categories: ISubcategory[];
  };
}
