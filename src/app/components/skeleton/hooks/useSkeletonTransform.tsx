import React, { useState, useEffect } from 'react';
import parse, { DOMNode, Element, Text, HTMLReactParserOptions, domToReact } from 'html-react-parser';
import { getElementDimensions, isBlockElement, isInlineElement } from '../transformers/elementTransformers';
import {
  TextSkeleton,
  InlineElementSkeleton,
  BlockElementSkeleton,
  NavSkeleton,
  CardSkeleton,
  AvatarWithTextSkeleton,
  TableSkeleton,
} from '../components/SkeletonElements';

export const useSkeletonTransform = (reactComponent: string) => {
  const [skeleton, setSkeleton] = useState<React.ReactNode>(null);
  const [error, setError] = useState<string>("");

  const transformNode = (node: DOMNode, index: number): React.ReactNode => {
    // Handle text nodes
    if ((node as Text).type === "text") {
      const textNode = node as Text;
      if (textNode.data && textNode.data.trim()) {
        return <TextSkeleton key={`text-${index}`} />;
      }
      return;
    }

    const element = node as Element;
    if (element.type === "tag") {
      const children = element.children
        ? domToReact(element.children as DOMNode[], {
            replace: (node, i) => transformNode(node, i),
          } as HTMLReactParserOptions)
        : null;

      // Handle special cases
      if (element.name === "nav") {
        return <NavSkeleton key={`nav-${index}`} />;
      }

      if (element.name === "table") {
        // For tables, we'll use a fixed number of columns based on common use cases
        return <TableSkeleton key={`table-${index}`} columns={8} rows={5} />;
      }

      if (element.name === "div" && element.attribs?.className?.includes("card")) {
        return <CardSkeleton key={`card-${index}`} />;
      }

      if (element.name === "div" && element.attribs?.className?.includes("flex items-center")) {
        return <AvatarWithTextSkeleton key={`avatar-${index}`} />;
      }

      // Handle form elements
      if (element.name === "input" || element.name === "textarea" || element.name === "select") {
        const height = element.name === "textarea" ? "24" : "10";
        return <TextSkeleton key={`form-${index}`} height={height} width="full" />;
      }

      // Handle generic elements
      const { width, height } = getElementDimensions(element);

      if (isInlineElement(element.name)) {
        return <InlineElementSkeleton key={`inline-${index}`} width={width} height={height} />;
      }

      if (isBlockElement(element.name)) {
        return (
          <BlockElementSkeleton key={`block-${index}`} height={height}>
            {children}
          </BlockElementSkeleton>
        );
      }

      // Default fallback
      return (
        <BlockElementSkeleton key={`element-${index}`}>
          {children}
        </BlockElementSkeleton>
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
        setError("");
      } catch (error) {
        console.error("Error parsing component:", error);
        setError("Failed to parse component structure");
      }
    } else {
      setSkeleton(null);
      setError("");
    }
  }, [reactComponent]);

  return { skeleton, error };
}; 