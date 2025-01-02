// src/app/components/common/ui/card.tsx
import { cn } from "@/app/types/style";
import { HTMLAttributes, forwardRef } from "react";

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("rounded-lg border border-gray-200 bg-white shadow", className)}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

export { Card };