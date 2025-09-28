import LoreRepository from "../repository/LoreRepository.js";
import UniverseRepository from "../repository/UniverseRepository.js";
import logger from "../utils/logger.js";
import { generateUniverseLore, generateEventLore } from "../utils/gemini.js";

class LoreService {
  constructor() {
    this.loreRepository = new LoreRepository();
    this.universeRepository = new UniverseRepository();
  }

  async createUniverseLore(universe) {
    try {
      const prompt = `
        You are a friendly historian telling the story of how a new universe began. 
        Imagine you are writing a story for players who want to enjoy and easily 
        understand the history of their world.

        **Universe Rules:**
        - Government: ${universe.rules.government}
        - Tech Level: ${universe.rules.techLevel}
        - Economy: ${universe.rules.economy}
        - Morality: ${universe.rules.morality}
        - Language: ${universe.rules.language}

        Guidelines:
        - Tell the origin story of the universe in simple, clear English. 
        - Use short sentences and easy words so anyone can enjoy it.
        - Keep it fun, vivid, and a little magical, but always easy to follow. 
        - Avoid complicated or academic words (e.g., don't use "primordial" or "nascent").
        - Write it like a short campfire story, not a textbook.

        Return JSON:
        {
            "title": "short lore title",
            "content": "historian styled but simple and fun narrative"
        }
        `;


      const aiLore = await generateUniverseLore(prompt);

      const newLore = await this.loreRepository.create({
        universeId: universe._id,
        title: aiLore.title || "The Beginning",
        content: aiLore.content,
      });

      await this.universeRepository.addLore(universe._id, newLore._id);

      return newLore;
    } catch (error) {
      logger.error("Error creating universe lore:", error);
      throw error;
    }
  }

  async createEventLore(universe, event) {
    try {
      const prompt = `
        You are the historian of the universe, writing down its story for future players.
        A new event has just happened, and you must add it to the lore.

        **Universe Rules:**
        - Government: ${universe.rules.government}
        - Tech Level: ${universe.rules.techLevel}
        - Economy: ${universe.rules.economy}
        - Morality: ${universe.rules.morality}
        - Language: ${universe.rules.language}

        **Event Prompt:** ${event.prompt}
        **Event Outcome:** ${event.aiOutcome.content}

        Guidelines:
        - Write in simple, clear English. 
        - Use short sentences so it's easy to read. 
        - Make it sound like a story, not a report. 
        - Keep it entertaining, like a storyteller sharing history around a fire.
        - Avoid big academic or poetic words.
        - Show cause and effect simply, so players see how the event connects to the universe.

        Return JSON:
        {
            "title": "short lore title",
            "content": "historian styled but simple and fun narrative"
        }
        `;

    


      const aiLore = await generateEventLore(prompt);

      const newLore = await this.loreRepository.create({
        universeId: universe._id,
        title: aiLore.title || "A New Chapter",
        content: aiLore.content,
      });

      await this.universeRepository.addLore(universe._id, newLore._id);

      return newLore;
    } catch (error) {
      logger.error("Error creating event lore:", error);
      throw error;
    }
  }
}

export default LoreService;
