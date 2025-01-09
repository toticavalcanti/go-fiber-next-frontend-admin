'use client';

import { useEffect, useState } from 'react';
import { api } from '@/app/lib/api/fetch';
import Wrapper from '@/app/components/common/Wrapper';
import { Card } from '@/app/components/common/ui/card/card';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get<{ data: Category[] }>('/admin/categories');
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleEdit = (id: number) => {
    router.push(`/categories/${id}/edit`);
  };

  const handleCreate = () => {
    router.push('/categories/create');
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      console.log(`Category with id ${id} deleted.`);
    }
  };

  return (
    <Wrapper>
      <Card className="max-w-5xl mx-auto ml-44">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Categories</h2>
            <button
              onClick={handleCreate}
              className="btn bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg px-4 py-2"
            >
              Add Category
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {categories.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-xs uppercase">
                  <tr>
                    <th className="px-3 py-2 font-medium text-gray-500">Name</th>
                    <th className="px-3 py-2 font-medium text-gray-500">Description</th>
                    <th className="px-3 py-2 font-medium text-gray-500">Active</th>
                    <th className="px-3 py-2 font-medium text-gray-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm font-medium text-gray-900">
                        {category.name}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-500">
                        {category.description}
                      </td>
                      <td className="px-3 py-2 text-sm">
                        <span
                          className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                            category.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {category.active ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex justify-end items-center gap-1">
                          <button
                            onClick={() => handleEdit(category.id)}
                            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
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
            ) : (
              <p className="text-center text-gray-500">No categories found.</p>
            )}
          </div>
        </div>
      </Card>
    </Wrapper>
  );
}