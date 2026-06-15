export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { extractText } from 'unpdf';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('resume') as File | null;
    const jobDescription = formData.get('jobDescription') as string | null;

    if (!file || !jobDescription) {
      return NextResponse.json({ error: 'Missing resume or job description' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const { text: pages } = await extractText(new Uint8Array(arrayBuffer), { mergePages: true });
    const resumeText = pages as unknown as string;

    const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze the resume against the job description and return a JSON object ONLY. Do not wrap it in markdown code fences. Do not add any explanation before or after. Output raw JSON only.

Resume:
${resumeText}

Job Description:
${jobDescription}

Return this exact JSON structure:
{
  "score": <number 0-100>,
  "summary": "<one sentence summary of the match>",
  "matchedKeywords": ["<keyword>", ...],
  "missingKeywords": ["<keyword>", ...],
  "sectionScores": {
    "skills": <number 0-100>,
    "experience": <number 0-100>,
    "projects": <number 0-100>
  },
  "suggestions": [
    {
      "original": "<original bullet from resume>",
      "rewritten": "<improved version targeting the JD>",
      "reason": "<one sentence explanation>"
    }
  ]
}

Rules:
- matchedKeywords: important keywords from the JD that appear in the resume (max 12)
- missingKeywords: important keywords from the JD missing from the resume (max 12)
- suggestions: pick 3-5 resume bullets that could be improved to better match the JD
- score should reflect overall ATS compatibility`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const raw = content.text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const result = JSON.parse(raw);
    return NextResponse.json(result);
  } catch (err) {
    console.error('Analysis error:', err);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
