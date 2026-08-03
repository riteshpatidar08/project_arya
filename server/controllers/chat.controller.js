const Event = require('../model/event.model.js');

const { generateEmbedding, generateChatReply } = require('../config/gemini.js');

exports.chat = async (req, res) => {
  try {
    const { currentMsg, conversationHistory = [] } = req.body;

    if (!currentMsg || !currentMsg.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    const vectorData = await generateEmbedding(currentMsg);

    if (!vectorData) {
      return res.status(502).json({
        success: false,
        message: 'Failed to understand your message right now, please try again.',
      });
    }

    const matches = await Event.aggregate([
      {
        $vectorSearch: {
          index: 'events_vector',
          path: 'embedding',
          queryVector: vectorData,
          limit: 5,
          numCandidates: 100,
          filter: { status: 'approved' },
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          category: 1,
          location: 1,
          capacity: 1,
          date: 1,
        },
      },
    ]);

    const context = matches.length
      ? matches
          .map(
            (e, i) =>
              `${i + 1}. ${e.title}\nCategory: ${e.category}\nLocation: ${e.location}\nDate: ${
                e.date ? new Date(e.date).toDateString() : 'TBA'
              }\nCapacity: ${e.capacity ?? 'N/A'}\nDescription: ${e.description}`
          )
          .join('\n\n')
      : 'No matching events were found in the database for this query.';

    const systemInstruction = `You are the Nexus+ event assistant, helping users discover events hosted on the Nexus+ platform.
Answer the user's question using ONLY the event information provided in the CONTEXT below.
- If the context has relevant events, recommend them by name and mention useful details such as date, location and category.
- If none of the context events are relevant to the question, politely say you couldn't find a matching event on the platform. Never invent events that aren't in the context.
- Keep answers concise and conversational.

CONTEXT:
${context}`;

    const history = conversationHistory
      .filter((m) => m && m.text)
      .map((m) => ({
        role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

    const contents = [...history, { role: 'user', parts: [{ text: currentMsg }] }];

    const reply = await generateChatReply(contents, systemInstruction);

    res.status(200).json({
      success: true,
      reply: reply || "Sorry, I couldn't generate a response right now. Please try again.",
      events: matches,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong, please try again.',
    });
  }
};
