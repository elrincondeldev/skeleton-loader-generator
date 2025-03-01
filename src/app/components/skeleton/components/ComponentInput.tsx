import React from 'react';
import { useSkeletonStore } from '@/app/store/skeletonStore';

export const ComponentInput: React.FC = () => {
  const {
    reactComponent,
    isGenerating,
    error,
    setReactComponent,
    setIsGenerating,
    setError,
    setSkeletonCode
  } = useSkeletonStore();

  const generateWithGPT = async () => {
    try {
      setIsGenerating(true);
      setError('');

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ component: reactComponent }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate skeleton loader");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setSkeletonCode(data.skeletonCode);
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Failed to generate skeleton loader");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
        Your Component
      </h2>
      <textarea
        className="w-full h-[300px] sm:h-[400px] text-black border-2 border-gray-300 rounded-lg p-3 sm:p-4 font-mono text-sm resize-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
        value={reactComponent}
        onChange={(e) => setReactComponent(e.target.value)}
        placeholder={`Paste your React component here...

Example:
<div>
  <h1>Welcome to my app</h1>
  <img src='/avatar.png' width="400" height="300" />
  <p>This is some content that will generate multiple lines in the skeleton</p>
  <button>Click me</button>
</div>`}
      />
      <button
        className={`w-full px-4 py-2.5 sm:py-3 rounded-lg transition text-sm sm:text-base ${
          !reactComponent.trim()
            ? "bg-gray-300 cursor-not-allowed"
            : isGenerating
            ? "bg-purple-400 cursor-wait"
            : "bg-purple-500 hover:bg-purple-600 text-white"
        }`}
        onClick={generateWithGPT}
        disabled={!reactComponent.trim() || isGenerating}
      >
        {isGenerating ? "Generating..." : "Generate Skeleton Code"}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}; 