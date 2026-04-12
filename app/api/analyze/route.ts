import { NextRequest, NextResponse } from "next/server";
import { runRuleEngine, getRuleEngineSummary } from "../../lib/ruleEngine";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "No text provided" },
        { status: 400 }
      );
    }

    // ── Layer 1: Run our own Rule Engine first ──────────────────────────────
    const ruleResult = runRuleEngine(text);
    const ruleSummary = getRuleEngineSummary(ruleResult);

    console.log("Rule engine result:", ruleResult);

    // ── Layer 3: Send to Groq AI with rule context ──────────────────────────
    const prompt = `You are ScamShield, an expert scam detection AI.

Our rule engine (Layer 1) already analyzed this message and found:
- Rule Engine Score: ${ruleResult.ruleScore}/80
- ${ruleSummary}
- Flagged Categories: ${ruleResult.flaggedRules.map(r => r.category).join(", ") || "None"}
- URLs detected: ${ruleResult.detectedURLs.join(", ") || "None"}

Now analyze the full message with this context in mind:
"${text}"

Respond with ONLY a valid JSON object in exactly this format:
{
  "score": <final number 0-100 combining rule engine findings and your analysis>,
  "verdict": "<High Risk or Moderate Risk or Low Risk>",
  "reasons": ["<specific reason 1>", "<specific reason 2>", "<specific reason 3>"],
  "explanation": "<2-3 sentences explaining the risk in simple English for non-technical users>"
}

Scoring rules:
- 70 to 100 = High Risk
- 35 to 69 = Moderate Risk  
- 0 to 34 = Low Risk
- Consider the rule engine score heavily in your final score
- Be specific — mention exact phrases from the message`;

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
              content: "You are a scam detection expert. Always respond with only valid JSON, no markdown, no code blocks, no extra text.",
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

    if (!response.ok || data.error) {
      console.error("Groq API error:", data);
      return NextResponse.json(
        { error: data.error?.message || "AI service error. Please try again." },
        { status: 500 }
      );
    }

    const rawText = data.choices?.[0]?.message?.content || "";
    const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Could not parse AI response. Please try again." },
        { status: 500 }
      );
    }

    const result = JSON.parse(jsonMatch[0]);

    if (
      typeof result.score !== "number" ||
      !result.verdict ||
      !Array.isArray(result.reasons) ||
      !result.explanation
    ) {
      return NextResponse.json(
        { error: "Invalid AI response format. Please try again." },
        { status: 500 }
      );
    }

    result.score = Math.min(100, Math.max(0, Math.round(result.score)));

    // Return result with rule engine data included
    return NextResponse.json({
      ...result,
      ruleEngine: {
        score: ruleResult.ruleScore,
        flaggedCategories: ruleResult.flaggedRules.map((r) => r.category),
        detectedURLs: ruleResult.detectedURLs,
      },
    });

  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}