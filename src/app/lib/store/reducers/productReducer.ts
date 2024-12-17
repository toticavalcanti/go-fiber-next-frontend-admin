// src/app/lib/store/reducers/productReducer.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/fetch';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category_id: number;
  active: boolean;
  featured: boolean;
}

interface ProductState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async () => {
    const response = await api.get<{data: Product[]}>('/admin/products');
    return response.data;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null
  } as ProductState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export default productSlice.reducer;