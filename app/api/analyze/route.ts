import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "No text provided" },
        { status: 400 }
      );
    }

    const prompt = `You are ScamShield, an expert scam detection AI. Analyze the following message carefully.

Message to analyze:
"${text}"

Respond with ONLY a valid JSON object in exactly this format, no other text before or after:
{
  "score": <number 0-100>,
  "verdict": "<High Risk or Moderate Risk or Low Risk>",
  "reasons": ["<specific reason 1>", "<specific reason 2>", "<specific reason 3>"],
  "explanation": "<2-3 sentences explaining the risk in simple English>"
}

Scoring rules:
- 70 to 100 = High Risk
- 35 to 69 = Moderate Risk
- 0 to 34 = Low Risk

Be specific — mention exact phrases from the message in your reasons.`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are a scam detection expert. You always respond with only valid JSON, no markdown, no code blocks, no extra text.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.1,
          max_tokens: 500,
        }),
      }
    );

    const data = await response.json();

    console.log("Groq response:", JSON.stringify(data));

    // Check for API errors
    if (!response.ok || data.error) {
      console.error("Groq API error:", data);
      return NextResponse.json(
        { error: data.error?.message || "AI service error. Please try again." },
        { status: 500 }
      );
    }

    // Extract the text response
    const rawText = data.choices?.[0]?.message?.content || "";

    console.log("Raw text:", rawText);

    // Clean and extract JSON
    const cleaned = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in response:", cleaned);
      return NextResponse.json(
        { error: "Could not parse AI response. Please try again." },
        { status: 500 }
      );
    }

    const result = JSON.parse(jsonMatch[0]);

    // Validate all required fields exist
    if (
      typeof result.score !== "number" ||
      !result.verdict ||
      !Array.isArray(result.reasons) ||
      !result.explanation
    ) {
      console.error("Invalid result structure:", result);
      return NextResponse.json(
        { error: "Invalid AI response format. Please try again." },
        { status: 500 }
      );
    }

    // Make sure score is within bounds
    result.score = Math.min(100, Math.max(0, Math.round(result.score)));

    return NextResponse.json(result);

  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}