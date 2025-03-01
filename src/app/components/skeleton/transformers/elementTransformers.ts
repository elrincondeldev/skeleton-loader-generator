import { Element } from 'html-react-parser';

export interface ElementDimensions {
  width: string;
  height: string;
}

export const getElementDimensions = (element: Element): ElementDimensions => {
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

export const isInlineElement = (elementName: string): boolean => {
  const inlineElements = [
    "span",
    "a",
    "strong",
    "em",
    "b",
    "i",
    "code",
    "small",
  ];
  return inlineElements.includes(elementName);
};

export const isBlockElement = (elementName: string): boolean => {
  const blockElements = [
    "div",
    "section",
    "article",
    "main",
    "aside",
    "header",
    "footer",
    "form",
  ];
  return blockElements.includes(elementName);
}; 