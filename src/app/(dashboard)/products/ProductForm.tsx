'use client';

import React, { useState } from 'react';
import { api } from '@/app/lib/api/fetch'; // Importando o `api` customizado

interface ProductData {
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
}

const ProductForm = () => {
  const [product, setProduct] = useState<ProductData>({
    title: '',
    description: '',
    price: 0,
    category: '',
    images: [],
  });

  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post('/admin/products', product);
      setMessage('Produto criado com sucesso!');
      console.log('Resposta da API:', response);
    } catch (error) {
      setMessage('Erro ao criar o produto.');
      console.error('Erro:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Título:</label>
        <input
          type="text"
          id="title"
          value={product.title}
          onChange={(e) => setProduct({ ...product, title: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="description">Descrição:</label>
        <textarea
          id="description"
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="price">Preço:</label>
        <input
          type="number"
          id="price"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
        />
      </div>
      <div>
        <label htmlFor="category">Categoria:</label>
        <input
          type="text"
          id="category"
          value={product.category}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="images">Imagens:</label>
        <input
          type="text"
          id="images"
          placeholder="URL da imagem"
          value={product.images[0] || ''}
          onChange={(e) => setProduct({ ...product, images: [e.target.value] })}
        />
      </div>
      <button type="submit">Criar Produto</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default ProductForm;
