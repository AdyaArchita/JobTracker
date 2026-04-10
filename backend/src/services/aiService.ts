import OpenAI from 'openai';
import { env } from '../config/env';
import { ParsedJD, AIParseResponse } from '../types';

/**
 * @file aiService.ts
 * Core AI orchestration logic for job description parsing and resume generation.
 * Supports both OpenAI and OpenRouter via standardized GPT-4o integration.
 */

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
  baseURL: env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1',
});

// Use mock mode if API credentials are not effectively configured
const isMockMode =
  !env.OPENAI_API_KEY ||
  env.OPENAI_API_KEY === 'sk-your-openai-api-key-here' ||
  env.OPENAI_API_KEY.includes('change-me');

const MOCK_DELAY = 1500;

const MOCK_PARSED: ParsedJD = {
  company: 'MockTech Solutions',
  role: 'Senior Full Stack Engineer',
  skills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Tailwind CSS'],
  niceToHaveSkills: ['AWS', 'Docker', 'GraphQL', 'Next.js'],
  seniorityLevel: 'Senior',
  location: 'Remote',
  jobType: 'Full-time',
};

const MOCK_BULLETS = [
  'Engineered a scalable microservices architecture using Node.js and Express, supporting 50K+ daily active users with 99.9% uptime.',
  'Led the full-stack adoption of React and TypeScript across 3 core products, eliminating 40% of runtime type errors and accelerating developer velocity by 25%.',
  'Optimized complex MongoDB aggregation pipelines, dropping average query execution time from 1.2s to under 150ms for the reporting dashboard.',
  'Integrated real-time streaming AI features via REST and SSE, enabling predictive analytics that increased user engagement by 18%.',
];

const MOCK_MATCH = {
  matchScore: 94,
  coverLetterSnippet: "Given my proven track record in architecting highly available Node.js backends and driving TypeScript adoptions that cut runtime errors by 40%, I am uniquely positioned to accelerate your core platform's scaling roadmap.",
  matchReason: "Your extensive background in distributed Node.js systems, MongoDB optimization, and modern React heavily aligns with their immediate requirement for a Senior Engineer capable of owning full-stack performance.",
};

const PARSE_JD_SYSTEM_PROMPT = `You are an expert job description parser. Given a job description text, extract the following information and return it as a JSON object. Be precise and thorough.

Return ONLY a valid JSON object with this exact structure:
{
  "company": "Company name (string)",
  "role": "Job title/role (string)",
  "jobType": "Full-time/Part-time/Contract/Internship/Freelance (string)",
  "skills": ["Required skill 1", "Required skill 2", ...],
  "niceToHaveSkills": ["Nice-to-have skill 1", "Nice-to-have skill 2", ...],
  "seniorityLevel": "Entry/Mid/Senior/Lead/Staff/Principal (string)",
  "location": "On-site/Remote/Hybrid (string)"
}

Rules:
- If information is not found, use empty string for strings and empty array for arrays
- For jobType, choose from: Full-time, Part-time, Contract, Internship, Freelance
- For location, choose from: On-site, Remote, Hybrid
- For skills, separate them into truly required vs nice-to-have based on the JD language
- For seniority level, infer from the title and requirements if not explicitly stated
- Be accurate — do not fabricate information not present in the JD. Even for very brief or "one-liner" inputs, always return a valid JSON object with whatever info you can find.`;

const RESUME_BULLETS_SYSTEM_PROMPT = `You are an expert resume writer and career coach. Given a parsed job description and a candidate's background, generate:
1. 3 to 5 specific, tailored resume bullet points highlighting relevant experience.
2. A match score (0-100) indicating how well the candidate fits the role.
3. A one-sentence tailored cover letter snippet.
4. A short sentence explaining why this role fits the candidate ("matchReason").

Candidate Profile Context: "Software Engineer with 3 years of experience in MERN stack, TypeScript, React, Node.js, and Tailwind CSS. Previously built a complex real-time task manager and a high-performance AI job tracker. Passionate about sleek UI/UX and scalable backends."

Return ONLY a valid JSON object with this exact structure:
{
  "bullets": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
  "matchScore": 85,
  "coverLetterSnippet": "A compelling one-sentence hook...",
  "matchReason": "A brief explanation of why the candidate is a good fit..."
}

Rules for bullets:
- Keep them 1-2 lines long
- Start with strong action verbs
- Include specific quantifiable metrics
- Tailor directly to JD requirements`;

const RESUME_BULLETS_STREAM_PROMPT = `You are an expert resume writer and career coach. Given a parsed job description, generate 4 to 5 specific, tailored resume bullet points for this exact role.

Rules:
- Each bullet should start with a strong action verb
- Include specific, quantifiable metrics where appropriate
- Tailor each bullet directly to the required skills and responsibilities
- Make bullets specific to this role, NOT generic career advice
- Output each bullet point on its own line prefixed with "• "
- Do NOT number them, just use the bullet character
- Generate 4 to 5 bullet points`;

/**
 * Orchestrates job description parsing into a structured format.
 * Maps raw text to standardized job categories (LocationType, JobType, etc.).
 */
