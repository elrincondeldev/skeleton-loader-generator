import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a React skeleton loader generator. Your task is to convert React component structures into skeleton loader components using Tailwind CSS.

Rules for generating skeleton loaders:
1. Always use Tailwind CSS classes
2. Use bg-gray-300 for placeholder backgrounds
3. Use animate-pulse for loading animation
4. Maintain proper spacing and sizing relative to the original component
5. Return ONLY the code, no explanations or markdown
6. Use self-closing tags when possible (/>)
7. Ensure proper indentation
8. Include className="animate-pulse" in the root div
9. Apply default dimensions for elements without specified width:
   - div: w-full by default
   - p (paragraphs): w-full and h-4 by default
   - h1: w-3/4 and h-8 by default
   - h2: w-2/3 and h-6 by default
   - h3: w-1/2 and h-5 by default
   - img: w-full and h-48 by default
   - button: w-24 and h-10 by default
   - input: w-full and h-10 by default
10. Maintain responsive behavior using Tailwind's responsive classes when original component has them`;

export async function POST(request: Request) {
  try {
    const { component } = await request.json();

    if (!component) {
      return NextResponse.json(
        { error: 'Component structure is required' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Convert this React component structure into a skeleton loader:\n\n${component}` }
      ],
      model: "gpt-3.5-turbo",
    });

    const skeletonCode = completion.choices[0].message.content;

    return NextResponse.json({ skeletonCode });
  } catch (error) {
    console.error('Error generating skeleton:', error);
    return NextResponse.json(
      { error: 'Failed to generate skeleton loader' },
      { status: 500 }
    );
  }
} 