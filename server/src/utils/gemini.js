import logger from "./logger.js";

import { GEMINI_API_KEY, GEMINI_MODEL_NAME } from "../config/server-config.js";

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

export async function fetchGeminiResponse(prompt) {
    const payload = {
        contents: [{
            parts: [{ text: prompt }]
        }],
        generationConfig: {
            response_mime_type: "application/json",
            response_schema: {
                type: "OBJECT",
                properties: {
                    "content": { "type": "STRING" },
                    "resultType": { 
                        "type": "STRING",
                        "enum": ["positive", "neutral", "chaotic"]
                    }
                },
                required: ["content", "resultType"]
            },
            temperature: 0.9,
            top_p: 1,
        }
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
        }

        const data = await response.json();
        
        // Extract the JSON string from the response and parse it
        const jsonText = data.candidates[0].content.parts[0].text;
        return JSON.parse(jsonText);

    } catch (error) {
        logger.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate AI outcome.");
    }
};