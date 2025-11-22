import { GoogleGenAI } from "@google/genai";
import { Message, MessageDirection } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSmartReply = async (
  contactName: string,
  messageHistory: Message[]
): Promise<string> => {
  try {
    // Format history for context
    const conversationContext = messageHistory
      .map(m => `${m.direction === MessageDirection.OUTBOUND ? 'Agent' : 'User'}: ${m.text}`)
      .join('\n');

    const prompt = `
      You are a helpful, professional customer support agent for a business using WhatsApp.
      The customer's name is ${contactName}.
      
      Here is the recent conversation history:
      ${conversationContext}
      
      Suggest a short, friendly, and relevant reply to the user's last message. 
      Keep it under 50 words. Do not include "Agent:" prefix.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a professional WhatsApp Business API assistant.",
        temperature: 0.7,
      }
    });

    return response.text || "I couldn't generate a reply at this moment.";
  } catch (error) {
    console.error("Error generating smart reply:", error);
    return "";
  }
};

export const generateCampaignContent = async (
  topic: string,
  tone: 'Professional' | 'Friendly' | 'Urgent'
): Promise<string> => {
  try {
    const prompt = `
      Write a WhatsApp marketing message about: "${topic}".
      Tone: ${tone}.
      Requirements:
      - Use emojis effectively.
      - Keep it concise (under 100 words).
      - Include a clear call to action.
      - Format with bolding where appropriate (using asterisks like *this*).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    console.error("Error generating campaign:", error);
    return "";
  }
};

export const analyzeSentiment = async (message: string): Promise<'Positive' | 'Neutral' | 'Negative'> => {
    try {
        const prompt = `Analyze the sentiment of this message: "${message}". Return ONLY one word: Positive, Neutral, or Negative.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const text = response.text?.trim();
        if (text === 'Positive' || text === 'Neutral' || text === 'Negative') {
            return text;
        }
        return 'Neutral';
    } catch (e) {
        return 'Neutral';
    }
}