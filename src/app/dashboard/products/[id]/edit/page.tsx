// src/app/(dashboard)/products/[id]/edit/page.tsx
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

export default function EditProductPage({ params }: { params: { id: string } }) {
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
        // Carregar categorias
        const categoriesResponse = await api.get<{data: Category[]}>('/admin/categories');
        setCategories(categoriesResponse.data);

        // Carregar dados do produto
        const productResponse = await api.get<{data: Product}>(`/admin/products/${params.id}`);
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
  }, [params.id]);

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
      }>(`/admin/products/${params.id}`, {
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
      console.error('Error updating product:', error);
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
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea 
            className="form-control" 
            required
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select 
            className="form-control"
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
            value={price}
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

        <button className="btn btn-outline-secondary">Update</button>
      </form>
    </Wrapper>
  );
}