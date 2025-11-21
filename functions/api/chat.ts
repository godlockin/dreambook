import { GoogleGenAI } from "@google/genai";

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const { message } = await request.json();

    if (!env.API_KEY) {
      return new Response(JSON.stringify({ error: "API_KEY not configured on server" }), { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: env.API_KEY });
    
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: "You are a friendly, encouraging AI companion for kids who loves reading and drawing. Speak simply, use emojis, and be helpful.",
      },
    });

    const response = await chat.sendMessage({ message });

    return new Response(JSON.stringify({ response: response.text }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}