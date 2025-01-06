//path: src/app/products/layout.tsx
'use client';

import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function ProductsLayout({ children }: LayoutProps) {
  return (
    <div className="p-6 mt-8 ml-40 overflow-auto h-[calc(100vh-5rem)] bg-gray-100">
      {children}
    </div>
  );
}