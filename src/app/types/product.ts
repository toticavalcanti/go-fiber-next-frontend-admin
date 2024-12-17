export interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  active: boolean;
  featured: boolean;
  category_id: number;
  category?: {
      id: number;
      name: string;
      description?: string;
      slug?: string;
  };
  created_at?: string;
  updated_at?: string;
}