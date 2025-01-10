// path: src/app/layout.tsx

import Providers from './components/common/Providers';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Dashboard</title>
      </head>
      <body className="bg-gray-100 text-gray-900 antialiased h-screen overflow-hidden">
        <Providers>
          <ToastContainer position="top-right" autoClose={3000} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
