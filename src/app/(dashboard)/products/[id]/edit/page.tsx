//path: src/app/(dashboard)/products/[id]/edit/page.tsx
"use client";

import { SyntheticEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api/fetch";
import Wrapper from "@/app/components/common/Wrapper";
import { use } from "react";
import { Card } from "@/app/components/common/ui/card/card";
import { ProductImage } from "@/app/components/common/ProductImage";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  images: string[];
  price: number;
  stock: number;
  category_id: number;
  active: boolean;
  featured: boolean;
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [categoryId, setCategoryId] = useState(0);
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await api.get<{
          data: { categories: Category[] };
        }>("/admin/categories");

        console.log("Categories Response:", categoriesResponse); // Log para verificar o formato

        // Extraindo as categorias do formato correto
        if (categoriesResponse?.data?.categories) {
          setCategories(categoriesResponse.data.categories);
        } else {
          console.error(
            "Unexpected categories response format:",
            categoriesResponse
          );
        }

        const productResponse = await api.get<{ data: Product }>(
          `/admin/products/${resolvedParams.id}`
        );
        const product = productResponse.data;

        if (product) {
          setTitle(product.title);
          setDescription(product.description);
          setImages(product.images);
          setPrice(product.price);
          setStock(product.stock);
          setCategoryId(product.category_id);
          setActive(product.active);
          setFeatured(product.featured);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [resolvedParams.id]);

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages((prevImages) => [...prevImages, newImageUrl.trim()]);
      setNewImageUrl("");
    } else {
      alert("Please enter a valid image URL");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      await api.put<
        void,
        {
          title: string;
          description: string;
          images: string[]; // Lista de URLs de imagens
          price: number;
          stock: number;
          category_id: number;
          active: boolean;
          featured: boolean;
        }
      >(`/admin/products/${resolvedParams.id}`, {
        title,
        description,
        images, // Envia a lista de imagens
        price,
        stock,
        category_id: categoryId,
        active,
        featured,
      });

      router.push("/products");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <Wrapper>
      <Card className="max-w-3xl mx-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Edit Product</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Category</label>
                  <button
                    type="button"
                    onClick={() => router.push("/categories/create")} // Redireciona para a página de criação de categoria
                    className="px-3 py-1 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-100"
                  >
                    + Add Category
                  </button>
                </div>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  value={categoryId}
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
                <label className="block text-sm font-medium mb-2">Images</label>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    {images.map((url, index) => (
                      <div key={index} className="relative">
                        <ProductImage src={url} size="lg" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Image URL"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add Image
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    min="0"
                    value={stock}
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
                  onClick={() => router.push("/products")}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Update Product
                </button>
              </div>
            </div>
          </form>
        </div>
      </Card>
    </Wrapper>
  );
}
