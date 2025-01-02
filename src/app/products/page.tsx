// src/app/(dashboard)/products/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/app/lib/api/fetch';
import Wrapper from '@/app/components/common/Wrapper';
import Paginator from '@/app/components/common/Paginator';
import { Product } from '@/app/types/product';

interface ProductsResponse {
  data: Product[];
  meta: {
    last_page: number;
  };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.get<ProductsResponse>(`/admin/products?page=${page}`);
        setProducts(data.data);
        setLastPage(data.meta.last_page);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [page]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete<void>(`/admin/products/${id}`);
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <Wrapper>
      <div className="btn-group mr-2">
        <Link 
          href="/dashboard/products/create" 
          className="btn btn-sm mt-2 btn-outline-secondary"
        >
          Add
        </Link>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Image</th>
              <th scope="col">Title</th>
              <th scope="col">Description</th>
              <th scope="col">Price</th>
              <th scope="col">Stock</th>
              <th scope="col">Category</th>
              <th scope="col">Status</th>
              <th scope="col">Featured</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image} width="50" alt={product.title} />
                </td>
                <td>{product.title}</td>
                <td>{product.description}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>{product.category?.name}</td>
                <td>
                  <span className={`badge ${product.active ? 'bg-success' : 'bg-danger'}`}>
                    {product.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <span className={`badge ${product.featured ? 'bg-primary' : 'bg-secondary'}`}>
                    {product.featured ? 'Featured' : 'Regular'}
                  </span>
                </td>
                <td>
                  <div className="btn-group">
                    <Link 
                      href={`/dashboard/products/${product.id}/edit`}
                      className="btn btn-sm btn-outline-secondary"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Paginator page={page} lastPage={lastPage} pageChanged={setPage} />
    </Wrapper>
  );
}