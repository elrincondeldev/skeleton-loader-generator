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

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 8 
}) => (
  <div className="w-full overflow-x-auto animate-pulse">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {[...Array(columns)].map((_, i) => (
            <th key={`th-${i}`} className="py-3 px-4 text-left">
              <div className="h-4 w-24 bg-gray-300 rounded" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {[...Array(rows)].map((_, rowIndex) => (
          <tr key={`row-${rowIndex}`} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            {[...Array(columns)].map((_, colIndex) => (
              <td key={`cell-${rowIndex}-${colIndex}`} className="py-3 px-4 whitespace-nowrap">
                <div className={`h-4 ${colIndex === columns - 1 ? 'w-32' : 'w-20'} bg-gray-300 rounded`} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
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