export async function parseJobDescription(jdText: string): Promise<ParsedJD> {
  if (isMockMode) {
    console.log('AI Service: Using Mock Mode (No API Key found)');
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
    return MOCK_PARSED;
  }
  try {
    const response = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [
        { role: 'system', content: PARSE_JD_SYSTEM_PROMPT },
        { role: 'user', content: jdText },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('OpenAI returned an empty response');
    }

    const parsed: ParsedJD = JSON.parse(content);

    return {
      company: parsed.company || '',
      role: parsed.role || '',
      jobType: parsed.jobType || 'Full-time',
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      niceToHaveSkills: Array.isArray(parsed.niceToHaveSkills)
        ? parsed.niceToHaveSkills
        : [],
      seniorityLevel: parsed.seniorityLevel || '',
      location: parsed.location || 'Remote',
    };
  } catch (error: any) {
    console.error('❌ AI Service Error:', {
      message: error.message,
      provider: env.OPENAI_API_BASE_URL?.includes('openrouter') ? 'OpenRouter' : 'OpenAI',
      status: error.status,
      details: error.response?.data || error.error || 'No additional details'
    });
    
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse AI response as JSON');
    }
    throw error;
  }
}

/**
 * Interface for AI resume components
 */
interface AIResumeOutput {
  bullets: string[];
  matchScore: number;
  coverLetterSnippet: string;
  matchReason: string;
}

/**
 * Generate tailored resume bullet points, match score, and insights.
 */
export async function generateResumeBullets(
  parsedJD: ParsedJD
): Promise<AIResumeOutput> {
  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
    return {
      bullets: MOCK_BULLETS,
      matchScore: MOCK_MATCH.matchScore,
      coverLetterSnippet: MOCK_MATCH.coverLetterSnippet,
      matchReason: MOCK_MATCH.matchReason,
    };
  }
  try {
    const userPrompt = `Generate tailored insights for this role:

Company: ${parsedJD.company}
Role: ${parsedJD.role}
Required Skills: ${parsedJD.skills.join(', ')}
Nice-to-Have Skills: ${parsedJD.niceToHaveSkills.join(', ')}
Seniority Level: ${parsedJD.seniorityLevel}
Location: ${parsedJD.location}`;

    const response = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [
        { role: 'system', content: RESUME_BULLETS_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('OpenAI returned an empty response for resume bullets');
    }

    const result = JSON.parse(content);

    if (!Array.isArray(result.bullets) || result.bullets.length === 0) {
      throw new Error('AI did not return valid bullet points');
    }

    return {
      bullets: result.bullets.slice(0, 5),
      matchScore: typeof result.matchScore === 'number' ? result.matchScore : 0,
      coverLetterSnippet: result.coverLetterSnippet || '',
      matchReason: result.matchReason || '',
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse AI resume bullets response as JSON');
    }
    throw error;
  }
}

/**
 * Streams tailored resume bullet points via Server-Sent Events (SSE).
 * Optimized for real-time UI feedback by chunking generation into discrete points.
 */
export async function* streamResumeBullets(
  jdText: string
): AsyncGenerator<{ type: string; data: any }> {
  if (isMockMode) {
    for (const bullet of MOCK_BULLETS) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Stream delay
      yield { type: 'bullet', data: bullet };
    }
    return;
  }
  
  const parsed = await parseJobDescription(jdText);
  const userPrompt = `Generate tailored resume bullet points for this role:

Company: ${parsed.company}
Role: ${parsed.role}
Required Skills: ${parsed.skills.join(', ')}
Nice-to-Have Skills: ${parsed.niceToHaveSkills.join(', ')}
Seniority Level: ${parsed.seniorityLevel}
Location: ${parsed.location}`;

  const stream = await openai.chat.completions.create({
    model: 'openai/gpt-4o',
    messages: [
      { role: 'system', content: RESUME_BULLETS_STREAM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 1500,
    stream: true,
  });

  let currentBullet = '';

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (!content) continue;

    currentBullet += content;

    const lines = currentBullet.split('\n');
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();
      if (line.length > 0) {
        const cleaned = line.replace(/^[•\-\*]\s*/, '').trim();
        if (cleaned.length > 10) {
          yield { type: 'bullet', data: cleaned };
        }
      }
    }
    currentBullet = lines[lines.length - 1];
  }

  const lastLine = currentBullet.trim().replace(/^[•\-\*]\s*/, '').trim();
  if (lastLine.length > 10) {
    yield { type: 'bullet', data: lastLine };
  }
}

/**
 * Full-cycle AI analysis: Extracts JD data, matches candidate profile, 
 * and generates tailored resume bullet points in a single pass.
 */
export async function analyzeJDAndGenerateBullets(
  jdText: string
): Promise<AIParseResponse> {
  const parsed = await parseJobDescription(jdText);
  const resumeDetails = await generateResumeBullets(parsed);

  return {
    parsed,
    resumeBullets: resumeDetails.bullets,
    matchScore: resumeDetails.matchScore,
    coverLetterSnippet: resumeDetails.coverLetterSnippet,
    matchReason: resumeDetails.matchReason,
  };
}
