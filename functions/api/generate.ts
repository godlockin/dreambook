import { GoogleGenAI } from "@google/genai";

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const { refinedPrompt, size } = await request.json();

    if (!env.API_KEY) {
      return new Response(JSON.stringify({ error: "API_KEY not configured on server" }), { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: env.API_KEY });

    // Map requested size to Gemini supported sizes.
    // Gemini 3 Pro Image supports '1K' and '2K'.
    // If user requested '512', we use '1K' as the closest valid supported size,
    // as the model does not strictly support '512' as an enum parameter in this context.
    let effectiveSize = size;
    if (size === '512') {
        effectiveSize = '1K';
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: refinedPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: effectiveSize,
        },
      },
    });

    let imageUrl = null;
    for (const candidate of response.candidates || []) {
      for (const part of candidate.content.parts) {
        if (part.inlineData && part.inlineData.data) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) throw new Error("No image generated");

    return new Response(JSON.stringify({ imageUrl }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message || "Image generation failed" }), { status: 500 });
  }
}