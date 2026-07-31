const Event = require('../model/event.model.js');

const { generateEmbedding } = require('../config/gemini.js');

exports.chat = async (req, res) => {
  try {
    const { currentMsg, conversationHistory } = req.body;
    console.log(currentMsg, conversationHistory);
    const vectorData = await generateEmbedding(currentMsg);
    console.log(vectorData);

    const match = await Event.aggregate([
      {
        $vectorSearch: {
          index: 'events_vector',
          path: 'embedding',
          queryVector: vectorData,
          limit : 5 ,
          numCandidates: 100,
          filter: { status: 'approved' },
        },
      }, {
        $project : {
            title : 1,
            description : 1 ,
            category : 1 ,
            location : 1 ,
            capacity : 1 ,
            date  :1
        }
      }
    ]);

    //generate reply 

    // reply

    res.status(200).json({
    //  reply
    })
  } catch (error) {
    console.log(error)
  }
};
