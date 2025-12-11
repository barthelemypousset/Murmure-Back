const express = require("express");
const router = express.Router();

// Tableaux des url en fonction des choix theme, duration pour le mode "guidee" et éventuellement "solo" (si url musique ajouté plus tard)
const meditations = [
  {
    theme: "anxiete",
    mode: "guidee",
    durations: {
      3: "https://res.cloudinary.com/dmbowwvt8/video/upload/v1765279887/Murmure_Anxiete_3_min_abgfhl.mp3", //IA ElevenLabs
      5: "https://res.cloudinary.com/dmbowwvt8/video/upload/v1765199945/Murmure__Medit_detente_3_min.m4a",
      10: "https://res.cloudinary.com/dmbowwvt8/video/upload/v1765199945/Murmure__Medit_detente_3_min.m4a",
    },
  },
  {
    theme: "detente",
    mode: "guidee",
    durations: {
      3: "https://res.cloudinary.com/dmbowwvt8/video/upload/v1765199945/Murmure__Medit_detente_3_min.m4a", //Stéphanie
      5: "https://res.cloudinary.com/dmbowwvt8/video/upload/v1765199945/Murmure__Medit_detente_3_min.m4a",
      10: "https://res.cloudinary.com/dmbowwvt8/video/upload/v1765199945/Murmure__Medit_detente_3_min.m4a",
    },
  },
  {
    theme: "sommeil",
    mode: "guidee",
    durations: {
      3: "https://res.cloudinary.com/dmbowwvt8/video/upload/v1765279302/Murmure_Sommeil_3min_y34fz0.mp3", //IA ElevenLabs
      5: "https://res.cloudinary.com/dmbowwvt8/video/upload/v1765199945/Murmure__Medit_detente_3_min.m4a",
      10: "https://res.cloudinary.com/dmbowwvt8/video/upload/v1765199945/Murmure__Medit_detente_3_min.m4a",
    },
  },
];

router.post("/", async (req, res) => {
  try {
    const { type, mode, duration } = req.body;

    console.log("POST /meditation :", type, mode, duration);

    // Identifier la bonne méditation
    const entry = meditations.find(
      (item) => item.theme === type && item.mode === mode
    );

    if (!entry) {
      return res.status(404).json({
        result: false,
        error: "Aucune méditation trouvée pour ces paramètres.",
      });
    }

    // Récupérer l'url selon la durée
    const audioUrl = entry.durations[duration];

    if (!audioUrl) {
      return res.status(404).json({
        result: false,
        error: "Durée non disponible pour cette méditation.",
      });
    }

    // Réponse finale si tout se passe bien
    res.json({
      result: true,
      audioUrl,
    });
  } catch (error) {
    console.error("Erreur /meditation :", error);
    res.status(500).json({ result: false, error: "Erreur serveur" });
  }
});

module.exports = router;
