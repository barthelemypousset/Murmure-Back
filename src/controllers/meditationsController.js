// The controller act as the brain of the app, how to handle the req. It use the service to talk with the DB

const { checkBody } = require('../modules/checkBody');
const meditationsService = require('../services/meditationsService');

async function getPlayerMeditation(req, res) {
  try {
    const { theme, mode, duration } = req.query;

  if (!theme || !mode || !duration) {
    return res.status(400).json({
      result: false,
      error: 'Missing query parameters',
    });
  }

    const meditation = await meditationsService.findMeditation({
      theme,
      mode,
      duration: Number(duration),
    });

    if (!meditation) {
      return res.status(404).json({
        result: false,
        error: 'Aucune méditation trouvée pour ces paramètres.',
      });
    }

    res.json({
      result: true,
      audioUrl: meditation.audioUrl,
    });
  } catch (error) {
    console.error('Erreur /meditation/player :', error);
    res.status(500).json({ result: false, error: 'Erreur serveur' });
  }
}

async function createMeditation(req, res) {
  const { theme, mode, duration, audioUrl, imageUrl } = req.body;

  const meditation = await meditationsService.createMeditation({
    theme,
    mode,
    duration,
    audioUrl,
    imageUrl,
  });

  const allMeditations = await meditationsService.getAllMeditations();

  res.json({ allMeditations });
}

module.exports = {
  getPlayerMeditation,
  createMeditation,
};
