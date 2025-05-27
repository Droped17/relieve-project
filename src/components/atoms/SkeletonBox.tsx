const SkeletonBox = ({
  width = '100%',
  height = '1rem',
  className = '',
  children
}: {
  width?: string
  height?: string
  className?: string
  children?: React.ReactNode
}) => (
  <div
    className={`bg-gray-300 animate-pulse rounded ${className}`}
    style={{ width, height }}
  >{children}</div>
)

export default SkeletonBox