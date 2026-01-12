// server.js, is responsible for creating the server, listening for incoming requests, and handling errors
// As this is the new entrypoint bin/www idn't necessary anymore

require('dotenv').config();
require('./src/models/connection');

const http = require('http');

const { Server } = require('socket.io'); //server de socket.io (websocket)
const OpenAI = require('openai');
const app = require('./app'); // Express principal, contient toutes les routes
// Rq: démarrage du projet non plus par bin/www mais pas server.js, modidifation du package json (cf commandes script : start et dev)

//Stockage de conversations
const conversationsByToken = {};

// LANCEMENT SERVEUR -------------------------------------
// On crée un serveur HTTP "bas niveau" qui enveloppe l'app Express, nécessaire pour y attacher socket.IO (websocket). Le serveur écoutera le port défini ou 3000 par défaut
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

// CREATION IA COTE SERVEUR --------------------------------
// On crée le client IA côté serveur:
// POUR L'EQUIPE : Besoin d'ajouter à .env: HF_TOKEN=token
// Ce token s'obtient après création d'un compte sur HuggingFace, settings / AccessTokens (bien la noter, visible qu'une seule fois)

const client = new OpenAI({
  baseURL: 'https://router.huggingface.co/v1',
  apiKey: process.env.HF_TOKEN,
});
// Avec ce lien on va utiliser client.chat.completions.create(...)

// Caractère de l'IA/personnalité, sera le premier message enregistré de la conversation (= contexte)
const SYSTEM_PROMPT = `
Tu es une présence douce, apaisante et profondément bienveillante.
Tu t'exprimes avec simplicité, lenteur et chaleur.
Tu aides l'utilisateur à mettre des mots sur ce qu'il ressent, sans jamais juger.

Tu commences toujours par demander "Comment te sens-tu aujourd'hui?". 
Écoute attentivement la réponse et rebondis sur les émotions exprimées.
Valide toujours les émotions de l'utilisateur avant d'explorer plus loin.
Si l'utilisateur est vague, pose une question douce pour l'aider à préciser.

Tes réponses sont courtes (2-4 phrases maximum), concrètes, ancrées dans le présent, 
et tu invites parfois à revenir à la respiration ou aux sensations corporelles quand c'est pertinent.
Utilise un tutoiement chaleureux et évite le jargon psychologique.
Tu ne donnes pas de conseil si on ne te l'a pas demandé.
Tu ne donnes jamais de diagnostic médical ou psychologique.
`;

// Appel IA Hugging Face, on y joint toute la conversation en paramètre ({role,content})

// POUR L'EQUIPE :
// https://platform.openai.com/docs/api-reference/chat/create
// https://huggingface.co/docs/inference-providers/tasks/chat-completion
// https://huggingface.co/google/gemma-2-2b-it?inference_api=true&inference_provider=nebius&language=js&client=openai
// https://huggingface.co/inference/models

async function callAIWithHistory(conversation) {
  try {
    // cf cours: client.chat.completions permet le dialogue
    const completion = await client.chat.completions.create({
      model: 'google/gemma-2-2b-it',
      //   Autres models: google/gemma-2-9b-it ou :meta-llama/Llama-3.2-3B-Instruct
      messages: conversation,
      temperature: 0.6, //controle de la créativité: 0 déteministe, précis / 0.8 plus aléatoire
      max_completion_tokens: 150, //max tokens de la réponse
      // top_p:0.9//limite les choix les plus probables
    });
    const rawResponse = completion.choices[0].message.content;
    const cleanedResponse = rawResponse.trim();
    return cleanedResponse;
  } catch (error) {
    console.error('Erreur Hugging Face callAIWithHistory au catch', error);
    return 'Je rencontre un petit souci pour répondre. Respire un instant, puis repose-moi ta question...';
  }
}

// GESTION DES CONNEXIONS SOCKET.IO  --------------------------------

// SOCKET.IO : gestion des connexions
// io.on: écoute les connections de nouveaux clients, à chaque connexion on obtient un socket dont .id

// POUR L'EQUIPE :
// https://socket.io/fr/docs/v4/
// https://github.com/socketio/socket.io/blob/main/examples/chat/index.js

// Création du serveur Socket.IO que l'on rattache au même serveur que Express, ici pour l'instant toutes les origines sont autorisées à se connecter ()
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  // Récup token et username
  const token = socket.handshake.auth?.token;
  const username = socket.handshake.auth?.username || '';
  let conversation;

  // Si token existe
  if (token) {
    if (!conversationsByToken[token]) {
      // Message d'accueil personnalisé

      const welcomeMessage = username
        ? `Bonjour ${username}, comment te sens-tu aujourd'hui?`
        : `Bonjour, comment te sens-tu aujourd'hui?`;

      // Première connexion chat
      conversationsByToken[token] = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'assistant', content: welcomeMessage },
      ];
      // console.log('nouvelle conversation crée pour token:', token);
    } else {
      // console.log('conversation existante récupérée pour token:', token);
    }
    // Récup conversation existante
    conversation = conversationsByToken[token];
  } else {
    // pas de token : conversation temporaire non sauvegardée
    conversation = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'assistant', content: "Bonjour, comment te sens-tu aujourd'hui?" },
    ];
  }
  // Envoi de l'historique
  socket.emit('chat-history', conversation);

  // Quand le front envoie un message utilisateur :
  // socket.on: écoute de ce qui est émis par le front
  socket.on('user-message', async (msg) => {
    conversation.push({ role: 'user', content: msg });
    const aiReply = await callAIWithHistory(conversation); //appel de l'ia + stock de sa réponse dans aiReply
    conversation.push({ role: 'assistant', content: aiReply }); //on l'ajoute à l'historique
    socket.emit('ai-message', aiReply); //envoie la réponse à CE client (socket, sinon c'est io.emit)
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté', socket.id);
  });
});

// Route de test
app.get('/', (req, res) => {
  res.send('Serveur OK');
});
