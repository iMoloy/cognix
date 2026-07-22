import { NextResponse } from "next/server";

/**
 * POST /api/ai-test
 *
 * Fully dynamic multi-provider server proxy for testing AI prompts.
 * Passes the requested model string directly to the provider (Gemini, OpenAI, Anthropic/Claude).
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
      const requestedModel = body.model?.trim() || "gpt-5.6-sol";
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${cleanKey}`,
        },
        body: JSON.stringify({
          model: requestedModel,
          messages: [{ role: "user", content: cleanPrompt }],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        return NextResponse.json(
          { error: data?.error?.message || `OpenAI API error for ${requestedModel} (Status ${response.status})` },
          { status: response.status }
        );
      }

      const text = data?.choices?.[0]?.message?.content || "No response generated.";
      return NextResponse.json({ text });
    }

    // 2. ANTHROPIC (Claude)
    if (selectedProvider === "anthropic" || selectedProvider === "claude") {
      const requestedModel = body.model?.trim() || "claude-sonnet-5";
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": cleanKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: requestedModel,
          max_tokens: 2048,
          messages: [{ role: "user", content: cleanPrompt }],
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        return NextResponse.json(
          { error: data?.error?.message || `Anthropic API error for ${requestedModel} (Status ${response.status})` },
          { status: response.status }
        );
      }

      const text = data?.content?.[0]?.text || "No response generated.";
      return NextResponse.json({ text });
    }

    // 3. GEMINI (Google - Default)
    // Passes exact requested model string (e.g., gemini-3.5-flash, gemini-3.6-flash, gemini-3.1-pro)
    const requestedModel = body.model?.trim() || "gemini-3.5-flash";
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${requestedModel}:generateContent?key=${cleanKey}`;

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

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || `Gemini API error for ${requestedModel} (Status ${response.status})` },
        { status: response.status }
      );
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    return NextResponse.json({ text });

  } catch (error) {
    console.error("[ai-test proxy] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
