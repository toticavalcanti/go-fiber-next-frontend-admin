// src/app/(dashboard)/products/create/page.tsx
'use client';

import { SyntheticEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/lib/api/fetch';
import Wrapper from '@/app/components/common/Wrapper';
import { Card } from '@/app/components/common/ui/card/card';
import ImageUpload from '@/app/components/common/ImageUpload';
import { toast } from 'react-toastify';

interface Category {
  id: number;
  name: string;
}

export default function CreateProductPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [categoryId, setCategoryId] = useState(0);
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get<{ data: { categories: Category[] } }>('/admin/categories');

        if (response.data?.categories && Array.isArray(response.data.categories)) {
          setCategories(response.data.categories);
        } else {
          console.error('Unexpected categories response format:', response.data);
          toast.error('Failed to load categories.');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories.');
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      await api.post<void, {
        title: string;
        description: string;
        image: string;
        price: number;
        stock: number;
        category_id: number;
        active: boolean;
        featured: boolean;
      }>('/admin/products', {
        title,
        description,
        image,
        price,
        stock,
        category_id: categoryId,
        active,
        featured,
      });

      toast.success('Product created successfully!');
      router.push('/products');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product.');
    }
  };

  return (
    <Wrapper>
      <Card className="max-w-3xl mx-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Create Product</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  rows={4}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Category</label>
                  <button
                    type="button"
                    onClick={() => router.push('/categories/create')}
                    className="px-3 py-1 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-100"
                  >
                    + Add Category
                  </button>
                </div>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  onChange={(e) => setCategoryId(parseInt(e.target.value))}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image</label>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Image URL"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                    />
                    <ImageUpload uploaded={setImage} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    step="0.01"
                    min="0"
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Stock</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    min="0"
                    onChange={(e) => setStock(parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                  />
                  <span className="ml-2 text-sm font-medium">Active</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                  />
                  <span className="ml-2 text-sm font-medium">Featured</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => router.push('/products')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Product
                </button>
              </div>
            </div>
          </form>
        </div>
      </Card>
    </Wrapper>
  );
}
