import UniverseService from "../services/UniverseService.js";


const universeService = new UniverseService();

const createUniverse = async (req, res) => {
  try {
    const creator = req.user._id;
    const { title, rules } = req.body;

    if (!title || !rules) {
      return res.status(400).json({ message: "Title and rules are required" });
    }

    const universe = await universeService.createUniverse({ title, rules, creator });
    return res.status(201).json({ 
        message: "Universe created", 
        data: universe ,
    });
  } catch (error) {
    return res.status(500).json({ 
        message: error.message,
        error: error.message
    });
  }
};

const getMyUniverses = async (req, res) => {
  try {
    const userId = req.user._id;
    const universes = await universeService.getUniverses(userId);
    return res.status(200).json({ 
        message: "My universes fetched successfully",
        data:universes 
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteUniverse = async (req, res) => {
  try {
    const userId = req.user._id;
    const universeId = req.params.id;

    const deleted = await universeService.deleteUniverse(universeId, userId);
    if (!deleted) {
      return res.status(403).json({ message: "Only the creator can delete this universe" });
    }

    return res.status(200).json({ message: "Universe deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUniverseTitle = async (req, res) => {
  try {
    const userId = req.user._id;
    const universeId = req.params.id;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "title field is required" });
    }

    const updated = await universeService.updateUniverseTitle(universeId, userId, title);
    if (!updated) {
      return res.status(403).json({ message: "Only the creator can update the title" });
    }

    return res.status(200).json({ message: "Title updated successfully", universe: updated });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
    createUniverse,
    getMyUniverses,
    deleteUniverse,
    updateUniverseTitle
}
