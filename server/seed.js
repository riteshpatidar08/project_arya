const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('./model/user.model.js');
const Event = require('./model/event.model.js');

// Load environment variables
dotenv.config();

const eventsToSeed = [
  {
    title: 'Nexus Developer Summit 2026',
    description: 'Join developers from around the globe for keynotes, workshops, and panels on Next.js, Tailwind v4, and AI agent integration. Learn best practices and network with industry leaders.',
    category: 'Technology',
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
    date: new Date('2026-09-15T09:00:00.000Z'),
    location: 'Silicon Valley Convention Center, CA & Online',
    capacity: 500,
    status: 'approved',
  },
  {
    title: 'AI & Future of Web Dev Panel',
    description: 'An interactive panel discussion with industry experts on how AI-driven agents and LLMs are revolutionizing the software engineering landscape, followed by a Q&A session.',
    category: 'Technology',
    bannerUrl: 'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=800&auto=format&fit=crop&q=60',
    date: new Date('2026-10-02T18:30:00.000Z'),
    location: 'Metropolitan Tech Center, NY',
    capacity: 150,
    status: 'approved',
  },
  {
    title: 'Nexus Mixer & Networking Night',
    description: 'Unwind after a long week of hacking! Grab a drink, meet fellow creators, and share what you\'ve been building in an informal, friendly setting.',
    category: 'Social',
    bannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=60',
    date: new Date('2026-08-20T19:00:00.000Z'),
    location: 'The Nexus Lounge, San Francisco, CA',
    capacity: 100,
    status: 'approved',
  },
  {
    title: 'Founder & Creator Brunch',
    description: 'Connect with startup founders, tech investors, and creative professionals over brunch. Share ideas, pitch products, and form collaborations.',
    category: 'Social',
    bannerUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60',
    date: new Date('2026-08-27T11:00:00.000Z'),
    location: 'Skyline Terrace Bistro, Austin, TX',
    capacity: 60,
    status: 'approved',
  },
  {
    title: 'UI/UX Figma Design Bootcamp',
    description: 'A hands-on, intensive workshop guiding you through the principles of component-driven UI design, auto-layouts, Figma variables, and high-fidelity prototyping.',
    category: 'Workshop',
    bannerUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=60',
    date: new Date('2026-09-05T10:00:00.000Z'),
    location: 'Creative Hub, Chicago, IL',
    capacity: 40,
    status: 'approved',
  },
  {
    title: 'Nexus Live: Acoustic Sessions',
    description: 'An intimate evening showcasing local singer-songwriters. Come for the beautiful melodies, stay for the cozy community vibes. Drinks and light snacks provided.',
    category: 'Entertainment',
    bannerUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=60',
    date: new Date('2026-09-20T20:00:00.000Z'),
    location: 'Underground Acoustics, Boston, MA',
    capacity: 80,
    status: 'approved',
  },
  {
    title: 'Morning Yoga & Mindfulness Flow',
    description: 'Start your weekend with positive energy. An all-levels vinyasa yoga session followed by guided mindfulness meditation and herbal tea.',
    category: 'Sports',
    bannerUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=60',
    date: new Date('2026-08-15T08:00:00.000Z'),
    location: 'Zen Garden Studio, Seattle, WA',
    capacity: 30,
    status: 'approved',
  },
  {
    title: 'Neon Paint & Sip Evening',
    description: 'Express your creativity with neon acrylic paints in a dark-room studio setting. Sip wine, listen to music, and create your masterpiece. No experience required.',
    category: 'Art',
    bannerUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop&q=60',
    date: new Date('2026-08-18T19:30:00.000Z'),
    location: 'Artisans Studio, Portland, OR',
    capacity: 25,
    status: 'approved',
  },
  {
    title: 'Nexus Hackathon & Pitch Day',
    description: 'Bring your product ideas to life in a fast-paced 24-hour challenge! Pitch to a panel of expert judges, win rewards, and network with co-founders.',
    category: 'Other',
    bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60',
    date: new Date('2026-09-26T09:00:00.000Z'),
    location: 'Innovation Loft, Denver, CO',
    capacity: 120,
    status: 'approved',
  }
];

async function seedDatabase() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables.');
    }

    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MONGODB');

    // Find or create a default organizer user to assign as organizer to seed events
    let organizer = await User.findOne({ role: 'organizer' });
    if (!organizer) {
      console.log('No organizer found. Creating a default seed organizer...');
      const hashedPassword = await bcrypt.hash('organizer123', 10);
      organizer = await User.create({
        name: 'Nexus Organizer',
        email: 'organizer@nexus.com',
        password: hashedPassword,
        role: 'organizer',
        isVerified: true,
      });
      console.log(`Default organizer created: ${organizer.email}`);
    } else {
      console.log(`Using existing organizer: ${organizer.email}`);
    }

    // Optional: Delete existing events that are pending or approved from database to avoid duplicates
    // Since this is a seeding script, we clear existing events to make it clean
    console.log('Clearing old events...');
    await Event.deleteMany({});
    console.log('Old events cleared.');

    // Prepare events data by appending the organizer id
    const seededEvents = eventsToSeed.map((evt) => ({
      ...evt,
      organizer: organizer._id,
      attendee: [],
    }));

    console.log('Inserting seed events...');
    const insertedEvents = await Event.insertMany(seededEvents);
    console.log(`Successfully seeded ${insertedEvents.length} events!`);

  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    console.log('Disconnecting from database...');
    await mongoose.disconnect();
    console.log('Disconnected.');
    process.exit(0);
  }
}

seedDatabase();
