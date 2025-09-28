import logger from "./logger.js";
import { GEMINI_API_KEY, GEMINI_MODEL_NAME } from "../config/server-config.js";

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Base function to call Gemini with schema
 */
async function callGemini(prompt, schema) {
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      response_mime_type: "application/json",
      response_schema: schema,
      temperature: 0.9,
      top_p: 1,
    },
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    const jsonText = data.candidates[0].content.parts[0].text;
    return JSON.parse(jsonText);
  } catch (error) {
    logger.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate AI response.");
  }
}

/**
 * 1. Generate event outcome
 */
export async function generateEventOutcome(prompt) {
  const schema = {
    type: "OBJECT",
    properties: {
      content: { type: "STRING" },
      resultType: {
        type: "STRING",
        enum: ["positive", "neutral", "chaotic"],
      },
    },
    required: ["content", "resultType"],
  };
  return callGemini(prompt, schema);
}

/**
 * 2. Generate first lore when universe is created
 */
export async function generateUniverseLore(prompt) {
  const schema = {
    type: "OBJECT",
    properties: {
      title: { type: "STRING" },
      content: { type: "STRING" },
    },
    required: ["title", "content"],
  };
  return callGemini(prompt, schema);
}

/**
 * 3. Generate lore after an event
 */
export async function generateEventLore(prompt) {
  const schema = {
    type: "OBJECT",
    properties: {
      title: { type: "STRING" },
      content: { type: "STRING" },
    },
    required: ["title", "content"],
  };
  return callGemini(prompt, schema);
}
