const SkeletonText = ({ width = '100%', height, className }: { width?: string, height?: string, className?: string }) => (
  <div
    className={`bg-gray-100 animate-pulse rounded ${className}`}
    style={{ width, height }}
  />
);

export default SkeletonText