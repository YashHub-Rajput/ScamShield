// ─── Rule Engine — Layer 1 of ScamShield Detection ───────────────────────────
// This is our own scam detection logic, independent of AI

export interface RuleEngineResult {
  flaggedRules: FlaggedRule[];
  ruleScore: number;
  detectedURLs: string[];
  hasURLs: boolean;
}

export interface FlaggedRule {
  category: string;
  matches: string[];
  severity: "high" | "medium" | "low";
}

// ─── Rule Definitions ─────────────────────────────────────────────────────────

const RULES = {
  urgency: {
    category: "Urgency Tactics",
    severity: "high" as const,
    patterns: [
      "act now", "acting now", "limited time", "expires soon",
      "immediately", "urgent", "asap", "last chance",
      "don't wait", "hurry", "today only", "within 24 hours",
      "final notice", "expiring", "deadline",
    ],
  },
  prize: {
    category: "Prize or Reward Claim",
    severity: "high" as const,
    patterns: [
      "you've won", "you have won", "winner", "congratulations",
      "prize", "lottery", "gift card", "free gift", "claim your",
      "selected", "chosen", "lucky winner", "reward",
      "cash prize", "jackpot",
    ],
  },
  credentials: {
    category: "Personal Information Request",
    severity: "high" as const,
    patterns: [
      "password", "bank account", "credit card", "debit card",
      "otp", "pin number", "social security", "aadhar",
      "pan card", "date of birth", "mother's maiden",
      "security question", "cvv", "account number",
    ],
  },
  threats: {
    category: "Threats or Fear Tactics",
    severity: "high" as const,
    patterns: [
      "suspended", "blocked", "terminated", "legal action",
      "arrested", "police", "court", "penalty", "fine",
      "account closed", "unauthorized access", "hacked",
      "virus detected", "immediate action required",
    ],
  },
  financial: {
    category: "Suspicious Financial Request",
    severity: "high" as const,
    patterns: [
      "send money", "wire transfer", "western union",
      "bitcoin", "crypto", "gift card payment",
      "advance fee", "processing fee", "insurance fee",
      "transfer fee", "upfront payment", "invest now",
    ],
  },
  impersonation: {
    category: "Possible Impersonation",
    severity: "medium" as const,
    patterns: [
      "amazon", "paypal", "google", "microsoft", "apple",
      "netflix", "bank of", "rbi", "income tax", "irs",
      "government", "police department", "customs",
      "whatsapp team", "facebook security",
    ],
  },
  suspicious_links: {
    category: "Suspicious URL Patterns",
    severity: "medium" as const,
    patterns: [
      ".xyz", ".tk", ".top", ".club", ".work",
      "bit.ly", "tinyurl", "shorturl", "click here",
      "verify now", "login here", "confirm here",
    ],
  },
};

// ─── URL Extractor ────────────────────────────────────────────────────────────

export function extractURLs(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s]+|www\.[^\s]+/gi;
  return text.match(urlRegex) || [];
}

// ─── Main Rule Engine Function ────────────────────────────────────────────────

export function runRuleEngine(text: string): RuleEngineResult {
  const lowerText = text.toLowerCase();
  const flaggedRules: FlaggedRule[] = [];
  let ruleScore = 0;

  // Check each rule category
  for (const rule of Object.values(RULES)) {
    const matches = rule.patterns.filter((pattern) =>
      lowerText.includes(pattern.toLowerCase())
    );

    if (matches.length > 0) {
      flaggedRules.push({
        category: rule.category,
        matches,
        severity: rule.severity,
      });

      /// Add to score based on severity
      const severityPoints =
        rule.severity === "high" ? 15 :
        rule.severity === "medium" ? 8 : 3;
      ruleScore += matches.length * severityPoints;
    }
  }

  // Extract URLs from the message
  const detectedURLs = extractURLs(text);

  // Cap rule score at 80 — AI gets final say
  ruleScore = Math.min(80, ruleScore);

  return {
    flaggedRules,
    ruleScore,
    detectedURLs,
    hasURLs: detectedURLs.length > 0,
  };
}

// ─── Summary Generator ────────────────────────────────────────────────────────

export function getRuleEngineSummary(result: RuleEngineResult): string {
  if (result.flaggedRules.length === 0) {
    return "No suspicious patterns detected by rule engine.";
  }

  const categories = result.flaggedRules.map((r) => r.category).join(", ");
  return `Rule engine flagged: ${categories}.`;
}