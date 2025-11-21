import { ImageSize } from "../types";

/**
 * Calls the backend API to refine the prompt.
 */
export const refinePromptWithStyle = async (bookTitle: string, userStory: string): Promise<string> => {
  try {
    const response = await fetch('/api/refine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookTitle, userStory }),
    });

    if (!response.ok) {
      const err = await response.json() as any;
      throw new Error(err.error || 'Failed to refine prompt');
    }

    const data = await response.json();
    return data.refinedPrompt;
  } catch (error) {
    console.error("Refinement Error:", error);
    throw new Error("Unable to analyze the book style. Please try again.");
  }
};

/**
 * Calls the backend API to generate the illustration.
 */
export const generateIllustration = async (refinedPrompt: string, size: ImageSize): Promise<string> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refinedPrompt, size }),
    });

    if (!response.ok) {
      const err = await response.json() as any;
      throw new Error(err.error || 'Failed to generate image');
    }

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw new Error("Failed to create the illustration.");
  }
};

/**
 * Calls the backend API for chat.
 */
export const getChatResponse = async (message: string, history: any[] = []): Promise<string> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });

    if (!response.ok) throw new Error('Chat failed');
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Chat Error:", error);
    return "Oops! I lost my train of thought. Can you say that again?";
  }
};