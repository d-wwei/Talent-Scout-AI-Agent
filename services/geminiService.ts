import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CandidatePersona, CandidateProfile } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const personaSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    roleTitle: { type: Type.STRING, description: "The inferred job title" },
    seniorityLevel: { type: Type.STRING, description: "Junior, Mid, Senior, Lead, etc." },
    mustHaveSkills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Critical technical or hard skills required"
    },
    niceToHaveSkills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Bonus skills that are not mandatory"
    },
    yearsOfExperience: { type: Type.STRING, description: "e.g. '3-5 years'" },
    locationPreference: { type: Type.STRING, description: "Remote, Hybrid, or specific city" },
    keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Keywords optimized for LinkedIn boolean search"
    },
    culturalFit: { type: Type.STRING, description: "Description of the ideal personality or work style" },
  },
  required: ["roleTitle", "mustHaveSkills", "keywords", "seniorityLevel"],
};

export const analyzeJobDescription = async (jdText: string): Promise<CandidatePersona> => {
  if (!apiKey) throw new Error("API Key not found");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `You are an expert technical recruiter. Analyze the following Job Description and build a precise candidate persona. \n\nJOB DESCRIPTION:\n${jdText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: personaSchema,
        systemInstruction: "Extract structured data from job descriptions to create search profiles.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as CandidatePersona;
  } catch (error) {
    console.error("Error analyzing JD:", error);
    throw error;
  }
};

const candidateListSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      name: { type: Type.STRING },
      headline: { type: Type.STRING },
      currentCompany: { type: Type.STRING },
      location: { type: Type.STRING },
      matchScore: { type: Type.INTEGER, description: "Score from 0 to 100" },
      summary: { type: Type.STRING, description: "Brief professional summary tailored to the persona" },
      matchingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
      missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ["id", "name", "headline", "matchScore", "matchingSkills"],
  },
};

export const findCandidates = async (persona: CandidatePersona): Promise<CandidateProfile[]> => {
  if (!apiKey) throw new Error("API Key not found");

  // NOTE: In a real production app, this would utilize a Custom Search JSON API or a specialized LinkedIn scraping service/API.
  // Since we cannot scrape LinkedIn directly from a client-side browser due to CORS and scraping protections,
  // we will ask Gemini to generate *realistic* simulated profiles that *would* match this persona to demonstrate the agent's logic.
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Based on the following candidate persona, generate 6 realistic candidate profiles that might be found on LinkedIn. 
      Some should be perfect matches, some slightly less perfect. 
      
      PERSONA:
      ${JSON.stringify(persona)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: candidateListSchema,
        systemInstruction: "You are a sourcing engine simulating LinkedIn search results. Generate realistic profiles.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const profiles = JSON.parse(text) as CandidateProfile[];
    
    // Create smart search links
    return profiles.map(p => {
      // Create a search query based on the simulated profile's attributes
      // This allows the user to click "View on LinkedIn" and find REAL people similar to the AI simulation
      const locationQuery = p.location && p.location !== 'Remote' ? ` ${p.location}` : '';
      const query = `${p.headline} ${p.matchingSkills.slice(0, 2).join(' ')}${locationQuery}`;
      
      return {
        ...p,
        linkedInUrl: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(query)}`
      };
    });

  } catch (error) {
    console.error("Error searching candidates:", error);
    throw error;
  }
};