//path: src/app/components/common/ui/ProductImage/index.tsx
import { HTMLAttributes, useState } from 'react';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/app/types/style';

interface ProductImageProps extends HTMLAttributes<HTMLDivElement> {
 src: string;
 size?: 'sm' | 'lg';
}

export const ProductImage = ({ src, size = 'sm', className, ...props }: ProductImageProps) => {
 const [imageError, setImageError] = useState(false);
 const dimensions = size === 'sm' ? 'h-12 w-12' : 'h-48 w-48';
 const iconSize = size === 'sm' ? 'w-6 h-6' : 'w-12 h-12';

 if (!src || imageError) {
   return (
     <div className={cn(`${dimensions} rounded bg-gray-100 flex items-center justify-center`, className)} {...props}>
       <ImageIcon className={`${iconSize} text-gray-400`} />
     </div>
   );
 }

 return (
   <div className={cn(`${dimensions} relative flex-shrink-0`, className)} {...props}>
     <Image
       src={src}
       alt="Product image"
       fill
       className="rounded object-cover"
       sizes={size === 'sm' ? '48px' : '192px'}
       onError={() => setImageError(true)}
     />
   </div>
 );
};