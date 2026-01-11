const request = require("supertest");

// Mock du modèle Mongoose pour empêcher la connexion à la base de données
jest.mock("../models/meditations");

const Meditation = require("../src/models/meditations");
const app = require("../app");

describe("POST /meditation/player", () => {
  it("renvoie un audio si la méditation existe", async () => {
    // Simulation de la réponse : méditation trouvée, renvoie un lien url
    Meditation.findOne.mockResolvedValue({ audioUrl: "https//lienaudio.mp3" });

    const res = await request(app).post("/meditation/player").send({
      theme: "anxiete",
      mode: "guidee",
      duration: 3,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(true);
    expect(res.body.audioUrl).toBeDefined();
  });

  it("renvoie une erreur si aucune méditation trouvée", async () => {
    // Simulation de la réponse : aucun résultat
    Meditation.findOne.mockResolvedValue(null);

    const res = await request(app).post("/meditation/player").send({
      theme: "nimportequoi",
      mode: "guidee",
      duration: 3,
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.result).toBe(false);
  });

  it("retourne une erreur si un ou plusieurs des paramètres d entrée est manquant", async () => {
    // Dans ce test la base ne doit même pas être appelée
    const res = await request(app).post("/meditation/player").send({
      theme: "anxiete",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.result).toBe(false);
  });
});
