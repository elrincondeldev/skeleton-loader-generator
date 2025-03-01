import React from 'react';
import { useSkeletonStore } from '@/app/store/skeletonStore';
import { useSkeletonTransform } from '../hooks/useSkeletonTransform';

export const SkeletonPreview: React.FC = () => {
  const { reactComponent } = useSkeletonStore();
  const { skeleton } = useSkeletonTransform(reactComponent);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
        Skeleton Preview
      </h2>
      <div className="w-full h-[300px] sm:h-[400px] border-2 border-gray-300 rounded-lg p-3 sm:p-4 overflow-auto bg-white">
        {skeleton || (
          <div className="text-gray-500 text-center mt-8">
            Your skeleton preview will appear here
          </div>
        )}
      </div>
    </div>
  );
}; 