import { NextResponse } from "next/server";

/**
 * POST /api/ai-test
 *
 * Multi-provider server proxy for testing AI prompts.
 * Supports: Gemini, OpenAI (ChatGPT), Anthropic (Claude).
 * Includes auto-fallback for high demand / rate-limited Gemini models.
 *
 * Body: { provider?: string, apiKey: string, model?: string, prompt: string }
 * Returns: { text: string } or { error: string }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { apiKey, prompt, provider = "gemini" } = body;

    if (!apiKey || typeof apiKey !== "string" || !apiKey.trim()) {
      return NextResponse.json(
        { error: "A valid API key is required." },
        { status: 400 }
      );
    }

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { error: "A prompt is required." },
        { status: 400 }
      );
    }

    const cleanKey = apiKey.trim();
    const cleanPrompt = prompt.trim();
    const selectedProvider = provider.toLowerCase();

    // 1. OPENAI (ChatGPT)
    if (selectedProvider === "openai") {
      const requestedModel = body.model?.trim() || "gpt-4o";
      const openaiFallbackModels = [...new Set([requestedModel, "gpt-4o", "gpt-4o-mini"])];
      let lastOpenAIError = null;

      for (const model of openaiFallbackModels) {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${cleanKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: cleanPrompt }],
            temperature: 0.7,
          }),
        });

        const data = await response.json();
        if (response.ok && data?.choices?.[0]?.message?.content) {
          return NextResponse.json({ text: data.choices[0].message.content });
        }

        lastOpenAIError = data?.error?.message || `OpenAI API error for ${model} (Status ${response.status})`;
        if (response.status === 401) break; // Don't retry invalid API key
      }

      return NextResponse.json({ error: lastOpenAIError }, { status: 400 });
    }

    // 2. ANTHROPIC (Claude)
    if (selectedProvider === "anthropic" || selectedProvider === "claude") {
      const requestedModel = body.model?.trim() || "claude-3-5-sonnet-latest";
      const claudeFallbackModels = [...new Set([requestedModel, "claude-3-5-sonnet-latest", "claude-3-5-haiku-latest"])];
      let lastClaudeError = null;

      for (const model of claudeFallbackModels) {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": cleanKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model,
            max_tokens: 2048,
            messages: [{ role: "user", content: cleanPrompt }],
          }),
        });

        const data = await response.json();
        if (response.ok && data?.content?.[0]?.text) {
          return NextResponse.json({ text: data.content[0].text });
        }

        lastClaudeError = data?.error?.message || `Anthropic API error for ${model} (Status ${response.status})`;
        if (response.status === 401) break;
      }

      return NextResponse.json({ error: lastClaudeError }, { status: 400 });
    }

    // 3. GEMINI (Google - Default)
    const normalizeGeminiModel = (m) => {
      if (!m) return "gemini-2.0-flash";
      const cleanM = m.trim().toLowerCase();
      if (cleanM === "gemini-1.5-pro") return "gemini-1.5-pro-latest";
      if (cleanM.includes("3.5") || cleanM.includes("2.5")) return "gemini-2.0-flash";
      return m.trim();
    };

    const targetModel = normalizeGeminiModel(body.model);
    const geminiFallbackModels = [...new Set([targetModel, "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro-latest"])];

    let lastGeminiError = null;

    for (const currentModel of geminiFallbackModels) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${cleanKey}`;

      const response = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: cleanPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      });

      const data = await response.json();

      if (response.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const text = data.candidates[0].content.parts[0].text;
        return NextResponse.json({ text });
      }

      lastGeminiError = data?.error?.message || `Gemini API error for ${currentModel} (Status ${response.status})`;
      if (response.status === 400 && data?.error?.message?.includes("API key not valid")) {
        break; // Stop retrying if key is invalid
      }
    }

    return NextResponse.json(
      { error: lastGeminiError || "High demand on Gemini models. Please try again in a moment." },
      { status: 500 }
    );

  } catch (error) {
    console.error("[ai-test proxy] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
