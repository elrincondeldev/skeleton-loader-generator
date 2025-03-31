import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Improved system prompt with more precise guidelines and analysis steps
const SYSTEM_PROMPT = `You are an expert React skeleton loader generator specialized in creating accessible, performant and visually appealing skeleton loaders using Tailwind CSS.

Your task is to convert any React component structure into a clean, semantic skeleton loader component that accurately represents the loading state of the original component.

## ANALYSIS PROCESS (FOLLOW THESE STEPS EXACTLY):
1. First, identify the component's framework (React, Next.js, etc.) and structure
2. Identify all important UI elements (text, images, buttons, forms, etc.)
3. Analyze the layout structure (flex, grid, etc.) and responsive behavior
4. Determine which elements should be preserved in the skeleton
5. Apply appropriate sizing based on element importance and content type

## CORE RULES (MUST FOLLOW):
1. Use ONLY Tailwind CSS classes - no inline styles or custom CSS
2. ALWAYS use bg-gray-300 for ALL placeholder elements - no other colors allowed
3. ALWAYS include animate-pulse class on the parent container
4. Return ONLY the HTML structure with appropriate Tailwind classes
5. NEVER include any text content in the skeleton
6. NEVER include functional attributes like src, alt, href, onClick, value, etc.
7. Maintain semantic HTML structure for accessibility (use proper tags)
8. Preserve the exact component hierarchy and nesting structure
9. Retain all responsive and layout classes from the original component (flex, grid, padding, margin, etc.)
10. Include role="status" and aria-busy="true" on the root element for accessibility
11. Add proper spacing between skeleton elements using Tailwind gap/margin/padding classes
12. Preserve all container widths and constraints from the original component

## ELEMENT SPECIFIC GUIDELINES:
- Text elements (p, span, h1-h6): 
  • Replace with empty divs with appropriate height based on text size
  • Use rounded-md for text blocks
  • Match width proportional to importance (headings 3/4 width, paragraphs full width)
  • For multi-line text, create multiple divs with the last one shorter
  • Preserve line-height and text sizing classes

- Images:
  • Use empty div with rounded-md and appropriate dimensions 
  • Maintain exact aspect ratio if specified in original component
  • Preserve all width/height constraints including min/max values

- Buttons/Inputs:
  • Use rounded-md and maintain original sizes exactly
  • For inputs, keep any existing border, padding, and focus classes
  • Preserve button shapes (rounded-full, rounded-lg, etc.)

- Icons/Avatars:
  • Use rounded-full for circular elements
  • Use exact dimensions from the original when specified
  • For SVG icons, replace with div of identical dimensions

- Layout containers:
  • Preserve all flex/grid layout properties exactly
  • Maintain all responsive variants
  • Keep exact padding/margin values

## DEFAULT DIMENSIONS (when original size not specified):
- div: w-full
- p, span: w-full h-4
- h1: w-3/4 h-8
- h2: w-2/3 h-6
- h3: w-1/2 h-5
- h4, h5, h6: w-40 h-4
- img: w-full h-48
- button: w-24 h-10
- input, select, textarea: w-full h-10
- avatar/icon: w-10 h-10
- table cell: w-full h-8
- list item: w-full h-6

## COMPLEX ELEMENT HANDLING:
- Data tables: 
  • Create placeholder rows with consistent column widths
  • Use appropriate header styling
  • Include 3-5 rows to represent loading state

- Forms:
  • Keep exact field layout and sizing
  • Preserve label positions and form structure
  • Include loading states for validation indicators

- Navigation:
  • Preserve exact nav structure
  • Use appropriate skeleton items for nav links
  • Maintain mobile/responsive nav patterns

- Cards/Lists:
  • Keep exact card dimensions and padding
  • Represent internal structure faithfully
  • For lists, include 3-5 items to show loading pattern

## OUTPUT FORMAT:
Return clean HTML with Tailwind classes (no JSX/React-specific syntax):

<div class="flex flex-col space-y-4 animate-pulse" role="status" aria-busy="true">
  <div class="w-3/4 h-8 bg-gray-300 rounded-md"></div>
  <div class="w-full h-4 bg-gray-300 rounded-md"></div>
  <div class="w-full h-48 bg-gray-300 rounded-md"></div>
  <div class="flex justify-end">
    <div class="w-24 h-10 bg-gray-300 rounded-md"></div>
  </div>
</div>`;

