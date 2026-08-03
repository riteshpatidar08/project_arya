const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
//emedding model =>
const EMBEDDING_MODEL = 'gemini-embedding-001';
const CHAT_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

exports.generateEmbedding = async (text) => {
  console.log(text);
  try {
    const res = await axios.post(
      `${GEMINI_URL}/${EMBEDDING_MODEL}:embedContent?key=${process.env.GEMINI_API_KEY}`,
      { content: { parts: [{ text }] } , outputDimensionality : 768 }
    );
    console.log(res);
    return res.data.embedding.values;
  } catch (error) {
    console.log(error);
  }
};

// contents: [{ role: 'user' | 'model', parts: [{ text }] }, ...]
exports.generateChatReply = async (contents, systemInstruction) => {
  try {
    const res = await axios.post(
      `${GEMINI_URL}/${CHAT_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents,
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: { temperature: 0.4, maxOutputTokens: 512 },
      }
    );
    return res.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  } catch (error) {
    console.log(error?.response?.data || error.message);
  }
};
