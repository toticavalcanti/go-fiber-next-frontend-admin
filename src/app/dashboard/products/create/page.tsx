// src/app/(dashboard)/products/create/page.tsx
'use client';

import { SyntheticEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/lib/api/fetch';
import Wrapper from '@/app/components/common/Wrapper';
import ImageUpload from '@/app/components/common/ImageUpload';

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
        const response = await api.get<{data: Category[]}>('/admin/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
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
        featured
      });

      router.push('/dashboard/products');
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <Wrapper>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input 
            type="text" 
            className="form-control" 
            required
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea 
            className="form-control" 
            required
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select 
            className="form-control"
            required
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
          <label>Image</label>
          <div className="input-group">
            <input
              className="form-control"
              value={image}
              onChange={e => setImage(e.target.value)}
            />
            <ImageUpload uploaded={setImage} />
          </div>
        </div>

        <div className="form-group">
          <label>Price</label>
          <input 
            type="number" 
            className="form-control" 
            required
            step="0.01"
            min="0"
            onChange={e => setPrice(parseFloat(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label>Stock</label>
          <input 
            type="number" 
            className="form-control" 
            required
            min="0"
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

        <button className="btn btn-outline-secondary">Save</button>
      </form>
    </Wrapper>
  );
}