
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateProductDescription = async (productName: string, category: string, details?: string): Promise<string> => {
  try {
    const detailsInstruction = details
      ? `Incorporate these specific details: ${details}`
      : `Be descriptive and use evocative language, mentioning details about the likely gemstone (e.g., clarity, cut, origin) or metal (e.g., purity, finish) used.`;

    const prompt = `Generate a captivating, one-paragraph product description for a luxury jewelry store selling a "${productName}" which is in the category of "${category}". Highlight its elegance and craftsmanship. ${detailsInstruction} Conclude with a subtle call to action, such as 'Experience timeless elegance' or 'Adorn yourself with unparalleled beauty'. Do not use markdown.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating product description:", error);
    return "Failed to generate description. Please try again.";
  }
};