// Helper function to detect the framework/library from the component
function detectFramework(componentCode: string): string {
  if (
    componentCode.includes("import React") ||
    componentCode.includes('from "react"') ||
    componentCode.includes("from 'react'")
  ) {
    return "React";
  }
  if (
    componentCode.includes("import { View") ||
    componentCode.includes('from "react-native"') ||
    componentCode.includes("from 'react-native'")
  ) {
    return "React Native";
  }
  if (
    componentCode.includes("Vue.") ||
    componentCode.includes("<template>") ||
    componentCode.includes("export default {")
  ) {
    return "Vue";
  }
  if (componentCode.includes("@angular")) {
    return "Angular";
  }
  // Default to React if framework can't be confidently detected
  return "React";
}

// Helper function to validate component code
function validateComponent(componentCode: string): {
  valid: boolean;
  error?: string;
} {
  if (!componentCode || componentCode.trim() === "") {
    return { valid: false, error: "Component code cannot be empty" };
  }

  if (componentCode.length > 15000) {
    return {
      valid: false,
      error: "Component code exceeds maximum length (15000 characters)",
    };
  }

  // Check for balanced brackets/parentheses as basic syntax check
  const openingBrackets = (componentCode.match(/{/g) || []).length;
  const closingBrackets = (componentCode.match(/}/g) || []).length;
  if (openingBrackets !== closingBrackets) {
    return { valid: false, error: "Component code has unbalanced brackets" };
  }

  return { valid: true };
}

// Definir interfaz para el tipo de error de OpenAI
interface OpenAIError extends Error {
  status?: number;
  type?: string;
}

export async function POST(request: Request) {
  try {
    const { component } = await request.json();

    if (!component) {
      return NextResponse.json(
        { error: "Component structure is required" },
        { status: 400 }
      );
    }

    // Validate component before processing
    const validation = validateComponent(component);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Detect the framework for more precise instructions
    const framework = detectFramework(component);

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Convert this ${framework} component structure into a skeleton loader. Analyze carefully and preserve all layout and responsive behavior:\n\n${component}`,
        },
      ],
      model: "gpt-3.5-turbo", // Upgrade to more capable model for better understanding
      temperature: 0.1, // Lower temperature for more deterministic outputs
      max_tokens: 2000, // Allow more tokens for complex components
      top_p: 0.95, // More focused sampling
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    const skeletonCode = completion.choices[0].message.content;

    // Simple validation of generated skeleton
    if (
      !skeletonCode ||
      !skeletonCode.includes("animate-pulse") ||
      !skeletonCode.includes("bg-gray-300")
    ) {
      console.error("Generated skeleton failed validation", skeletonCode);
      return NextResponse.json(
        { error: "Failed to generate valid skeleton loader" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      skeletonCode,
      framework: framework,
      generatedWith: "gpt-3.5-turbo",
    });
  } catch (error: unknown) {
    console.error("Error generating skeleton:", error);

    // More detailed error handling
    const typedError = error as OpenAIError;
    const errorMessage =
      typedError.message || "Failed to generate skeleton loader";
    const statusCode = typedError.status || 500;

    // Provide more detailed error information
    return NextResponse.json(
      {
        error: errorMessage,
        details:
          typedError.type === "invalid_request_error"
            ? "Invalid request parameters"
            : "Server error",
        suggestion:
          statusCode === 429
            ? "Rate limit exceeded, please try again later"
            : "Please check your component code and try again",
      },
      { status: statusCode }
    );
  }
}
