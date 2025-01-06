//path: src/app/(dashboard)/products/[id]/edit/page.tsx
'use client';

import { SyntheticEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/lib/api/fetch';
import Wrapper from '@/app/components/common/Wrapper';
import ImageUpload from '@/app/components/common/ImageUpload';
import { use } from 'react';
import { Card } from '@/app/components/common/ui/card/card';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  category_id: number;
  active: boolean;
  featured: boolean;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
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
    const fetchData = async () => {
      try {
        // Load categories
        const categoriesResponse = await api.get<{data: Category[]}>('/admin/categories');
        setCategories(categoriesResponse.data);

        // Load product data
        const productResponse = await api.get<{data: Product}>(`/admin/products/${resolvedParams.id}`);
        const product = productResponse.data;

        setTitle(product.title);
        setDescription(product.description);
        setImage(product.image);
        setPrice(product.price);
        setStock(product.stock);
        setCategoryId(product.category_id);
        setActive(product.active);
        setFeatured(product.featured);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [resolvedParams.id]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      await api.put<void, {
        title: string;
        description: string;
        image: string;
        price: number;
        stock: number;
        category_id: number;
        active: boolean;
        featured: boolean;
      }>(`/admin/products/${resolvedParams.id}`, {
        title,
        description,
        image,
        price,
        stock,
        category_id: categoryId,
        active,
        featured
      });

      router.push('/products');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <Wrapper>
      <Card className="max-w-3xl mx-auto p-6 shadow-md rounded-lg">
        <h2 className="text-lg font-semibold mb-6">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="block mb-2">Title</label>
            <input 
              type="text" 
              className="form-control w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label className="block mb-2">Description</label>
            <textarea 
              className="form-control w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="block mb-2">Category</label>
            <select 
              className="form-control w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              value={categoryId}
              onChange={e => setCategoryId(parseInt(e.target.value))}
            >
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="block mb-2">Image</label>
            <div className="input-group">
              <input
                className="form-control w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={image}
                onChange={e => setImage(e.target.value)}
              />
              <ImageUpload uploaded={setImage} />
            </div>
          </div>

          <div className="form-group">
            <label className="block mb-2">Price</label>
            <input 
              type="number" 
              className="form-control w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required
              step="0.01"
              min="0"
              value={price}
              onChange={e => setPrice(parseFloat(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="block mb-2">Stock</label>
            <input 
              type="number" 
              className="form-control w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required
              min="0"
              value={stock}
              onChange={e => setStock(parseInt(e.target.value))}
            />
          </div>

          <div className="form-check mb-3">
            <input 
              type="checkbox" 
              className="form-check-input" 
              id="active"
              checked={active}
              onChange={e => setActive(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="active">Active</label>
          </div>

          <div className="form-check mb-3">
            <input 
              type="checkbox" 
              className="form-check-input" 
              id="featured"
              checked={featured}
              onChange={e => setFeatured(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="featured">Featured</label>
          </div>

          <div className="flex justify-end gap-2">
            <button 
              type="button" 
              onClick={() => router.push('/products')}
              className="btn btn-light px-4 py-2 rounded-md text-gray-700 bg-white hover:bg-gray-100"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-outline-secondary px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-700">
              Update
            </button>
          </div>
        </form>
      </Card>
    </Wrapper>
  );
}