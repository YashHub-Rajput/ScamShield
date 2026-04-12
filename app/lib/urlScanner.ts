// ─── URL Scanner — Layer 2 of ScamShield Detection ───────────────────────────
// Scans URLs against 70+ security databases via VirusTotal

export interface URLScanResult {
  url: string;
  isMalicious: boolean;
  threatScore: number;
  positives: number;
  total: number;
  categories: string[];
}

export interface URLScannerResult {
  scannedURLs: URLScanResult[];
  hasThreats: boolean;
  urlThreatScore: number;
}

// ─── Submit URL to VirusTotal ─────────────────────────────────────────────────

async function scanSingleURL(url: string): Promise<URLScanResult> {
  try {
    // Step 1 — Submit URL for scanning
    const submitResponse = await fetch(
      "https://www.virustotal.com/api/v3/urls",
      {
        method: "POST",
        headers: {
          "x-apikey": process.env.VIRUSTOTAL_API_KEY || "",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `url=${encodeURIComponent(url)}`,
      }
    );

    const submitData = await submitResponse.json();
    console.log("VT submit response:", JSON.stringify(submitData));

    // Get the analysis ID from submission
    const analysisId = submitData?.data?.id;
    if (!analysisId) {
      throw new Error("No analysis ID returned from VirusTotal");
    }

    // Step 2 — Get the analysis results
    const analysisResponse = await fetch(
      `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
      {
        headers: {
          "x-apikey": process.env.VIRUSTOTAL_API_KEY || "",
        },
      }
    );

    const analysisData = await analysisResponse.json();
    console.log("VT analysis response:", JSON.stringify(analysisData));

    const stats = analysisData?.data?.attributes?.stats || {};
    const positives = (stats.malicious || 0) + (stats.suspicious || 0);
    const total = Object.values(stats).reduce(
      (a: number, b) => a + (b as number),
      0
    );

    const categories = [];
    if (stats.malicious > 0) categories.push("Malicious");
    if (stats.suspicious > 0) categories.push("Suspicious");
    if (stats.phishing > 0) categories.push("Phishing");

    const threatScore = total > 0 ? Math.round((positives / total) * 100) : 0;

    return {
      url,
      isMalicious: positives > 2,
      threatScore,
      positives,
      total,
      categories,
    };
  } catch (error) {
    console.error(`Error scanning URL ${url}:`, error);
    return {
      url,
      isMalicious: false,
      threatScore: 0,
      positives: 0,
      total: 0,
      categories: [],
    };
  }
}

// ─── Main URL Scanner Function ────────────────────────────────────────────────

export async function runURLScanner(urls: string[]): Promise<URLScannerResult> {
  if (urls.length === 0) {
    return {
      scannedURLs: [],
      hasThreats: false,
      urlThreatScore: 0,
    };
  }

  // Only scan first 2 URLs to stay within free tier limits
  const urlsToScan = urls.slice(0, 2);
  const scannedURLs = await Promise.all(
    urlsToScan.map((url) => scanSingleURL(url))
  );

  const hasThreats = scannedURLs.some((r) => r.isMalicious);
  const maxThreatScore = Math.max(...scannedURLs.map((r) => r.threatScore), 0);

  return {
    scannedURLs,
    hasThreats,
    urlThreatScore: maxThreatScore,
  };
}