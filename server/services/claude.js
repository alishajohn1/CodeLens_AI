const Groq = require("groq-sdk");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const reviewCode = async (code, language) => {
  const prompt = `You are an expert code reviewer. Review the following ${language} code and provide structured feedback.

Return your response in this exact JSON format:
{
  "score": <number 1-100>,
  "summary": "<one sentence overall assessment>",
  "issues": [
    { "type": "bug|performance|security|style", "severity": "high|medium|low", "line": "<line or range>", "message": "<clear explanation>", "fix": "<suggested fix>" }
  ],
  "strengths": ["<what the code does well>"],
  "improvedCode": "<the full improved version of the code>"
}

Code to review:
\`\`\`${language}
${code}
\`\`\`

Return ONLY valid JSON, no markdown, no extra text.`;

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const text = completion.choices[0].message.content;
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
};

module.exports = { reviewCode };