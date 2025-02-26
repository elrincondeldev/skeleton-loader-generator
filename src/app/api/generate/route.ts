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
8. Include className="animate-pulse" in the root div`;

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