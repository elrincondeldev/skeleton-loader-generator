import React from 'react';
import { useSkeletonStore } from '@/app/store/skeletonStore';

export const GeneratedCode: React.FC = () => {
  const { skeletonCode, copySuccess, setCopySuccess } = useSkeletonStore();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(skeletonCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      alert("Failed to copy code to clipboard");
    }
  };

  return (
    <section className="w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
          Generated Code
        </h2>
        <button
          className={`w-full sm:w-auto px-4 py-2.5 sm:py-3 rounded-lg transition text-sm sm:text-base ${
            !skeletonCode
              ? "bg-gray-300 cursor-not-allowed"
              : copySuccess
              ? "bg-green-500 text-white"
              : "bg-purple-500 hover:bg-purple-600 text-white"
          }`}
          onClick={handleCopy}
          disabled={!skeletonCode}
        >
          {copySuccess ? "Copied!" : "Copy Code"}
        </button>
      </div>
      <div className="w-full border-2 border-gray-300 rounded-lg bg-gray-50">
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-gray-300 bg-gray-100">
          <span className="text-xs sm:text-sm text-gray-600 font-medium">
            Skeleton.tsx
          </span>
        </div>
        <pre className="p-3 sm:p-4 overflow-auto text-xs sm:text-sm font-mono whitespace-pre text-black">
          <code>
            {skeletonCode || "Your generated skeleton code will appear here"}
          </code>
        </pre>
      </div>
    </section>
  );
}; 