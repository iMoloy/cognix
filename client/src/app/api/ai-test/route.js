import { NextResponse } from "next/server";

/**
 * POST /api/ai-test
 *
 * Server-side proxy for Gemini API calls.
 * The browser cannot call generativelanguage.googleapis.com directly (CORS).
 * This route handler runs on the server, so it can make the request without CORS issues.
 *
 * Body: { apiKey: string, prompt: string, model?: string }
 * Returns: { text: string } or { error: string }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { apiKey, prompt } = body;

    if (!apiKey || typeof apiKey !== "string" || !apiKey.trim()) {
      return NextResponse.json(
        { error: "A valid Gemini API key is required." },
        { status: 400 }
      );
    }

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { error: "A prompt is required." },
        { status: 400 }
      );
    }

    const model = (typeof body?.model === "string" && body.model.trim())
      ? body.model.trim()
      : "gemini-3.5-flash";

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const response = await fetch(`${geminiUrl}?key=${apiKey.trim()}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data?.error?.message || `Gemini API error (status ${response.status})`;
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    // Extract text from Gemini response
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated.";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("[ai-test proxy] Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected server error occurred.",
      },
      { status: 500 }
    );
  }
}
