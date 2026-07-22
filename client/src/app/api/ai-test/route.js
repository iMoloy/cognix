import { NextResponse } from "next/server";

/**
 * POST /api/ai-test
 *
 * Multi-provider server proxy for testing AI prompts.
 * Strictly uses verified active models:
 * - Gemini: gemini-2.0-flash, gemini-1.5-flash, gemini-2.0-flash-lite
 * - OpenAI: gpt-4o, gpt-4o-mini, o3-mini
 * - Anthropic: claude-3-5-sonnet-latest, claude-3-7-sonnet-latest, claude-3-5-haiku-latest
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
      const sanitizeOpenAIModel = (m) => {
        if (!m) return "gpt-4o";
        const clean = m.trim().toLowerCase();
        if (clean.includes("o3")) return "o3-mini";
        if (clean.includes("mini")) return "gpt-4o-mini";
        return "gpt-4o";
      };

      const targetModel = sanitizeOpenAIModel(body.model);
      const openaiModels = [...new Set([targetModel, "gpt-4o", "gpt-4o-mini"])];
      let lastOpenAIError = null;

      for (const model of openaiModels) {
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
        if (response.status === 401) break;
      }

      return NextResponse.json({ error: lastOpenAIError }, { status: 400 });
    }

    // 2. ANTHROPIC (Claude)
    if (selectedProvider === "anthropic" || selectedProvider === "claude") {
      const sanitizeClaudeModel = (m) => {
        if (!m) return "claude-3-5-sonnet-latest";
        const clean = m.trim().toLowerCase();
        if (clean.includes("3-7") || clean.includes("3.7")) return "claude-3-7-sonnet-latest";
        if (clean.includes("haiku")) return "claude-3-5-haiku-latest";
        return "claude-3-5-sonnet-latest";
      };

      const targetModel = sanitizeClaudeModel(body.model);
      const claudeModels = [...new Set([targetModel, "claude-3-5-sonnet-latest", "claude-3-5-haiku-latest"])];
      let lastClaudeError = null;

      for (const model of claudeModels) {
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
    // Strictly sanitize to active supported models: gemini-2.0-flash, gemini-1.5-flash, gemini-2.0-flash-lite
    const sanitizeGeminiModel = (m) => {
      if (!m) return "gemini-2.0-flash";
      const cleanM = m.trim().toLowerCase();
      if (cleanM.includes("lite")) return "gemini-2.0-flash-lite";
      if (cleanM.includes("1.5")) return "gemini-1.5-flash";
      return "gemini-2.0-flash";
    };

    const targetModel = sanitizeGeminiModel(body.model);
    const geminiModels = [...new Set([targetModel, "gemini-2.0-flash", "gemini-1.5-flash"])];

    let lastGeminiError = null;

    for (const currentModel of geminiModels) {
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
        break;
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
