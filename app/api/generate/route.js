import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const TONE_INSTRUCTIONS = {
  professional: "Be polished, formal, and business-appropriate. Maintain a respectful, authoritative tone.",
  friendly: "Be warm, approachable, and conversational. Sound like a friendly neighbor, not a corporation.",
  apologetic: "Lead with empathy and a genuine apology where appropriate. Be humble and solution-focused.",
  enthusiastic: "Be upbeat, energetic, and positive. Use exclamation points sparingly but show genuine excitement.",
};

export async function POST(req) {
  try {
    const { bizName, bizType, stars, reviewText, tone = "professional" } = await req.json();

    if (!reviewText?.trim()) {
      return Response.json({ error: "Review text is required" }, { status: 400 });
    }

    const toneInstruction = TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS.professional;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `You are a professional reputation manager writing Google review responses for a ${bizType} called "${bizName || "our business"}".

Tone: ${toneInstruction}

The customer gave ${stars} stars and wrote:
"${reviewText}"

Write a single response following the tone above.
- Keep it 60-100 words
- Address specific points they mentioned
- For 1-2 stars: apologize sincerely, offer to make it right, invite them to contact you
- For 3 stars: acknowledge feedback, highlight positives, invite them back
- For 4-5 stars: express genuine gratitude, be specific, invite them back
- Sound human, not robotic
- Do NOT say "We value your feedback" or similar clichés

Reply with the response text ONLY, nothing else.`,
        },
      ],
    });

    return Response.json({ response: message.content[0].text });
  } catch (error) {
    console.error("Anthropic API error:", error);
    return Response.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
