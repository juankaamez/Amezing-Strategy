import { GoogleGenAI, Type } from "@google/genai";

// FIX: Per coding guidelines, initialize GoogleGenAI directly with the
// API key from environment variables without any fallbacks or checks.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProsCons = async (topic: string) => {
  // FIX: Removed API_KEY check as its availability is a hard requirement.
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `For the decision topic "${topic}", generate a list of potential pros and a list of potential cons.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pros: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Positive outcomes or advantages.',
            },
            cons: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Negative outcomes or disadvantages.',
            },
          },
        },
      },
    });
    
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);

  } catch (error) {
    console.error("Error generating pros and cons:", error);
    return { pros: ['Error fetching from AI.'], cons: ['Could not generate suggestions.'] };
  }
};

export const generateSWOT = async (topic: string) => {
  // FIX: Removed API_KEY check as its availability is a hard requirement.
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a SWOT analysis for the following topic: "${topic}". Consider internal factors for strengths and weaknesses, and external factors for opportunities and threats.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
            threats: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      },
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);

  } catch (error) {
    console.error("Error generating SWOT analysis:", error);
    return { strengths: ['Error fetching from AI.'], weaknesses: [], opportunities: [], threats: [] };
  }
};

export const generateHatThoughts = async (topic: string, hatColor: string, hatDescription: string) => {
  // FIX: Removed API_KEY check as its availability is a hard requirement.
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `For the topic "${topic}", generate a few bullet points from the perspective of the ${hatColor} Thinking Hat. This hat focuses on: ${hatDescription}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            thoughts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: `A list of thoughts or questions from the ${hatColor} hat's perspective.`,
            },
          },
        },
      },
    });
    
    const jsonStr = response.text.trim();
    const parsed = JSON.parse(jsonStr);
    return parsed.thoughts || [];

  } catch (error) {
    console.error(`Error generating thoughts for ${hatColor} hat:`, error);
    return ['Error fetching ideas from AI.'];
  }
};

export const generateFishboneCauses = async (problem: string, category: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `For the problem "${problem}", suggest 3 potential causes that fall under the category "${category}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            causes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: `A list of potential causes related to ${category}.`,
            },
          },
        },
      },
    });
    
    const jsonStr = response.text.trim();
    const parsed = JSON.parse(jsonStr);
    return parsed.causes || [];
  } catch (error) {
    console.error(`Error generating causes for ${category}:`, error);
    return ['Error fetching ideas from AI.'];
  }
};

export const generateBrainstormingIdeas = async (topic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Brainstorm a list of 5-7 creative ideas or concepts related to the topic: "${topic}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ideas: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'A list of brainstorming ideas.',
            },
          },
        },
      },
    });
    
    const jsonStr = response.text.trim();
    const parsed = JSON.parse(jsonStr);
    return parsed.ideas || [];
  } catch (error) {
    console.error('Error generating brainstorming ideas:', error);
    return ['Error fetching ideas from AI.'];
  }
};

export const getDelphiFeedback = async (question: string, userResponse: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `I am using the Delphi method.
The main question is: "${question}".
My current response is: "${userResponse}".

Please act as an expert panel. Provide a constructive critique of my response. Identify potential blind spots, suggest alternative viewpoints, and ask clarifying questions to help me refine my answer. Keep your feedback concise and focused.`,
    });
    return response.text;
  } catch (error) {
    console.error('Error getting Delphi feedback:', error);
    return 'There was an error getting feedback from the AI. Please try again.';
  }
};