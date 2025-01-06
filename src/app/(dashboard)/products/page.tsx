//path: src/app/(dashboard)/products/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircle, FileUp, FileDown, Pencil, Trash2, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { Product } from '@/app/types/product';
import { api } from '@/app/lib/api/fetch';

interface ProductsResponse {
  data: Product[];
  meta: {
    last_page: number;
    page: number;
    total: number;
  };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get<ProductsResponse>(`/admin/products?page=${page}`);
        setProducts(response.data);
        setLastPage(response.meta.last_page);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [page]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/admin/products/${id}`);
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const renderProductImage = (product: Product) => {
    if (!product.image) {
      return (
        <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center">
          <ImageIcon className="w-4 h-4 text-gray-400" />
        </div>
      );
    }

    return (
      <div id={`product-image-${product.id}`} className="h-8 w-8 relative flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.title || 'Product image'}
          className="w-full h-full rounded object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            const container = target.parentElement;
            if (container) {
              container.innerHTML = `
                <div class="h-8 w-8 rounded bg-gray-100 flex items-center justify-center">
                  <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>`;
            }
          }}
        />
      </div>
    );
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0 sm:items-center">
          <input
            type="text"
            placeholder="Search products..."
            className="form-control max-w-xs px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <button className="btn bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg px-4 py-2 flex items-center gap-2">
              <FileUp className="w-4 h-4" />
              Import
            </button>
            <button className="btn bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg px-4 py-2 flex items-center gap-2">
              <FileDown className="w-4 h-4" />
              Export
            </button>
            <Link 
              href="/products/create"
              className="btn bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg px-4 py-2 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Add Product
            </Link>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs uppercase">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-500">Title</th>
              <th className="hidden md:table-cell px-3 py-2 text-left font-medium text-gray-500">Description</th>
              <th className="px-3 py-2 text-left font-medium text-gray-500">Price</th>
              <th className="hidden sm:table-cell px-3 py-2 text-left font-medium text-gray-500">Stock</th>
              <th className="hidden lg:table-cell px-3 py-2 text-left font-medium text-gray-500">Category</th>
              <th className="px-3 py-2 text-left font-medium text-gray-500">Status</th>
              <th className="hidden sm:table-cell px-3 py-2 text-left font-medium text-gray-500">Featured</th>
              <th className="px-3 py-2 text-right font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    {renderProductImage(product)}
                    <span className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                      {product.title}
                    </span>
                  </div>
                </td>
                <td className="hidden md:table-cell px-3 py-2">
                  <p className="text-sm text-gray-500 truncate max-w-[200px]">
                    {product.description}
                  </p>
                </td>
                <td className="px-3 py-2">
                  <span className="text-sm font-medium">${product.price.toFixed(2)}</span>
                </td>
                <td className="hidden sm:table-cell px-3 py-2">
                  <span className="text-sm">{product.stock}</span>
                </td>
                <td className="hidden lg:table-cell px-3 py-2">
                  <span className="text-sm truncate max-w-[150px]">{product.category?.name}</span>
                </td>
                <td className="px-3 py-2">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                    product.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="hidden sm:table-cell px-3 py-2">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                    product.featured 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.featured ? 'Featured' : 'Regular'}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex justify-end items-center gap-1">
                    <Link
                      href={`/products/${product.id}/edit`}
                      className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Showing {filteredProducts.length} items
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg ${
                page === 1
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, lastPage))}
              disabled={page === lastPage}
              className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg ${
                page === lastPage
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}