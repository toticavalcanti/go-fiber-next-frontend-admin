//path: src/app/types/product.ts
export interface Category {
  id: number;
  name: string;
  description?: string;
  slug?: string;
}

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
  category?: Category;
  created_at?: string;
  updated_at?: string;
}

// Interface específica para o endpoint de top products
export interface TopProduct {
  id: number;
  name: string;
  sales: number;
  revenue: number;
  stock_level: number;
}

// Interface estendida para analytics
export interface TopProductAnalytics extends TopProduct {
  image?: string;
  adsSpent: number;
  refunds: number;
  refundTrend: 'up' | 'down' | 'neutral';
  category?: {
    id: number;
    name: string;
  };
}