const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
//emedding model =>
const EMBEDDING_MODEL = 'gemini-embedding-001';
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
