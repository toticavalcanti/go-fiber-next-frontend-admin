//path: src/app/components/common/Wrapper/index.tsx
interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <div className="h-full w-full space-y-6">
      {children}
    </div>
  );
};

export default Wrapper;