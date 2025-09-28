import EventRepository from "../repository/EventRepository.js";
import logger from "../utils/logger.js";
import UniverseRepository from "../repository/UniverseRepository.js";
import { fetchGeminiResponse } from "../utils/gemini.js";

class EventService {
    constructor() {
        this.eventRepository = new EventRepository();
        this.universeRepository = new UniverseRepository();
    }

    async createEvent({ universeId, prompt, submittedBy }) {
        try {
            const universe = await this.universeRepository.getUniverseById(universeId);
            if (!universe) {
                logger.warn(`Universe not found for ID: ${universeId}`);
                throw new Error("Universe not found");
            }

            const recentEvents=await this.eventRepository.findRecentEvents(universeId, 10);
            const history = recentEvents.map(e => `- Prompt: "${e.prompt}"\n  - Outcome: ${e.aiOutcome.content}`).join('\n');

            const fullPrompt = `
                You are the witty and imaginative narrator of a collaborative world-building game. 
                Your job is to create outcomes that players love reading, blending humor, drama, and excitement while keeping events believable in the universe’s context.
                Use simple words, easy-to-understand English words so every player can enjoy the story and understand it.

                **Universe Rules:**
                - Government: ${universe.rules.government}
                - Tech Level: ${universe.rules.techLevel}
                - Economy: ${universe.rules.economy}
                - Morality: ${universe.rules.morality}
                - Language: ${universe.rules.language}

                **Recent History (most recent first):**
                ${history || "This is the first event in the timeline."}

                **Storytelling Guidelines:**
                    1. Make the outcome exciting, easy to read, and fun for players.
                    2. Keep the story logical — even strange events should have a believable reason based on history and rules.
                    3. Show cause and effect — explain why things happen, not just what happens.

                **New Player Prompt:**
                "${prompt}"

                **Your Task:**
                1. Write a creative and engaging outcome for the new prompt that fits naturally within the universe’s rules and history. 
                2. You can use light humor, irony, or tension to make it entertaining — but keep it logical and consistent with known events. 
                3. If an unrealistic or fantastical event is suggested (e.g., a sudden black hole), give it a plausible in-universe explanation (e.g., "scientists had predicted it after the Andromeda–Milky Way drift detection decades ago").
                4. The outcome should be a single, vivid paragraph that makes players feel like they are part of the unfolding world.
                5. After writing, classify the event’s impact on the universe as 'positive', 'neutral', or 'chaotic'.
                6. Use simple english only. No complex words.

                Return a valid JSON object with:
                {
                    "content": "story paragraph",
                    "resultType": "positive | neutral | chaotic"
                }
                `;


            const aiOutcome = await fetchGeminiResponse(fullPrompt);

            const newEvent =await this.eventRepository.createEvent( {
                universeId,
                prompt,
                submittedBy,
                aiOutcome
            });
            
            await this.universeRepository.updateUniverseTimeline(universeId, newEvent._id);

            return newEvent;
        } catch (error) {
            logger.error("Error in EventService while creating event:", error);
            throw error;
        }
    }
 
}

export default EventService;