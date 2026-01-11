const express = require('express');
const router = express.Router();
const Meditation = require('../models/meditations');
const { checkBody } = require('../modules/checkBody');
// Tableaux des url en fonction des choix theme, duration pour le mode "guidee" et éventuellement "solo" (si url musique ajouté plus tard)


router.get('/player', async (req, res) => {
  try {
    const { theme, mode, duration } = req.body;

    console.log('GET /meditation/player :', theme, mode, duration);

    // Vérifier que toutes les données sont là
    if (!checkBody(req.body, ['theme', 'mode', 'duration'])) {
      return res.status(400).json({ result: false, error: 'Missing or empty fields' });
    }

    // Identifier la bonne méditation
    const entry = await Meditation.findOne({
      theme,
      mode,
      duration: Number(duration),
    });
    console.log('entry =', entry);

    if (!entry) {
      return res.status(404).json({
        result: false,
        error: 'Aucune méditation trouvée pour ces paramètres.',
      });
    }

    // Réponse finale si tout se passe bien
    res.json({
      result: true,
      audioUrl: entry.audioUrl,
    });
  } catch (error) {
    console.error('Erreur /meditation/player :', error);
    res.status(500).json({ result: false, error: 'Erreur serveur' });
  }
});

// *****************************************************
// Module backend pour ajouter des méditations (mais non reporté sur le front) - Mode production

router.post('/', (req, res) => {
  const { theme, mode, duration, audioUrl, imageUrl } = req.body;

  const newMeditation = new Meditation({
    theme,
    mode,
    duration,
    audioUrl,
    imageUrl,
  });
  newMeditation.save().then((newMeditation) => {
    console.log('New Meditation saved', newMeditation);
    Meditation.find().then((allMeditations) => res.json({ allMeditations }));
  });
});

module.exports = router;