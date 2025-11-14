
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateFlashcardContent = async (
  term: string,
  definition: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API key not configured. Please set the API_KEY environment variable.";
  }
  try {
    const prompt = `Given the term "${term}" and its definition "${definition}", provide a simple and clear example sentence or a helpful mnemonic for remembering it. Respond with only the example sentence or mnemonic.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating content with Gemini API:", error);
    return "Failed to generate content. Please check the console for details.";
  }
};
