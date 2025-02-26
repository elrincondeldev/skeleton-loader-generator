"use client";

import { useState, useEffect } from "react";
import parse, {
  domToReact,
  Element,
  HTMLReactParserOptions,
  DOMNode,
  Text,
} from "html-react-parser";
import Info from "./Info";

const SkeletonGenerator = () => {
  const [reactComponent, setReactComponent] = useState<string>("");
  const [skeleton, setSkeleton] = useState<React.ReactNode>(null);
  const [skeletonCode, setSkeletonCode] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const transformNode = (node: DOMNode, index: number) => {
    // Handle text nodes
    if ((node as Text).type === "text") {
      const textNode = node as Text;
      if (textNode.data && textNode.data.trim()) {
        return null;
      }
      return;
    }

    const element = node as Element;
    if (element.type === "tag") {
      const children = element.children
        ? domToReact(
            element.children as DOMNode[],
            { replace: transformNode } as HTMLReactParserOptions
          )
        : null;

      if (element.name === "p") {
        return (
          <div key={index} className="space-y-2">
            <div className="h-4 bg-gray-300 w-full rounded"></div>
            <div className="h-4 bg-gray-300 w-4/5 rounded"></div>
            <div className="h-4 bg-gray-300 w-11/12 rounded"></div>
          </div>
        );
      }

      if (element.name === "img") {
        const width = element.attribs?.width || "400";
        const height = element.attribs?.height || "300";
        return (
          <div
            key={index}
            className={`h-[${height}px] w-[${width}px] bg-gray-300 rounded`}
          />
        );
      }

      if (element.name === "h1") {
        return <div key={index} className="h-8 bg-gray-300 w-3/5 rounded" />;
      }

      if (element.name === "button") {
        return <div key={index} className="h-10 w-24 bg-gray-300 rounded" />;
      }

      return (
        <div key={index} className="animate-pulse space-y-4">
          {children}
        </div>
      );
    }

    return undefined;
  };

  useEffect(() => {
    if (reactComponent.trim()) {
      try {
        // Primero generamos el skeleton visual
        const skeletonReact = parse(reactComponent, {
          replace: transformNode,
        } as HTMLReactParserOptions);

        setSkeleton(skeletonReact);
      } catch (error) {
        console.error("Error parsing component:", error);
      }
    } else {
      setSkeleton(null);
    }
  }, [reactComponent]);

  const generateWithGPT = async () => {
    try {
      setIsGenerating(true);
      setError("");

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

      const skeletonReact = parse(data.skeletonCode, {
        replace: (node: DOMNode) => transformNode(node, 0) as Element | null,
      });
      setSkeleton(skeletonReact);
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate skeleton loader"
      );
    } finally {
      setIsGenerating(false);
    }
  };

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
    <main className="min-h-screen grid grid-rows-[auto_1fr] px-4 sm:px-8 md:px-12 lg:px-20 py-8 sm:py-12 lg:py-16 gap-8 sm:gap-12 lg:gap-16 font-[family-name:var(--font-geist-sans)]">
      <Info />
      <div className="flex flex-col gap-6 sm:gap-8 w-full max-w-7xl mx-auto">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
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
        </section>
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
                skeleton.tsx
              </span>
            </div>
            <pre className="p-3 sm:p-4 overflow-auto text-xs sm:text-sm font-mono whitespace-pre text-black">
              <code>
                {skeletonCode ||
                  "Your generated skeleton code will appear here"}
              </code>
            </pre>
          </div>
        </section>
      </div>
      
    </main>
  );
};

export default SkeletonGenerator;
