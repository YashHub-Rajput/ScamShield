import { NextRequest, NextResponse } from "next/server";
import { runRuleEngine, getRuleEngineSummary } from "../../lib/ruleEngine";
import { runURLScanner } from "../../lib/urlScanner";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "No text provided" },
        { status: 400 }
      );
    }

    // ── Layer 1: Rule Engine ──────────────────────────────────────────────────
    const ruleResult = runRuleEngine(text);
    const ruleSummary = getRuleEngineSummary(ruleResult);
    console.log("Layer 1 - Rule engine:", ruleResult);

    // ── Layer 2: URL Scanner ──────────────────────────────────────────────────
    let urlScanResult = { scannedURLs: [], hasThreats: false, urlThreatScore: 0 };
    if (ruleResult.hasURLs) {
      console.log("Layer 2 - Scanning URLs:", ruleResult.detectedURLs);
      urlScanResult = await runURLScanner(ruleResult.detectedURLs);
      console.log("Layer 2 - URL scan result:", urlScanResult);
    }

    // ── Layer 3: Groq AI with full context ────────────────────────────────────
    const prompt = `You are ScamShield, an expert scam detection AI.

Our detection system already analyzed this message:

LAYER 1 - Rule Engine:
- Rule Score: ${ruleResult.ruleScore}/80
- ${ruleSummary}
- Flagged: ${ruleResult.flaggedRules.map((r) => r.category).join(", ") || "Nothing"}

LAYER 2 - URL Scanner:
- URLs found: ${ruleResult.detectedURLs.join(", ") || "None"}
- Threats detected: ${urlScanResult.hasThreats ? "YES - MALICIOUS URLs FOUND" : "No confirmed threats"}
- URL threat score: ${urlScanResult.urlThreatScore}%

Now analyze the full message with this context:
"${text}"

Respond with ONLY a valid JSON object:
{
  "score": <final number 0-100>,
  "verdict": "<High Risk or Moderate Risk or Low Risk>",
  "reasons": ["<reason 1>", "<reason 2>", "<reason 3>"],
  "explanation": "<2-3 sentences in simple English>"
}

Rules:
- 70 to 100 = High Risk
- 35 to 69 = Moderate Risk
- 0 to 34 = Low Risk
- If URL threats were found, score must be at least 80
- Consider all layer findings in your final score`;

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

    // Return everything including layer data
    return NextResponse.json({
      ...result,
      layers: {
        ruleEngine: {
          score: ruleResult.ruleScore,
          flaggedCategories: ruleResult.flaggedRules.map((r) => r.category),
          detectedURLs: ruleResult.detectedURLs,
        },
        urlScanner: {
          hasThreats: urlScanResult.hasThreats,
          threatScore: urlScanResult.urlThreatScore,
          scannedURLs: urlScanResult.scannedURLs.map((u) => ({
            url: u.url,
            isMalicious: u.isMalicious,
            positives: u.positives,
            total: u.total,
          })),
        },
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