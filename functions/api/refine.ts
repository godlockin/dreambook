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
      1. Use Google Search to find information about the picture book titled "${bookTitle}". Look for its specific visual art style (medium, technique, color palette).
      2. **Style Selection Logic**:
         - **IF** you find specific details about "${bookTitle}"'s art style: Use that exact style as the artistic reference.
         - **IF** you cannot find the book or the style is unclear: You MUST use a "bright, colorful, and engaging cartoon style suitable for a 7-year-old (2nd grade) child".
      3. Read the following story summary provided by a child: "${userStory}".
      4. Write a HIGHLY DETAILED image generation prompt in English.
      5. The prompt must explicitly describe the medium, art style (based on the selection logic above), lighting, and mood.
      6. Do NOT output any explanation or internal reasoning. Output ONLY the raw image generation prompt text in English.
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