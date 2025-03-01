import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a React skeleton loader generator. Your task is to convert React component structures into clean skeleton loader components using Tailwind CSS.

Rules for generating skeleton loaders:
1. Use ONLY Tailwind CSS classes
2. ALWAYS use bg-gray-300 for ALL placeholder elements - no other colors allowed
3. NEVER include any text content in the skeleton
4. ALWAYS include animate-pulse class in the root div
5. Return ONLY the component structure without quotes around className values
6. NEVER include src, alt, or other unnecessary attributes
7. Use self-closing tags when possible (no need for />)
8. Mandatory default dimensions for elements:
   - div: w-full
   - text blocks (p, span): w-full h-4
   - h1: w-3/4 h-8
   - h2: w-2/3 h-6
   - h3: w-1/2 h-5
   - img: w-full h-48
   - button: w-24 h-10
   - input: w-full h-10
   - avatar/icon: w-10 h-10
9. Preserve any responsive classes from the original component
10. Maintain original component structure and hierarchy
11. Use rounded-md for buttons and inputs
12. Use rounded-full for avatars/circles

Example output format:
<nav class="flex items-center justify-between animate-pulse">
  <div class="w-full h-10 bg-gray-300 rounded-md">
  <div class="w-10 h-10 bg-gray-300 rounded-full">
</nav>`;

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