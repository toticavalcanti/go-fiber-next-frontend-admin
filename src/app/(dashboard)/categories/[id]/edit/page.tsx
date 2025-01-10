'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/app/lib/api/fetch';
import Wrapper from '@/app/components/common/Wrapper';
import { Card } from '@/app/components/common/ui/card/card';
import { toast } from 'react-toastify';

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await api.get<{ data: { name: string; description: string } }>(`/admin/categories/${id}`);
        setName(response.data.name);
        setDescription(response.data.description);
      } catch (error) {
        console.error('Error fetching category:', error);
        toast.error('Failed to fetch category details.');
      }
    };

    fetchCategory();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.put<void, { name: string; description: string }>(`/admin/categories/${id}`, {
        name,
        description,
      });

      toast.success('Category updated successfully!');
      router.push('/categories');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category.');
    }
  };

  return (
    <Wrapper>
      <Card className="max-w-3xl mx-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Edit Category</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Category Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => router.push('/categories')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </Card>
    </Wrapper>
  );
}