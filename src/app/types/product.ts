// src/app/types/product.ts

// Interface for product category
export interface Category {
  id: number;
  name: string;
  description?: string;
  slug?: string;
}

// Product base interface
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

// Interface that extends Product for analytics
export interface ProductAnalytics extends Product {
  orders: number;
  totalValue: number;
  adsSpent: number;
  refunds: number;
  refundTrend: 'up' | 'down' | 'neutral';
}