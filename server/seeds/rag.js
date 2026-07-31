const mongoose = require('mongoose') ;

const dotenv = require('dotenv') ;

dotenv.config()
const Event = require('./../model/event.model.js');
const { generateEmbedding } = require('../config/gemini.js');


async function addEmbeddingOfExistingEvents(){
    const events = await Event.find({
        $or : [{embedding : {$exists  : false}} , {embedding : {$size : 0}}]
    }); 
    console.log(events.length )

    for(let event of events){
        const text = `${event.title}\n${event.location}\n${event.category}\n${event.description}`
        console.log(text)
        event.embedding = await generateEmbedding(text);
        await event.save();
        console.log(`${event.title}`)
    }
} 
// module.exports = addEmbeddingOfExistingEvents

async function createVCIndex(){
    try {
        await mongoose.connection.db.collection('events').createSearchIndex({
           name :  'events_vector', 
            type : "vectorSearch",
            definition : {
                fields : [{type : "vector" , path : 'embedding' , similarity : 'cosine' ,numDimensions : 768 }, {type : 'filter' , path : 'status'}] 
            }
        })
        console.log('vector search success');
    } catch (error) {
        console.log(error)
    }
}

async function execute(){
await mongoose.connect(process.env.MONGODB_URI)
await addEmbeddingOfExistingEvents()
await createVCIndex()
}

execute().then().catch((error)=>console.log(error))