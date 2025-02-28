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

  const transformNode = (node: DOMNode, index: number): React.ReactNode => {
    // Handle text nodes
    if ((node as Text).type === "text") {
      const textNode = node as Text;
      if (textNode.data && textNode.data.trim()) {
        // Return a text placeholder for non-empty text nodes
        return (
          <div
            key={`text-${index}`}
            className="h-4 w-3/4 bg-gray-300 rounded"
          />
        );
      }
      return;
    }

    const element = node as Element;
    if (element.type === "tag") {
      const children = element.children
        ? domToReact(
            element.children as DOMNode[],
            {
              replace: (node, i) => transformNode(node, i),
            } as HTMLReactParserOptions
          )
        : null;

      // Get element dimensions from style or class
      const getElementDimensions = (element: Element) => {
        const style = element.attribs?.style || "";
        const className = element.attribs?.className || "";
        let width = "full";
        let height = "4";

        // Extract dimensions from inline style
        const widthMatch = style.match(/width:\s*(\d+)(px|%|rem|em)/);
        const heightMatch = style.match(/height:\s*(\d+)(px|%|rem|em)/);

        if (widthMatch) width = widthMatch[1];
        if (heightMatch) height = heightMatch[1];

        // Extract dimensions from className
        if (className.includes("w-")) {
          const widthClass = className.match(/w-(\d+|full|screen|auto)/);
          if (widthClass) width = widthClass[1];
        }
        if (className.includes("h-")) {
          const heightClass = className.match(/h-(\d+|full|screen|auto)/);
          if (heightClass) height = heightClass[1];
        }

        return { width, height };
      };

      // Handle navigation bars
      if (element.name === "nav") {
        return (
          <div
            key={`nav-${index}`}
            className="w-full flex items-center justify-between p-4 border-b border-gray-200"
          >
            <div className="h-8 w-32 bg-gray-300 rounded" />
            <div className="flex gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={`nav-item-${i}`}
                  className="h-4 w-20 bg-gray-300 rounded"
                />
              ))}
            </div>
            <div className="h-10 w-10 bg-gray-300 rounded-full" />
          </div>
        );
      }

      // Handle cards
      if (
        element.name === "div" &&
        element.attribs?.className?.includes("card")
      ) {
        return (
          <div
            key={`card-${index}`}
            className="w-full p-4 border rounded-lg space-y-4"
          >
            <div className="h-4 w-3/4 bg-gray-300 rounded" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-300 rounded" />
              <div className="h-4 w-5/6 bg-gray-300 rounded" />
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="h-8 w-24 bg-gray-300 rounded" />
              <div className="h-8 w-8 bg-gray-300 rounded-full" />
            </div>
          </div>
        );
      }

      // Handle form inputs
      if (element.name === "input" || element.name === "textarea") {
        const height = element.name === "textarea" ? "h-24" : "h-10";
        return (
          <div key={index} className={`${height} w-full bg-gray-300 rounded`} />
        );
      }

      // Handle select elements
      if (element.name === "select") {
        return <div key={index} className="h-10 w-full bg-gray-300 rounded" />;
      }

      // Handle lists
      if (element.name === "ul" || element.name === "ol") {
        return (
          <div key={`list-${index}`} className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={`list-item-${i}`} className="flex items-center gap-2">
                {element.name === "ol" && (
                  <div className="h-4 w-4 bg-gray-300 rounded-full" />
                )}
                <div className="h-4 w-full bg-gray-300 rounded" />
              </div>
            ))}
          </div>
        );
      }

      // Handle breadcrumbs
      if (
        (element.name === "div" || element.name === "nav") &&
        (element.attribs?.className?.includes("breadcrumb") ||
          element.attribs?.className?.includes("breadcrumbs") ||
          element.attribs?.role === "breadcrumb" ||
          element.attribs?.["aria-label"]?.includes("breadcrumb"))
      ) {
        return (
          <div
            key={`breadcrumb-${index}`}
            className="flex items-center gap-2 py-4"
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={`breadcrumb-item-${i}`}
                className="flex items-center gap-2"
              >
                <div className="h-4 w-20 bg-gray-300 rounded" />
                {i < 2 && (
                  <div className="h-4 w-4 bg-gray-300 opacity-50 flex items-center justify-center">
                    /
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      }

      // Handle table rows
      if (element.name === "tr") {
        return (
          <div
            key={`tr-${index}`}
            className="flex items-center w-full border-b border-gray-200 py-4"
          >
            {[...Array(8)].map((_, i) => (
              <div key={`td-${index}-${i}`} className="flex-1 px-4">
                <div className="h-4 bg-gray-300 rounded w-[85%]" />
              </div>
            ))}
          </div>
        );
      }

      // Handle table cells
      if (element.name === "td") {
        return (
          <div key={index} className="flex-1 px-4">
            <div className="h-4 bg-gray-300 rounded w-[85%]"></div>
          </div>
        );
      }

      // Handle paragraphs with different sizes
      if (element.name === "p") {
        const isSmall = element.attribs?.className?.includes("text-sm");
        const height = isSmall ? "h-3" : "h-4";
        return (
          <div key={index} className="space-y-2">
            <div className={`${height} bg-gray-300 w-full rounded`}></div>
            <div className={`${height} bg-gray-300 w-4/5 rounded`}></div>
            <div className={`${height} bg-gray-300 w-11/12 rounded`}></div>
          </div>
        );
      }

      // Handle images and avatars
      if (element.name === "img" || element.name === "Image") {
        const width = element.attribs?.width || "20";
        const height = element.attribs?.height || "20";
        const isAvatar = element.attribs?.className?.includes("rounded-full");
        return (
          <div
            key={index}
            className={`h-[${height}px] w-[${width}px] bg-gray-300 ${
              isAvatar ? "rounded-full" : "rounded"
            }`}
          />
        );
      }

      // Handle headings with different levels
      if (element.name.match(/^h[1-6]$/)) {
        const sizes = {
          h1: "h-8 w-3/5",
          h2: "h-7 w-1/2",
          h3: "h-6 w-2/5",
          h4: "h-5 w-1/3",
          h5: "h-4 w-1/4",
          h6: "h-4 w-1/5",
        };
        return (
          <div
            key={index}
            className={`${
              sizes[element.name as keyof typeof sizes]
            } bg-gray-300 rounded`}
          />
        );
      }

      // Handle buttons with variants
      if (element.name === "button") {
        const isSmall = element.attribs?.className?.includes("text-sm");
        const isLarge = element.attribs?.className?.includes("text-lg");
        const height = isSmall ? "h-8" : isLarge ? "h-12" : "h-10";
        const width = isSmall ? "w-20" : isLarge ? "w-32" : "w-24";
        return (
          <div
            key={index}
            className={`${height} ${width} bg-gray-300 rounded`}
          />
        );
      }

      // Handle badges and tags
      if (
        element.name === "span" &&
        (element.attribs?.className?.includes("badge") ||
          element.attribs?.className?.includes("tag") ||
          element.attribs?.className?.includes("rounded-md"))
      ) {
        return <div key={index} className="h-6 w-20 bg-gray-300 rounded-md" />;
      }

      // Handle flex containers with specific patterns
      if (element.name === "div") {
        // Avatar with text pattern
        if (element.attribs?.className?.includes("flex items-center")) {
          return (
            <div key={index} className="flex items-center gap-2">
              <div className="h-10 w-10 bg-gray-300 rounded-full" />
              <div className="space-y-1">
                <div className="h-4 w-24 bg-gray-300 rounded" />
                <div className="h-3 w-32 bg-gray-300 rounded" />
              </div>
            </div>
          );
        }
      }

      // Generic element handler for any unhandled elements
      const { width, height } = getElementDimensions(element);
      const isInlineElement = [
        "span",
        "a",
        "strong",
        "em",
        "b",
        "i",
        "code",
        "small",
      ].includes(element.name);

      const isBlockElement = [
        "div",
        "section",
        "article",
        "main",
        "aside",
        "header",
        "footer",
        "form",
      ].includes(element.name);

      // Handle inline elements
      if (isInlineElement) {
        return (
          <div
            key={`inline-${index}`}
            className={`inline-block h-4 bg-gray-300 rounded mx-1 ${
              width === "full" ? "w-20" : `w-${width}`
            }`}
          />
        );
      }

      // Handle block elements
      if (isBlockElement) {
        return (
          <div
            key={`block-${index}`}
            className={`w-full space-y-4 animate-pulse ${
              height !== "4" ? `h-${height}` : ""
            }`}
          >
            {children || <div className="h-4 w-3/4 bg-gray-300 rounded" />}
          </div>
        );
      }

      // Default fallback for any other elements
      return (
        <div key={`element-${index}`} className="animate-pulse space-y-4">
          {children || <div className="h-4 w-full bg-gray-300 rounded" />}
        </div>
      );
    }

    return undefined;
  };

  useEffect(() => {
    if (typeof window !== "undefined" && reactComponent.trim()) {
      try {
        const skeletonReact = parse(reactComponent, {
          replace: (node, i) => transformNode(node, i),
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
    <main className="min-h-screen grid grid-rows-[auto_1fr] pb-20 md:pb-0 sm:px-8 md:px-12 lg:px-20 gap-8 sm:gap-12 lg:gap-16 font-[family-name:var(--font-geist-sans)]">
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
                Skeleton.tsx
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
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div>
      </div>
    </main>
  );
};

export default SkeletonGenerator;
