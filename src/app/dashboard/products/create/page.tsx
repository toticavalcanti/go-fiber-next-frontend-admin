// src/app/(dashboard)/products/create/page.tsx
'use client';

import { SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/lib/api/fetch';
import Wrapper from '@/app/components/common/Wrapper';
import ImageUpload from '@/app/components/common/ImageUpload';

export default function CreateProductPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState(0);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      await api.post<void, {
        title: string;
        description: string;
        image: string;
        price: number;
      }>('/products', {
        title,
        description,
        image,
        price
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
            name="title"
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea 
            className="form-control" 
            name="description"
            onChange={e => setDescription(e.target.value)}
          />
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
            name="price"
            onChange={e => setPrice(parseFloat(e.target.value))}
          />
        </div>

        <button className="btn btn-outline-secondary">Save</button>
      </form>
    </Wrapper>
  );
}