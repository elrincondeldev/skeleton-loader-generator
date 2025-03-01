interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

export const TextSkeleton: React.FC<SkeletonProps> = ({ width = "3/4", height = "4" }) => (
  <div className={`h-${height} w-${width} bg-gray-300 rounded animate-pulse`} />
);

export const InlineElementSkeleton: React.FC<SkeletonProps> = ({ width = "20", height = "4" }) => (
  <div className={`inline-block h-${height} bg-gray-300 rounded mx-1 w-${width} animate-pulse`} />
);

export const BlockElementSkeleton: React.FC<SkeletonProps & { children?: React.ReactNode }> = ({ 
  height = "4",
  children 
}) => (
  <div className={`w-full space-y-4 animate-pulse ${height !== "4" ? `h-${height}` : ""}`}>
    {children || <TextSkeleton />}
  </div>
);

export const NavSkeleton: React.FC = () => (
  <div className="w-full flex items-center justify-between p-4 border-b border-gray-200 animate-pulse">
    <div className="h-8 w-32 bg-gray-300 rounded" />
    <div className="flex gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={`nav-item-${i}`} className="h-4 w-20 bg-gray-300 rounded" />
      ))}
    </div>
    <div className="h-10 w-10 bg-gray-300 rounded-full" />
  </div>
);

export const CardSkeleton: React.FC = () => (
  <div className="w-full p-4 border rounded-lg space-y-4 animate-pulse">
    <TextSkeleton width="3/4" />
    <div className="space-y-2">
      <TextSkeleton width="full" />
      <TextSkeleton width="5/6" />
    </div>
    <div className="flex justify-between items-center pt-2">
      <div className="h-8 w-24 bg-gray-300 rounded" />
      <div className="h-8 w-8 bg-gray-300 rounded-full" />
    </div>
  </div>
);

export const AvatarWithTextSkeleton: React.FC = () => (
  <div className="flex items-center gap-2 animate-pulse">
    <div className="h-10 w-10 bg-gray-300 rounded-full" />
    <div className="space-y-1">
      <TextSkeleton width="24" />
      <TextSkeleton width="32" height="3" />
    </div>
  </div>
); 