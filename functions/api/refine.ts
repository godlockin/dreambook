import { GoogleGenAI } from "@google/genai";

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const { bookTitle, userStory } = await request.json();

    if (!env.API_KEY) {
      return new Response(JSON.stringify({ error: "API_KEY not configured on server" }), { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: env.API_KEY });

    const prompt = `
      You are a specialized creative assistant for a children's book illustration app.
      
      Task:
      1. Use Google Search to find information about the picture book titled "${bookTitle}". Focus on its visual art style (e.g., watercolor, collage, digital, pencil sketch), color palette, and character design traits.
      2. Read the following story summary provided by a child: "${userStory}".
      3. Based on the book's style and the child's story, write a HIGHLY DETAILED image generation prompt in English.
      4. The prompt should explicitly describe the medium, art style, lighting, and mood to match "${bookTitle}".
      5. Do NOT output any explanation. Output ONLY the raw image generation prompt text in English.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are an expert art director and prompt engineer.",
      }
    });

    return new Response(JSON.stringify({ refinedPrompt: response.text }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}