const Event = require('../model/event.model.js');
const cloudinary = require('../config/cloudinary.js');
const User = require('../model/user.model.js');
const bcrypt = require('bcrypt');
const transporter = require('../utils/sendEmail.js');
const { generateEmbedding } = require('../config/gemini.js');

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'approved' }).populate(
      'organizer',
      'name email'
    );
    res.json({
      success: true,
      length: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createEvent = async (req, res) => {
  try {
    console.log(req.body);
    const { title, description, category, location, date, capacity } = req.body;

    //NOte handle the banner url here
    console.log(req.file); //undefined

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'nexus-Events',
    });
    console.log(result);

    //NOTE embed the event so the chatbot's vector search can find it immediately
    const embedding = await generateEmbedding(
      `${title}\n${location}\n${category}\n${description}`
    );

    const event = await Event.create({
      title,
      description,
      category,
      location,
      date,
      capacity,
      bannerUrl: result?.secure_url,
      organizer: req.user.id,
      embedding,
    });

    res.status(201).json({
      success: true,
      message:
        'Event Created Successfully , It will be visible  after the admin approval',
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//NOTE event details fetch krlo get single event :id
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).populate('organizer', 'name email');
    if (!event) {
      return res.status(404).json({
        message: 'Event not found',
      });
    }

    res.json({ success: true, event });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//NOTE bookevents

exports.bookevent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        message: 'Event not found',
      });
    }

    let user;

    if (req.user) {
      //NOTE already logged in -> book with their own account, no guest form needed
      user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    } else {
      const { email, name, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: 'Email and password are required to book this event',
        });
      }

      user = await User.findOne({ email });

      if (!user) {
        if (!name) {
          return res.status(400).json({
            message: 'Name is required to create an account',
          });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        user = await User.create({ name, email, password: hashPassword });
      } else {
        //NOTE this email already belongs to an account - verify ownership before booking on their behalf
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
          return res.status(401).json({
            message:
              'An account with this email already exists. Please enter the correct password to book with it.',
          });
        }
      }
    }

    if (event.attendee.some((a) => a.toString() === user._id.toString())) {
      return res.status(409).json({
        message: 'You have already Booked this event',
      });
    }

    if (event.capacity && event.attendee.length >= event.capacity) {
      return res.status(409).json({
        message: 'This event is fully booked',
      });
    }

    event.attendee.push(user._id);
    await event.save();

    try {
      await transporter.sendMail({
        from: 'riteshpatidar088@gmail.com',
        to: user.email,
        subject: `Booking Confirmed: ${event.title}`,
        html: `<p>Hi ${user.name},</p><p>Your booking for <strong>${event.title}</strong> is confirmed.</p><p>Date: ${
          event.date ? new Date(event.date).toDateString() : 'TBA'
        }<br/>Location: ${event.location || 'TBA'}</p>`,
      });
    } catch (emailError) {
      console.log('Booking confirmation email failed:', emailError.message);
    }

    res.json({
      message:
        'Booking confirmed , Please check your mail , Use your password to login in the portel to see your booking',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//NOTE organizer/admin - events they created
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id }).sort({
      createdAt: -1,
    });
    res.json({
      success: true,
      length: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//NOTE attendee - events they have booked
exports.getMyBookings = async (req, res) => {
  try {
    const events = await Event.find({ attendee: req.user.id })
      .sort({ date: 1 })
      .populate('organizer', 'name email');
    res.json({
      success: true,
      length: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//NOTE attendee cancels their own booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const wasAttending = event.attendee.some(
      (a) => a.toString() === req.user.id
    );

    if (!wasAttending) {
      return res.status(409).json({ message: 'You are not booked for this event' });
    }

    event.attendee = event.attendee.filter(
      (a) => a.toString() !== req.user.id
    );
    await event.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//NOTE update Status
exports.updateStatus = async (req, res) => {
  try {
    console.log(req.body);
    const { status } = req.body;
    const { id } = req.params;
    const allowedStatus = ['approved', 'rejected'];

    if (!allowedStatus.includes(status)) {
      return res.json({
        message: `invalid status`,
      });
    }

    const event = await Event.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );

    res.json({
      message: `Event status change to ${status}`,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
